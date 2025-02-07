import aspida from '@aspida/axios';
import api from 'api/$api';

export const apiClient = api(aspida(undefined, { baseURL: '/api' }));
