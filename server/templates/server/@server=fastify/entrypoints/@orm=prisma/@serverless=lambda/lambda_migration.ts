/* eslint-disable require-await */
import { execFileSync } from 'child_process'
import type { Handler } from 'aws-lambda'

const handler: Handler = async () => {
  // Assume this executed on project root.
  execFileSync('npm', ['run', 'migrate:deploy'])

  return 'migration_ok'
}

exports.handler = handler
