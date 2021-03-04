import aspida from '@aspida/<%= aspida %>'
import api from '$/api/$api'

export const apiClient = api(<% if (aspida === 'axios') { %>aspida()<% } else { %>
  (process as { browser?: boolean }).browser
    ? aspida(undefined, { throwHttpErrors: true })
    : require('@aspida/node-fetch').default(require('node-fetch'), {
        throwHttpErrors: true
      })
<% } %>)
