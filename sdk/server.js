class PulseMetricsServer {
  constructor({ apiKey, baseUrl = "http://localhost:3000" }) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async track(eventName, properties = {}) {
    if (typeof eventName !== "string" || !eventName.trim()) {
      throw new Error("Event name must be a non-empty string.");
    }

    if (eventName.length > 100) {
      throw new Error("Event name must be 100 characters or less.");
    }

    if (
      typeof properties !== "object" ||
      properties === null ||
      Array.isArray(properties)
    ) {
      throw new Error("Event properties must be an object.");
    }

    const response = await fetch(`${this.baseUrl}/api/events/server`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        eventName,
        properties,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to record event");
    }

    return data;
  }
}

export default PulseMetricsServer;