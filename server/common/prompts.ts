type PromptName =
  | 'dir'
  | 'server'
  | 'client'
  | 'building'
  | 'mode'
  | 'target'
  | 'aspida'
  | 'reactHooks'
  | 'pm'
  | 'daemon'
  | 'testing'
  | 'orm'
  | 'db'
  | 'skipDbChecks'
  | 'dbHost'
  | 'dbPort'
  | 'dbUser'
  | 'dbPass'
  | 'dbName'
  | 'dbFile'
  | 'ci'
  | 'deployBranch'
  // | 'developBranch'
  | 'deployServer'
  | 'staticHosting'
  | 'serverless'
  | 'serverSourcePath'
  | 'designatedServer'

export type Answers = Partial<Record<PromptName, string>>
export type Text = { en: string }

export type Note = {
  severity: 'info' | 'warn' | 'error'
  text: Text
}

type Lazy<T> = T | ((ans: Answers) => T)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoveLazy<T> = T extends (ans: Answers) => any
  ? never
  : T extends (infer U)[]
  ? RemoveLazy<U>[]
  : T extends object
  ? { [key in keyof T]: RemoveLazy<T[key]> }
  : T

type Choice = {
  name: string
  value: string
  disabled?: Lazy<null | Text>
  notes?: Lazy<Note[]>
}

export type Prompt = {
  name: PromptName
  message: Lazy<string>
  default?: string
  when?: Lazy<boolean>
  valid?: Lazy<boolean>
} & (
  | {
      type: 'list'
      choices: Choice[]
    }
  | { type: 'input'; notes?: Lazy<Note[]> }
)

export type DeterminedPrompt = RemoveLazy<Prompt>

