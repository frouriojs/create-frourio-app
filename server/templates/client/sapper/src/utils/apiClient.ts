import aspida from '@aspida/<%= aspida %>'
import api from '~/server/api/$api'

export const apiClient = api(<% if (aspida === 'axios') { %>aspida()<% } else { %>(process as { browser?: boolean }).browser ? aspida() : require('@aspida/node-fetch').default(require('node-fetch'))<% } %>)
