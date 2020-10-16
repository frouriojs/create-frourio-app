import aspida from '@aspida/axios'
import api from '~/server/api/$api'

export const apiClient = api(aspida(undefined, {
  baseURL: `${process.env.ENV === 'production' ? '' : 'http://localhost:8080'}/api`
}))
