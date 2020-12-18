package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

type Service struct {
	Name   string
	URL    string
	Status bool
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
			log.Printf("Service %s is DOWN!\n", service.Name)
			service.Status = false
		} else {
			log.Printf("Service %s is UP!\n", service.Name)
			service.Status = true
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

func main() {
	monitoring := &MonitoringService{}

	monitoring.AddService("service1", "http://localhost:8081")
	monitoring.AddService("service2", "http://localhost:8082")

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
