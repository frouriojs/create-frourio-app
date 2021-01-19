import React from 'react'
import { render } from '@testing-library/react'
import { SWRConfig } from 'swr'

// eslint-disable-next-line react/prop-types
const Providers: React.FC = ({ children }) => (
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
)

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender as render }
