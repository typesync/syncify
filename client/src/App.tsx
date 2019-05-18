import React, { useEffect } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';
import { LogLevels } from 'shared';

const App: React.FC = () => {
  useEffect(() => {
    io(`http://localhost:${process.env.REACT_APP_SERVER_PORT}`);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p data-testid="log-level">{LogLevels.Debug}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
