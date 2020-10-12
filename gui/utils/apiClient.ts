import aspida from '@aspida/axios'
import api from '~/server/api/$api'

export const apiClient = api(aspida())
