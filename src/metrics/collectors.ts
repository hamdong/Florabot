import { Counter, Histogram, collectDefaultMetrics } from 'prom-client';

// Collect default system metrics (memory, CPU, etc.)
collectDefaultMetrics();

export const commandCounter = new Counter({
  name: 'discord_bot_command_total',
  help: 'Total number of Discord commands used',
  labelNames: ['command_name'],
});

export const commandErrorCounter = new Counter({
  name: 'discord_bot_command_errors_total',
  help: 'Total number of failed Discord command executions',
  labelNames: ['command_name'],
});

export const commandLatencyHistogram = new Histogram({
  name: 'discord_bot_command_duration_seconds',
  help: 'Histogram of command execution durations in seconds',
  labelNames: ['command_name'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});
