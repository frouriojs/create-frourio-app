import aspida from '@aspida/fetch'
import api from '~/server/api/$api'

export const apiClient = api(aspida(fetch, { baseURL: process.env.BASE_URL }))
