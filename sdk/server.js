class PulseMetricsServer {
  constructor({ apiKey, baseUrl = "http://localhost:3000" }) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }
    if (!apiKey.startsWith("sk_live_")) {
      throw new Error("Server SDK requires a secret API key.");
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async track(eventName, properties = {}, attempts = 0) {
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

    try {
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

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(`PulseMetrics API returned ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(
          data.message || `PulseMetrics API returned ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      if (attempts >= 2) {
        throw error;
      }

      await this.wait(1000);

      return this.track(eventName, properties, attempts + 1);
    }
  }
  async wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

export default PulseMetricsServer;
