package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"gopkg.in/yaml.v2"

	"service-health-monitoring/alerts"
)

type Service struct {
	Name   string
	URL    string
	Status bool
}

type Config struct {
	Services []Service `yaml:"services"`
}

type MonitoringService struct {
	services []*Service
	mutex    sync.Mutex
}

func (m *MonitoringService) AddService(name string, url string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.services = append(m.services, &Service{Name: name, URL: url})
}

func (m *MonitoringService) CheckServices() {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	for _, service := range m.services {
		resp, err := http.Get(service.URL + "/health")
		if err != nil || resp.StatusCode != http.StatusOK {
			if service.Status { // If the service was previously up, send a down alert
				log.Printf("Service %s is DOWN! Sending Slack alert...\n", service.Name)
				message := fmt.Sprintf(":x: *Service Down*: The service %s is currently DOWN. URL: %s", service.Name, service.URL)
				err = alerts.SendSlackAlert(message)
				if err != nil {
					log.Printf("Failed to send Slack alert: %v", err)
				}
				service.Status = false
			} else {
				log.Printf("Service %s is DOWN!\n", service.Name)
			}
		} else {
			if !service.Status { // If the service was previously down, send an up alert
				log.Printf("Service %s is UP! Sending recovery Slack alert...\n", service.Name)
				message := fmt.Sprintf(":white_check_mark: *Service Recovered*: The service %s is now UP. URL: %s", service.Name, service.URL)
				err = alerts.SendSlackAlert(message)
				if err != nil {
					log.Printf("Failed to send recovery Slack alert: %v", err)
				}
				service.Status = true
			} else {
				log.Printf("Service %s is UP!\n", service.Name)
			}
		}
	}
}

func (m *MonitoringService) ExportMetrics(w http.ResponseWriter, r *http.Request) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	for _, service := range m.services {
		status := 0
		if service.Status {
			status = 1
		}
		fmt.Fprintf(w, "service_health{name=\"%s\"} %d\n", service.Name, status)
	}
}

func LoadConfigFromFile(filename string) (*Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config Config
	err = yaml.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}

	return &config, nil
}

func main() {
	monitoring := &MonitoringService{}

	monitoring.AddService("service1", "http://localhost:8081")
	monitoring.AddService("service2", "http://localhost:8082")

	configFile := os.Getenv("CONFIG_FILE")
	var config *Config
	var err error

	if configFile != "" {
		// Load services from YAML file
		config, err = LoadConfigFromFile(configFile)
		if err != nil {
			log.Fatalf("Error loading config from file: %v", err)
		}
		log.Println("Loaded services from file")
	}

	for _, service := range config.Services {
		monitoring.AddService(service.Name, service.URL)
	}

	go func() {
		for {
			monitoring.CheckServices()
			time.Sleep(10 * time.Second)
		}
	}()

	http.HandleFunc("/metrics", monitoring.ExportMetrics)

	fmt.Println("Monitoring service is running on port 2112")
	log.Fatal(http.ListenAndServe(":2112", nil))
}
