import aspida from '@aspida/axios'
import api from '~/server/api/$api'

export const createApiClient = () =>
  api(
    aspida(undefined, {
      baseURL: '/api'
    })
  )
