const axios = require("axios");

const PulseMetrics = {
  apiKey: null,
  baseUrl: null,

  init({ apiKey, baseUrl = "http://localhost:3000" }) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;

    console.log("PulseMetrics initialized");
  },
  async track(eventName, properties = {}) {
    if (!this.apiKey) {
      throw new Error("PulseMetrics has not been initialized.");
    }
    if (!eventName) {
      throw new Error("Event name is required.");
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/events`,
        {
          eventName,
          properties,
        },
        {
          headers: {
            "x-api-key": this.apiKey,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        "PulseMetrics Error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};
module.exports = PulseMetrics;
