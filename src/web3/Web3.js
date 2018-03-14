import React, { Component } from 'react';
import './Web3.css';
import { Web3Provider } from 'react-web3';
import AppConnected from '../AppConnected';

class Web3Unavailable extends Component {
  render() {
    return (
      <div className="Web3 blue">
        <p>You need to use a web browser with the <a href="https://metamask.io/" rel="noopener noreferrer" target="_blank">Metamask extension</a> enabled, or any Ethereum compatible web browser.</p>
      </div>
    );
  }
}

class Web3UnavailableAccount extends Component {
  render() {
    return (
      <div className="Web3 blue">
        <p>Great, you have a web browser with the Metamask extension enabled!</p>
        <p><strong>Log in now in Metamask</strong> to access Ethereum features.</p>
      </div>
    );
  }
}

class Web3 extends Component {
  render() {
    return (
      <Web3Provider
        web3UnavailableScreen = { Web3Unavailable }
        accountUnavailableScreen = { Web3UnavailableAccount }
      >
        <AppConnected />
      </Web3Provider>
    );
  }
}

export default Web3;
