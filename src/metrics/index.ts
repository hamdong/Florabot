import http from 'http';
import { register } from 'prom-client';

// Start HTTP server for Prometheus to scrape
export function startMetricsServer(port: number = 9200) {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', register.contentType);
      res.end(await register.metrics());
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });

  server.listen(port, () => {
    console.log(`[Metrics] Server running on http://localhost:${port}/metrics`);
  });
}
