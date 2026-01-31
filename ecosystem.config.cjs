// PM2 Ecosystem Configuration for Izumo CMS
module.exports = {
  apps: [
    {
      name: 'izumo-cms',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=izumo-cms --local --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
}
