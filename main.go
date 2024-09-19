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

// Service represents a monitored service with its details and status
type Service struct {
	Name   string
	URL    string
	Status bool
}

// Config represents the configuration structure for services
type Config struct {
	Services []Service `yaml:"services"`
}

// MonitoringService manages the monitoring of multiple services
type MonitoringService struct {
	services []*Service
	mutex    sync.RWMutex
}

// AddService adds a new service to the monitoring list
func (m *MonitoringService) AddService(name, url string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.services = append(m.services, &Service{Name: name, URL: url})
}

// CheckServices performs health checks on all registered services
func (m *MonitoringService) CheckServices() {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, service := range m.services {
		m.checkServiceHealth(service)
	}
}

// checkServiceHealth checks the health of a single service and sends alerts if necessary
func (m *MonitoringService) checkServiceHealth(service *Service) {
	resp, err := http.Get(service.URL + "/health")
	if err != nil || resp.StatusCode != http.StatusOK {
		m.handleServiceDown(service)
	} else {
		m.handleServiceUp(service)
	}
}

// handleServiceDown processes a service that is down and sends an alert if necessary
func (m *MonitoringService) handleServiceDown(service *Service) {
	if service.Status {
		log.Printf("Service %s is DOWN! Sending Slack alert...\n", service.Name)
		message := fmt.Sprintf(":x: *Service Down*: The service %s is currently DOWN. URL: %s", service.Name, service.URL)
		if err := alerts.SendSlackAlert(message); err != nil {
			log.Printf("Failed to send Slack alert: %v", err)
		}
		service.Status = false
	} else {
		log.Printf("Service %s is DOWN!\n", service.Name)
	}
}

// handleServiceUp processes a service that is up and sends a recovery alert if necessary
func (m *MonitoringService) handleServiceUp(service *Service) {
	if !service.Status {
		log.Printf("Service %s is UP! Sending recovery Slack alert...\n", service.Name)
		message := fmt.Sprintf(":white_check_mark: *Service Recovered*: The service %s is now UP. URL: %s", service.Name, service.URL)
		if err := alerts.SendSlackAlert(message); err != nil {
			log.Printf("Failed to send recovery Slack alert: %v", err)
		}
		service.Status = true
	} else {
		log.Printf("Service %s is UP!\n", service.Name)
	}
}

// ExportMetrics writes the current status of all services in Prometheus format
func (m *MonitoringService) ExportMetrics(w http.ResponseWriter, r *http.Request) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for _, service := range m.services {
		status := 0
		if service.Status {
			status = 1
		}
		fmt.Fprintf(w, "service_health{name=\"%s\"} %d\n", service.Name, status)
	}
}

// LoadConfigFromFile reads and parses the YAML configuration file
func LoadConfigFromFile(filename string) (*Config, error) {
	data, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return &config, nil
}

func main() {
	monitoring := &MonitoringService{}

	// Add default services
	monitoring.AddService("service1", "http://localhost:8081")
	monitoring.AddService("service2", "http://localhost:8082")

	// Load services from YAML file if CONFIG_FILE environment variable is set
	if configFile := os.Getenv("CONFIG_FILE"); configFile != "" {
		config, err := LoadConfigFromFile(configFile)
		if err != nil {
			log.Fatalf("Error loading config from file: %v", err)
		}
		log.Println("Loaded services from file")

		for _, service := range config.Services {
			monitoring.AddService(service.Name, service.URL)
		}
	}

	// Start the monitoring goroutine
	go func() {
		for {
			monitoring.CheckServices()
			time.Sleep(10 * time.Second)
		}
	}()

	// Set up HTTP server for metrics endpoint
	http.HandleFunc("/metrics", monitoring.ExportMetrics)

	// Start the HTTP server
	fmt.Println("Monitoring service is running on port 2112")
	if err := http.ListenAndServe(":2112", nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
