import dotenv from 'dotenv';

dotenv.config();

const API_JWT_SECRET = process.env.API_JWT_SECRET ?? '';
const API_USER_ID = process.env.API_USER_ID ?? '';
const API_USER_PASS = process.env.API_USER_PASS ?? '';
const API_SERVER_PORT = +(process.env.API_SERVER_PORT ?? '8080');
const API_BASE_PATH = process.env.API_BASE_PATH ?? '';
const API_ORIGIN = process.env.API_ORIGIN ?? '';
const API_UPLOAD_DIR = process.env.API_UPLOAD_DIR ?? '';

export {
  API_BASE_PATH,
  API_JWT_SECRET,
  API_ORIGIN,
  API_SERVER_PORT,
  API_UPLOAD_DIR,
  API_USER_ID,
  API_USER_PASS,
};
