import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';

const App: React.FC = () => (
  <Router>
    <>
      <nav>
        <h2>navigation</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={Home} />
      <Route path="/room/:roomId" exact component={Room} />
    </>
  </Router>
);
export default App;