export const cfaPrompts: Prompt[] = [
  {
    name: 'dir',
    message: 'Directory name (create new)',
    type: 'input'
  },
  {
    name: 'server',
    message: 'Server engine',
    type: 'list',
    choices: [
      { name: 'Fastify (5x faster)', value: 'fastify' },
      { name: 'Express', value: 'express' }
    ],
    default: 'fastify'
  },
  {
    name: 'client',
    message: 'Client framework',
    choices: [
      { name: 'Next.js (React)', value: 'next' },
      { name: 'Nuxt.js (Vue)', value: 'nuxt' },
      { name: 'Sapper (Svelte)', value: 'sapper' }
    ],
    type: 'list',
    default: 'next'
  },
  {
    name: 'building',
    message: 'Building mode',
    type: 'list',
    choices: [
      { name: 'Static (export)', value: 'static' },
      { name: 'Basic (build)', value: 'basic' }
    ],
    default: 'static',
    when: (ans) => ans.client === 'next' || ans.client === 'sapper'
  },
  {
    name: 'mode',
    message: 'Rendering mode',
    type: 'list',
    choices: [
      { name: 'Single Page App', value: 'spa' },
      { name: 'Universal (SSR / SSG)', value: 'universal' }
    ],
    default: 'spa',
    when: (ans) => ans.client === 'nuxt'
  },
  {
    name: 'target',
    message: 'Deployment target',
    type: 'list',
    choices: [
      { name: 'Static (JAMStack hosting)', value: 'static' },
      { name: 'Server (Node.js hosting)', value: 'server' }
    ],
    default: 'static',
    when: (ans) => ans.client === 'nuxt'
  },
  {
    name: 'aspida',
    message: 'HTTP client of aspida',
    choices: [
      { name: 'axios', value: 'axios' },
      { name: 'fetch', value: 'fetch' }
    ],
    type: 'list',
    default: 'axios'
  },
  {
    name: 'reactHooks',
    message: 'React Hooks for data fetching',
    type: 'list',
    choices: [
      { name: 'SWR', value: 'swr' },
      { name: 'React Query', value: 'query' },
      { name: 'None', value: 'none' }
    ],
    default: 'swr',
    when: (ans) => ans.client === 'next'
  },
  {
    name: 'daemon',
    message: 'Daemon process manager',
    choices: [
      { name: 'PM2', value: 'pm2' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'pm2'
  },
  {
    name: 'orm',
    message: 'O/R mapping tool',
    choices: [
      { name: 'Prisma (recommended)', value: 'prisma' },
      { name: 'TypeORM', value: 'typeorm' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'prisma'
  },
  {
    name: 'db',
    message: (ans) =>
      `Database type of ${
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ({ prisma: 'Prisma', typeorm: 'TypeORM' } as any)[ans.orm ?? ''] ?? ''
      }`,
    choices: [
      {
        name: 'SQLite',
        value: 'sqlite',
        disabled: (ans) => {
          if (ans.orm === 'typeorm') {
            return { en: 'Preparing SQLite support for TypeORM' }
          }
          return null
        }
      },
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgresql' }
    ],
    type: 'list',
    default: 'sqlite',
    when: (ans) => ans.orm !== 'none'
  },
  {
    name: 'skipDbChecks',
    message: 'Skip DB connection checks',
    choices: [
      { name: 'No', value: 'false' },
      { name: 'Yes', value: 'true' }
    ],
    type: 'list',
    default: 'false',
    when: (ans) => ans.orm !== 'none' && ans.db !== 'sqlite'
  },
  {
    name: 'dbHost',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env DATABASE_HOST=`,
    default: 'localhost',
    type: 'input',
    when: (ans) => ans.orm !== 'none' && ans.db !== 'sqlite'
  },
  {
    name: 'dbPort',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env DATABASE_PORT=`,
    type: 'input',
    default: '3306',
    when: (ans) => ans.orm !== 'none' && ans.db === 'mysql'
  },
  {
    name: 'dbPort',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env DATABASE_PORT=`,
    type: 'input',
    default: '5432',
    when: (ans) => ans.orm !== 'none' && ans.db === 'postgresql'
  },
  {
    name: 'dbUser',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env DATABASE_USER=`,
    type: 'input',
    when: (ans) => ans.orm !== 'none' && ans.db !== 'sqlite',
    valid: (ans) => {
      return ans.skipDbChecks === 'true' || (ans.dbUser ?? '') !== ''
    }
  },
  {
    name: 'dbPass',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env PASSWORD=`,
    type: 'input',
    when: (ans) => ans.orm !== 'none' && ans.db !== 'sqlite',
    valid: () => {
      // Password can be empty.
      return true
    }
  },
  {
    name: 'dbName',
    message: (ans) =>
      `server${ans.orm === 'prisma' ? '/prisma' : ''}/.env DATABASE=`,
    type: 'input',
    when: (ans) => ans.orm !== 'none' && ans.db !== 'sqlite',
    valid: (ans) => {
      return ans.skipDbChecks === 'true' || (ans.dbName ?? '') !== ''
    }
  },
  {
    name: 'dbFile',
    message: 'server/prisma/.env DATABASE_FILE=',
    type: 'input',
    default: './dev.db',
    when: (ans) => ans.db !== 'none' && ans.db === 'sqlite',
    valid: (ans) => {
      return ans.skipDbChecks === 'true' || (ans.dbFile ?? '') !== ''
    }
  },
  {
    name: 'testing',
    message: 'Testing framework',
    choices: [
      { name: 'Jest', value: 'jest' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'jest'
  },
  {
    name: 'pm',
    message: 'Package manager',
    choices: [
      { name: 'Yarn', value: 'yarn' },
      { name: 'Npm', value: 'npm' }
    ],
    type: 'list',
    default: 'yarn'
  },
  {
    name: 'ci',
    message: 'CI config',
    choices: [
      { name: 'GitHub Actions', value: 'actions' },
      // { name: 'CircleCI', value: 'circleci' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'actions'
  },
  // {
  //   name: 'deployBranch',
  //   message: 'Deploy branch name',
  //   type: 'input',
  //   default: 'main',
  //   when: (ans) => ans.ci !== 'none'
  // },
  // {
  //   name: 'developBranch',
  //   message: 'Develop branch name',
  //   type: 'input',
  //   default: 'develop',
  //   when: (ans) => ans.ci !== 'none'
  // },
  {
    name: 'deployServer',
    message: 'API server hosting',
    choices: [
      {
        name: 'Dedicated server',
        value: 'pm2',
        disabled: (ans) => {
          if (ans.orm === 'typeorm') {
            return { en: 'Preparing to support TypeORM' }
          }
          if (ans.daemon !== 'pm2') {
            return { en: 'Select **PM2** for process manager' }
          }
          if (ans.ci !== 'actions') {
            return { en: 'Select **GitHub Actions** for CI' }
          }
          return null
        },
        notes: (ans) => [
          {
            severity: 'info',
            text: {
              en: [
                'This uses [PM2](https://pm2.io) to deploy to your dedicated servers, cloud servers or VM instances.',
                '',
                'Ensure the server is installed `git` and `node`.',
                '',
                '### GitHub Actions Secrets',
                '',
                'Add following secrets.',
                '',
                '- **API_BASE_PATH**: Your API basepath. e.g. `/api`',
                `- **API_DATABASE_URL**: ${
                  ({
                    sqlite:
                      'Production URL for SQLite. e.g. `file:///mnt/efs-data/db.sqlite`',
                    mysql:
                      'Production URL for MySQL. e.g. `mysql://mysql-instance1.123456789012.us-east-1.rds.amazonaws.com:3306`',
                    postgresql:
                      'Production URL for Postgres. e.g. `postgres://myinstance.123456789012.us-east-1.rds.amazonaws.com:5432`'
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  } as any)[ans.db ?? '']
                }.`,
                '- **API_DEPLOY_HOST**: Dedicated server host. e.g. `ec2-public-ipv4-address.compute-1.amazonaws.com`',
                '- **API_DEPLOY_USER**: SSH username. e.g. `ci`',
                '- **API_DEPLOY_SSH_KEY**: SSH private key that can connect to the above host. e.g.',
                '  a. Run `ssh-keygen -t rsa -b 4096 -m PEM -f frourio-ci.key` on your local machine.',
                '  b. Copy contents of `frourio-ci.key` and paste it to this secrets value.',
                '  c. Send `frourio-ci.key.pub` to your host machine, and append it to `~/.ssh/known_hosts` on remote host.'
              ].join('\n')
            }
          }
        ]
      },
      {
        name: 'Serverless',
        value: 'serverless',
        disabled: (ans) => {
          if (ans.orm === 'typeorm') {
            return { en: 'Preparing to support TypeORM' }
          }
          if (ans.ci !== 'actions') {
            return { en: 'Select **GitHub Actions** for CI' }
          }
          return null
        }
      },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'deployBranch',
    message: 'Branch name to deploy',
    type: 'input',
    default: 'main'
  },
  {
    name: 'serverSourcePath',
    message: 'Path to place server source',
    type: 'input',
    default: '/opt/apiserver',
    when: (ans) => ans.deployServer === 'pm2',
    notes: [
      {
        severity: 'info',
        text: {
          en: ['API_DEPLOY_USER'].join('\n')
        }
      }
    ]
  },
  {
    name: 'staticHosting',
    message: 'Static hosting service',
    choices: [
      {
        name: 'GitHub Pages',
        value: 'pages',
        disabled: (ans) => {
          if (ans.ci !== 'actions') {
            return { en: 'Select **GitHub Actions** for CI' }
          }
          return null
        },
        notes: [
          {
            severity: 'info',
            text: {
              en: [
                '### GitHub Actions Secrets',
                '',
                'Add following secrets.',
                '',
                '- **API_ORIGIN**: API origin. e.g. `https://api.my-frourio-app.example`',
                '- **API_BASE_PATH**: API basepath. e.g. `/api`',
                '- _Optional_ **GH_PAGES_BASE_PATH**: Client hosting basepath.',
                '  - If omitted, GitHub repository name will be used. This is because GitHub hosts Pages at _github-username_.github.io/_repository-name_ with default settings.',
                '  - You can also use custom domain. When doing so, it is needed to use that basename. Set this `/` to host your client from root routing.'
              ].join('\n')
            }
          }
        ]
      },
      {
        name: 'Vercel',
        value: 'vercel',
        notes: (ans) => [
          {
            severity: 'info',
            text: {
              en: [
                '### Deploy to Vercel',
                '',
                '1. Visit [vercel.com](https://vercel.com) and create new project.',
                '2. Set **BUILD COMMAND** to `' +
                  ans.pm +
                  ' run build:client`.',
                '3. Add environment variables **API_BASE_PATH** and **API_ORIGIN**.'
              ].join('\n')
            }
          }
        ]
      },
      {
        name: 'Netlify',
        value: 'netlify',
        notes: (ans) => [
          {
            severity: 'info',
            text: {
              en: [
                '### Deploy to Netlify',
                '',
                '1. Visit [app.netlify.com](https://app.netlify.com) and create new project.',
                '2. Go to **Site Settings** > **Build & Deploy**',
                '  a. Set **Repository** to your remote repository',
                '  b. Set **Build command** to `' +
                  ans.pm +
                  ' run build:client`',
                '  c. Set **Publish directory** to `out/`',
                '3. Go to **Site Settings** > **Build & Deploy** > **Environment**',
                '  a. Add environment variables **API_ORIGIN** and **API_BASE_PATH**.'
              ].join('\n')
            }
          }
        ]
      },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'pages'
  },
  {
    name: 'serverless',
    message: 'Serverless service',
    when: (ans) => ans.deployServer === 'serverless',
    choices: [
      {
        name: 'AWS Lambda',
        value: 'lambda',
        disabled: (ans) => {
          if (ans.ci !== 'actions') {
            return { en: 'Select **GitHub Actions** for CI' }
          }
          return null
        },
        notes: () => [
          {
            severity: 'warn',
            text: {
              en: [
                'Little difficult option for beginners.',
                'You can find more concrete example [here](https://github.com/LumaKernel/frourio-sample-1/tree/master/infra).',
                '',
                'To develop serverless applications, you should consider how huge are the modules and bundled files.',
                'Please note that AWS Lambda has [the size limit](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) **250MB**.'
              ].join('\n')
            }
          },
          {
            severity: 'info',
            text: {
              en: [
                '### Deploy to AWS Lambda',
                '',
                'At least, you should prepare following for deploying to AWS Lambda.',
                '',
                '- [Lambda function](https://aws.amazon.com/lambda/) to respond to user requests.',
                "  - Set this Lambda's name to GitHub Actions Secrets **LAMBDA_FUNCTION_NAME_SERVER**",
                '- [Lambda function](https://aws.amazon.com/lambda/) to run migrations.',
                "  - Set this Lambda's name to GitHub Actions Secrets **LAMBDA_FUNCTION_NAME_MIGRATION**",
                '  - NOTE: Recommended to set longer time limit.',
                '- [Amazon S3](https://aws.amazon.com/s3/) to upload deployment artifacts like built bundle scripts and _node\\_modules_.',
                "  - Set this S3's bucket name to GitHub Actions Secrets **S3_BUCKET**",
                '  - _Optional_: To specify the S3 key prefix, also add **S3_PREFIX** to secrets. e.g. `deployments/`',
                '  - To elaborate, the key `${S3_BUCKET}/${S3_PREFIX}deployment_server.zip` is used to store the data.'
              ].join('\n')
            }
          }
        ]
      }
    ],
    type: 'list',
    default: 'lambda'
  }
]

/* eslint-disable @typescript-eslint/no-explicit-any */
export const calculatePrompts = (
  answers: Answers,
  target: any = cfaPrompts
): any => {
  if (target === null) return target
  if (Array.isArray(target)) {
    return target
      .map((e: any) => calculatePrompts(answers, e))
      .filter((e: any) => e !== undefined)
  }
  if (typeof target === 'object') {
    const res: any = {}
    for (const key of Object.getOwnPropertyNames(target)) {
      res[key] = calculatePrompts(answers, target[key])
    }
    if (res.when === false) return undefined
    return res
  }
  if (typeof target === 'function') return target(answers)
  return target
}

export const getAllDefaultAnswers = (): Answers => {
  const def: any = {}
  cfaPrompts.forEach((prompt) => (def[prompt.name] = prompt.default))
  return def
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const initPrompts = (answers: Answers): DeterminedPrompt[] => {
  const allDefault = getAllDefaultAnswers()
  const prompts: DeterminedPrompt[] = calculatePrompts({
    ...allDefault,
    ...answers
  })
  return prompts
}
