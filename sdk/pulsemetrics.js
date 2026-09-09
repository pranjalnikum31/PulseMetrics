const PulseMetrics = {
  apiKey: null,
  baseUrl: null,
  eventQueue: [],
  maxQueueSize: 100,

  init({ apiKey, baseUrl = "http://localhost:3000" }) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }

    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }

    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    console.log("PulseMetrics initialized");
    if (typeof window !== "undefined") {
      this.track("page_view", {
        path: window.location.pathname,
        url: window.location.href,
      }).catch((error) => {
        console.error("Failed to record page view:", error.message);
      });
    }

    document.addEventListener("click", (e) => {
      const element =
        e.target instanceof Element ? e.target.closest("button, a") : null;

      if (!element) return;

      this.track("click", {
        tag: element.tagName,
        id: element.id || null,
        path: window.location.pathname,
      }).catch((error) => {
        console.error("Failed to record click:", error.message);
      });
    });
    window.addEventListener("online", () => {
      this.flush();
    });
    this.flushInterval = setInterval(() => {
      if (this.eventQueue.length > 0) {
        this.flush();
      }
    }, 5000);
  },

  async track(eventName, properties = {}) {
    if (!this.apiKey) {
      throw new Error("PulseMetrics has not been initialized.");
    }

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
    const event = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };

    if (this.eventQueue.length >= this.maxQueueSize) {
      this.eventQueue.shift();
    }

    this.eventQueue.push(event);

    return this.sendEvent(event);
  },

  async sendEvent(event, attempts = 0) {
    try {
      const response = await fetch(`${this.baseUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          eventName: event.eventName,
          properties: event.properties,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to record event");
      }

      const index = this.eventQueue.indexOf(event);

      if (index !== -1) {
        this.eventQueue.splice(index, 1);
      }

      return data;
    } catch (error) {
      if (attempts >= 2) {
        console.error("PulseMetrics Error:", error.message);
        return null;
      }
      await this.wait(1000); // Wait for 1 second before retrying

      return this.sendEvent(event, attempts + 1);
    }
  },
  async flush() {
    const events = [...this.eventQueue];

    for (const event of events) {
      await this.sendEvent(event);
    }
  },

  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },
};
//eventname normalization and properties size
export default PulseMetrics;
