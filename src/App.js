import React, { Component } from 'react';
import logo from './assets/images/Talao.svg';
import './App.css';
import Web3Wrapper from './web3wrapper/Web3Wrapper';
import AppConnected from './AppConnected';

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
        <section className="App-main white">
          <Web3Wrapper>
            <AppConnected />
          </Web3Wrapper>
        </section>
        <footer className="App-footer green">
          <p>Talao DAO prototype v0.4.0</p>
          <ul className="App-footer-links">
            <li><a href="https://github.com/TalaoDAO" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="https://ico.talao.io" target="_blank" rel="noopener noreferrer">The Talao ICO</a></li>
            <li><a href="https://talao.io" target="_blank" rel="noopener noreferrer">Talao.io</a></li>
          </ul>
        </footer>
      </div>
    );
  }
}

export default App;
