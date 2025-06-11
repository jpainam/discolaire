// pm2.config.js
module.exports = {
  apps: [
    {
      name: "discolaire-worker",
      script: "./dist/index.js",
      cwd: "./packages/workers",
      instances: 1, // or "max" for all CPUs
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        REDIS_URL: "redis://localhost:6379",
      },
    },
  ],
};
