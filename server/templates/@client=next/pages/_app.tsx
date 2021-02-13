import '../styles/globals.css'<% if (reactHooks === 'query') { %>
import { QueryClient, QueryClientProvider } from 'react-query'<% } %>
import type { AppProps } from 'next/app'
<% if (reactHooks === 'query') { %>
const queryClient = new QueryClient()
<% } %>
function MyApp({ Component, pageProps }: AppProps) {
  return <% if (reactHooks === 'query') { %>(
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )<% } else { %><Component {...pageProps} /><% } %>
}

export default MyApp
