import <%= server %> from '<%= server %>'
import controller from '$/api/tasks/controller'
import { getTasks } from '$/service/tasks'

test('dependency injection into controller', async () => {
  let printedMessage = ''

  const injectedController = controller.inject({
    getTasks: getTasks.inject({
      <% if (orm === 'prisma') { %>prisma: {
        task: {
          findMany: () =>
            Promise.resolve([
              { id: 0, label: 'task1', done: false },
              { id: 1, label: 'task2', done: false },
              { id: 2, label: 'task3', done: true },
              { id: 3, label: 'task4', done: true },
              { id: 4, label: 'task5', done: false }
            ])
        }
      }<% } else if (orm === 'typeorm') { %>taskRepository: () => ({
        find: () =>
          Promise.resolve([
            { id: 0, label: 'task1', done: false },
            { id: 1, label: 'task2', done: false },
            { id: 2, label: 'task3', done: true },
            { id: 3, label: 'task4', done: true },
            { id: 4, label: 'task5', done: false }
          ])
      })<% } else { %>readDB: () =>
        Promise.resolve({
          nextId: 5,
          tasks: [
            { id: 0, label: 'task1', done: false },
            { id: 1, label: 'task2', done: false },
            { id: 2, label: 'task3', done: true },
            { id: 3, label: 'task4', done: true },
            { id: 4, label: 'task5', done: false }
          ]
        })<% } %>
    }),
    print: (text: string) => {
      printedMessage = text
    }
  })(<%= server %>())

  const limit = 3
  const message = 'test message'
  const res = await injectedController.get({
    query: { limit, message }
  })

  expect(res.body).toHaveLength(limit)
  expect(printedMessage).toBe(message)
})
