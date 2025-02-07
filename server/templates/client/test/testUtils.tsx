import { render } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>{children}</SWRConfig>
);

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: Providers, ...options });

export * from '@testing-library/react';

export { customRender as render };
