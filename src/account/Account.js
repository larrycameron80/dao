import React, { Component } from 'react';
import Token from '../token/Token';
import Ethereum from '../ethereum/Ethereum';

class Account extends Component {
  render() {
    return (
      <div className="Account">
        <h1>My account</h1>
        <Token />
        <Ethereum />
      </div>
    );
  }
}

export default Account;
