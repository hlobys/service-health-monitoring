import * as React from 'react';
import App from './app';
const projectName = 'dictionary';

const Root = () => <App />

window.tarantool_enterprise_core.register(
  projectName,
  [
    {
      label: 'dictionary',
      path: `/dictionary`
    }
  ],
  Root,
  'react'
);

if (window.tarantool_enterprise_core.install) {
  window.tarantool_enterprise_core.install();
}
