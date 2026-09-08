const PulseMetrics = {
  apiKey: null,
  baseUrl: null,
  eventQueue: [],

  init({ apiKey, baseUrl = "http://localhost:3000" }) {
    if (!apiKey) {
      throw new Error("API key is required.");
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

    this.eventQueue.push(event);
    try {
      const response = await fetch(`${this.baseUrl}/api/events`, {
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
      this.eventQueue.shift();

      return data;
    } catch (error) {
      console.error("PulseMetrics Error:", error.message);
      return null;
    }
  },
};
//eventname normalization and properties size
export default PulseMetrics;
