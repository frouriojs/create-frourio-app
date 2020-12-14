import fs from 'fs'<% if (testing !== 'none') { %>
import { depend } from 'velona'<% } %>
import { Task } from '$/types'

type DB = {
  nextId: number
  tasks: Task[]
}

let dbPath = ''

const readDB = async (): Promise<DB> =>
  JSON.parse(await fs.promises.readFile(dbPath, 'utf8'))
const writeDB = (db: DB) =>
  fs.promises.writeFile(dbPath, JSON.stringify(db), 'utf8')

export const createDBFileIfNotExists = (dbFilePath: string) => {
  dbPath = dbFilePath

  if (fs.existsSync(dbPath)) return

  fs.writeFileSync(dbPath, JSON.stringify({ nextId: 0, tasks: [] }), 'utf8')
}

export const getTasks = <% if (testing === 'none') { %>async (limit?: number) =>
  (await readDB()).tasks.slice(0, limit)<% } else { %>depend({ readDB }, async ({ readDB }, limit?: number) =>
  (await readDB()).tasks.slice(0, limit)
)<% } %>

export const createTask = async (label: Task['label']) => {
  const db = await readDB()
  const task = { id: db.nextId, label, done: false }
  await writeDB({ nextId: db.nextId + 1, tasks: [...db.tasks, task] })
  return task
}

export const updateTask = async (
  id: Task['id'],
  partialTask: Partial<Pick<Task, 'label' | 'done'>>
) => {
  const db = await readDB()
  const task = db.tasks.find((t) => t.id === id)
  if (!task) return

  task.label = partialTask.label ?? task.label
  task.done = partialTask.done ?? task.done
  await writeDB({
    nextId: db.nextId,
    tasks: db.tasks.map((t) => (t.id === id ? task : t))
  })
}

export const deleteTask = async (id: Task['id']) => {
  const db = await readDB()
  await writeDB({
    nextId: db.nextId,
    tasks: db.tasks.filter((t) => t.id !== id)
  })
}
