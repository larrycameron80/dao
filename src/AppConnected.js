import React, { Component } from 'react';
import './AppConnected.css';
import Token from './token/Token';
import Objection from './objection/Objection';

class AppConnected extends Component {
  render() {
    return (
      <div className="AppConnected">
        <Token />
        <div className="AppConnected-main container yellow">
          <Objection />
        </div>
      </div>
    );
  }
}

export default AppConnected;
