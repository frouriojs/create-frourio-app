import React from 'react'
import { render } from '@testing-library/react'<% if (reactHooks === 'swr') { %>
import { SWRConfig } from 'swr'<% } else if (reactHooks === 'query') { %>
import { QueryClient, QueryClientProvider } from 'react-query'<% } %>

// eslint-disable-next-line react/prop-types
const Providers: React.FC = ({ children }) => <% if (reactHooks === 'swr') { %>(
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
)<% } else if (reactHooks === 'query') { %>{
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}<% } %>

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender as render }
