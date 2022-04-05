# service-health-monitoring
Service Health Monitoring is a lightweight tool written in Go, designed to periodically check the health of services via HTTP requests to their health-check endpoints. It collects and exports basic metrics, such as service availability, in a format compatible with Prometheus. This tool is simple to set up, making it perfect for small-scale projects that require basic monitoring without the complexity of full-fledged systems like Prometheus.

## Features
Health Check Monitoring: Periodically checks the health status of services using their /health endpoints.
Metrics Export: Exports service availability metrics in a Prometheus-compatible format.
Simplicity: Minimal configuration, ideal for smaller projects.


## Prerequisites
- Go
- Services with a /health endpoint for health-check monitoring

## Installation
Clone this repository:


```
git clone https://github.com/hlobys/service-health-monitoring.git
cd service-health-monitoring
```


## Initialize Go modules:


```
go mod tidy
```


## Configuration via config.yaml
You can configure the services to monitor by using a YAML file. This method allows you to easily manage multiple services without modifying the source code. The `config.yaml` file defines the services and their health-check URLs in a simple, human-readable format.

Example `config.yaml`


```
services:
  - name: service1
    url: http://localhost:8081
  - name: service2
    url: http://localhost:8
```


## Slack Alerts
The Service Health Monitoring tool now supports sending alerts to Slack channels via Slack's incoming webhooks.

### How to Set Up Slack Alerts
1. Create an Incoming Webhook:

- Go to the Slack API Incoming Webhooks page and create a new webhook for your workspace.
- Choose the channel where you want to post the alerts and copy the provided webhook URL.

2. Set the Webhook URL:

- Set the SLACK_WEBHOOK_URL environment variable to the webhook URL you copied:


```
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/your/webhook/url"
```


## Run the service:


```
export CONFIG_FILE=config.yaml
go run main.go
```


## Usage
Add the services you want to monitor by specifying their name and URL in the code. For example, in main.go:


```
monitoring.AddService("service1", "http://localhost:8081")
monitoring.AddService("service2", "http://localhost:8082")
```


Access the metrics at http://localhost:2112/metrics to view the health status of the services.

Example Output## 


```
service_health{name="service1"} 1
service_health{name="service2"} 0
```


In this example, service1 is healthy (1), and service2 is down (0).