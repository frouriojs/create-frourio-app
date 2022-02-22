import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const Providers: React.FC = ({ children }) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender as render }
