import aspida from '@aspida/<%= aspida %>'
import api from '~/server/api/$api'

export const apiClient = <% if (aspida === 'axios') { %>api(aspida())<% } else { %>(process as { browser?: boolean }).browser
  ? api(aspida(fetch))
  : api(require('@aspida/node-fetch').default(require('node-fetch')))<% } %>
