import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  detectOpenHandles: true,
  forceExit: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['jest-expect-message'],
  testPathIgnorePatterns: ['/templates/'],
  modulePathIgnorePatterns: ['/templates/'],
  moduleDirectories: ['node_modules', '<rootDir>']
}

export default config
