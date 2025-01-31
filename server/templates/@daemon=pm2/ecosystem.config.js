module.exports = {
  apps: [
    {
      name: 'frourio-app',
      script: 'index.js',
      cwd: './server/',
      instances: 1,
      wait_ready: true,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production',
        API_DATABASE_URL: process.env.API_DATABASE_URL,
        API_JWT_SECRET: process.env.API_JWT_SECRET,
        API_USER_ID: process.env.API_USER_ID,
        API_USER_PASS: process.env.API_USER_PASS,
        API_ORIGIN: process.env.API_ORIGIN,
        API_BASE_PATH: process.env.API_BASE_PATH,
        API_SERVER_PORT: process.env.API_SERVER_PORT,
        API_UPLOAD_DIR: process.env.API_UPLOAD_DIR
      }
    }
  ]
}
