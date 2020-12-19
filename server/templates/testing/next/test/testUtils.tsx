import React, { ReactChild } from 'react'
import { render } from '@testing-library/react'
import { SWRConfig } from 'swr'

const Providers = ({ children }: { children: ReactChild }) => (
  <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
)

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'

export { customRender as render }
