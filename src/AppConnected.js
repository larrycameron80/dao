import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './AppConnected.css';
import Token from './token/Token';
import Objection from './objection/Objection';

class AppConnected extends Component {
  render() {
    return (
      <div className="AppConnected">
        <nav>
          <Link to="/token">Token</Link>
          <Link to="/objection">Objection</Link>
        </nav>
        <main>
          <Route exact path="/token" component={ Token } />
          <Route exact path="/objection" component={ Objection } />
        </main>
      </div>
    );
  }
}

export default AppConnected;
