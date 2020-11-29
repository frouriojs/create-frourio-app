import axios from 'axios'

test('server', async () => {
  const client = axios.create({ baseURL: 'http://localhost:8080/api' })

  const res1 = await client.get('tasks')
  expect(res1.data).toHaveLength(0)

  await client.post('tasks', { label: 'test' })

  const res2 = await client.get('tasks')
  expect(res2.data).toHaveLength(1)
  expect(res2.data[0].label).toEqual('test')

  await expect(
    client.get('user', { headers: { authorization: 'token' } })
  ).rejects.toHaveProperty('response.status', 400)
  await expect(
    client.post('token', { id: 'hoge', pass: 'huga' })
  ).rejects.toHaveProperty('response.status', 401)

  const res3 = await client.post('token', { id: 'id', pass: 'pass' })
  await expect(
    client.get('user', {
      headers: { authorization: `Bearer ${res3.data.token}` }
    })
  ).resolves.toHaveProperty('data.name', 'sample user')
})
