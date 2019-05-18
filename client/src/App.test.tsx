import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders the debug level', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  const logLevel = div.querySelector('p[data-testid="log-level"]');
  expect(logLevel!.textContent).toBe('debug');
  ReactDOM.unmountComponentAtNode(div);
})
