import React, { Component } from 'react';
import logo from './assets/images/Talao-logo.png';
import './App.css';
import Web3 from './web3/Web3';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header white">
          <a href="/">
            <img src={ logo } className="App-header-logo" alt="logo" />
          </a>
          <h1 className="App-header-title">Talao</h1>
          <p>The first Ethereum-based Talents Autonomous Organization.</p>
        </header>
        <section className="App-content yellow">
          <Web3 />
        </section>
        <footer className="App-footer green">
          <p>Talao DAO prototype v0.2.4</p>
          <ul className="App-footer-links">
            <li><a href="/" target="_blank" rel="noopener noreferrer">Source code</a></li>
            <li><a href="https://talao.io" target="_blank" rel="noopener noreferrer">Talao.io</a></li>
            <li><a href="https://www.emindhub.com" target="_blank" rel="noopener noreferrer">eMindHub.com</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default App;
