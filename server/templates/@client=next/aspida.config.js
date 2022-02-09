require('dotenv').config({ path: 'server/.env' })

module.exports = {
  input: 'server/api',
  baseURL: process.env.NODE_ENV === 'production' ? `${process.env.API_ORIGIN || ''}${process.env.API_BASE_PATH || ''}` : `${window.location.protocol}//${window.location.hostname}:${process.env.API_PORT}${process.env.API_BASE_PATH || ''}`,
}
