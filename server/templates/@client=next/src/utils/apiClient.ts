import aspida from '@aspida/<%= aspida %>'
import api from '$/api/$api'

export const apiClient = api(aspida(<% if (aspida !== 'axios') { %>undefined, { throwHttpErrors: true }<% } %>))
