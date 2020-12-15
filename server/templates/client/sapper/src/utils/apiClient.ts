import aspida from '@aspida/<%= aspida %>'
import api from '~/server/api/$api'

export const apiClient = api((process as { browser?: boolean }).browser ? (aspida as any).default() : <% if (aspida === 'axios') { %>aspida()<% } else { %>require('@aspida/node-fetch').default(require('node-fetch'))<% } %>)
