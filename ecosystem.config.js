module.exports = {
  apps: [
    {
      name: 'notify-service',
      script: 'npx',
      cwd: './services/notify-service',
      args: 'yarn dev',
      env: {
        PORT: 3001,
      },
    },
    {
      name: 'graphql-service',
      script: 'npx',
      cwd: './services/graphql-service',
      args: 'yarn dev',
      env: {
        PORT: 4000,
      },
    },
    {
      name: 'monitor-service',
      script: 'npx',
      cwd: './services/monitor-service',
      args: 'yarn dev',
      env: {
        SERVICE_PORT: 8123,
      },
    },
  ],
};
