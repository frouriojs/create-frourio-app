import aspida from '@aspida/axios'
import api from '~/server/api/$api'

export const apiClient = api(
  aspida(undefined, {
    baseURL: `${
      process.env.ENV === 'development' ? 'http://localhost:3001' : ''
    }/api`
  })
)
