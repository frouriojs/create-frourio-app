import axios from 'axios'
import aspida from '@aspida/axios'
import api from '~/apis/$api'

export const apiClient = api(aspida(axios, { baseURL: process.env.baseURL }))
