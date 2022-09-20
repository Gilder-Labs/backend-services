module.exports = {
  apps: [
    {
      name: 'notify-service',
      script: 'npx',
      cwd: './services/notify-service',
      args: 'pnpm dev',
      env: {
        PORT: 3001,
      },
    },
    {
      name: 'monitor-service',
      script: 'npx',
      cwd: './services/monitor-service',
      args: 'pnpm dev',
      env: {
        PORT: 3000,
      },
    },
  ],
};
