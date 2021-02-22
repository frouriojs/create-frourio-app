import { init } from '$/service/app'
import { API_SERVER_PORT } from '$/service/envValues'

<% if (daemon === 'pm2') { %>
init()
  .listen(API_SERVER_PORT, '0.0.0.0')
  .then(() => {
    // PM2 graceful start
    // See also https://pm2.keymetrics.io/docs/usage/signals-clean-restart/
    process.send?.('ready')
  })
<% } else { %>
init().listen(API_SERVER_PORT, '0.0.0.0')
<% } %>
