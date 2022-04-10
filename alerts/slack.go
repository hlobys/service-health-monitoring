package alerts

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// SlackPayload defines the payload structure for Slack messages.
type SlackPayload struct {
	Text string `json:"text"`
}

// SendSlackAlert sends an alert to Slack via an incoming webhook.
func SendSlackAlert(message string) error {
	webhookURL := os.Getenv("SLACK_WEBHOOK_URL")
	if webhookURL == "" {
		return fmt.Errorf("SLACK_WEBHOOK_URL environment variable not set")
	}

	payload := SlackPayload{
		Text: message,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	resp, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("failed to send Slack alert, status: %d", resp.StatusCode)
	}

	return nil
}
