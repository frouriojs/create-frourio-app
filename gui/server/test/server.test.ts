import controller from '$/api/tasks/controller'
import { getTasks } from '$/service/tasks'

test('dependency injection into controller', async () => {
  let printedMessage = ''

  const injectedController = controller.inject({
    getTasks: getTasks.inject({
      readDB: () => Promise.resolve({
        nextId: 5,
        tasks: [
          { id: 0, label: 'task1', done: false },
          { id: 1, label: 'task2', done: false },
          { id: 2, label: 'task3', done: true },
          { id: 3, label: 'task4', done: true },
          { id: 4, label: 'task5', done: false }
        ]
      })
    }),
    print: (text: string) => {
      printedMessage = text
    }
  })()

  const limit = 3
  const message = 'test message'
  const res = await injectedController.get({
    query: { limit, message }
  })

  expect(res.body).toHaveLength(limit)
  expect(printedMessage).toBe(message)
})
