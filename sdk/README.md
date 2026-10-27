# PulseMetrics JavaScript SDK

Official JavaScript SDK for tracking events with PulseMetrics.

## Installation

```bash
npm install pulsemetrics
```

## Browser Usage

```js
import PulseMetrics from "pulsemetrics";

PulseMetrics.init({
  apiKey: "YOUR_PUBLIC_API_KEY",
  baseUrl: "https://your-api-domain.com"
});

PulseMetrics.track("button_clicked", {
  page: "home"
});
```

The browser SDK automatically tracks page views and clicks on buttons and links.

## Server Usage

```js
import PulseMetricsServer from "pulsemetrics/server";

const analytics = new PulseMetricsServer({
  apiKey: process.env.PULSEMETRICS_SECRET_KEY,
  baseUrl: "https://your-api-domain.com"
});

await analytics.track("order_completed", {
  orderId: "123"
});
```

Keep secret API keys on the server. Never expose them in browser code.

## Configuration

- `apiKey`: Your PulseMetrics API key.
- `baseUrl`: Your PulseMetrics API URL. Configure this for your deployed backend.

## License

MIT