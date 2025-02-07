import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: dotenv.config().parsed,
    exclude: ['templates/**'],
  },
});
