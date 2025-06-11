// pm2.dev.config.js
module.exports = {
  apps: [
    {
      name: "discolaire-worker-dev",
      script: "./build/index.js",
      cwd: "./packages/workers",
      watch: ["src"],
      ignore_watch: ["node_modules", "dist"],
      instances: 1,
      autorestart: true,
      exec_mode: "fork",
      interpreter: "ts-node",
      env: {
        NODE_ENV: "development",
        REDIS_URL: "redis://localhost:6379",
      },
    },
  ],
};
