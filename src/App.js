import React, { Component } from 'react';
import logo from './Talao-logo.png';
import './App.css';

class App extends Component {
  constructor (props) {
    super (props);

    const TokenContract = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"},{"name":"newUnit","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);

    this.state = {
      TokenInstance: TokenContract.at ('0x584211Ed3a8D3f3c5CEF5DF1fDc6EC03315348E3'),
      balance: null,
      date: (new Date()).toLocaleString()
    }

    this.queryName = this.queryName.bind (this);
    this.queryBalance = this.queryBalance.bind (this);
    this.handleClickBalance = this.handleClickBalance.bind (this);
    this.handleLoad = this.handleLoad.bind (this);
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad() {
    const { balanceOf } = this.state.TokenInstance;

    balanceOf (
      window.web3.eth.accounts[0],
      (err, balance) => {
        if (err) console.error ('An error occured::::', err);
        let tokens = window.web3.fromWei(balance.toString(), 'ether');
        this.setState({
          balance: tokens
        });
      }
    )
  }

  queryName () {
    const { name } = this.state.TokenInstance;

    name ((err, name) => {
      if (err) console.error ('An error occured', err);
      console.log ('This is the', name, 'token.');
    })
  }

  queryBalance () {
    const { balanceOf } = this.state.TokenInstance;

    balanceOf (
      window.web3.eth.accounts[0],
      (err, balance) => {
        if (err) console.error ('An error occured::::', err);
        let tokens = window.web3.fromWei(balance.toString(), 'ether');
        console.log ('You have', tokens, 'Talao tokens.');
      }
    )
  }

  handleClickBalance () {
    const { balanceOf } = this.state.TokenInstance;

    balanceOf (
      window.web3.eth.accounts[0],
      (err, balance) => {
        if (err) console.error ('An error occured::::', err);
        let tokens = window.web3.fromWei(balance.toString(), 'ether');
        this.setState({
          balance: tokens
        });
      }
    )
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Talao</h1>
          <p>The first Ethereum-based Talents Autonomous Organization.</p>
          <div>
            <button>
              You have { this.state.balance } Talao tokens
            </button>
          </div>
        </header>
        <div className="App-intro">
          <p>Lorem ipsum.</p>
        </div>
        <footer className="App-footer">
          <div className="container green">
            <h2>Old tests</h2>
            <button onClick={ this.handleClickBalance }>
              You have { this.state.balance } Talao tokens
            </button>
            <p>{ this.state.date }</p>
            <p>
              <button onClick={ this.queryName }> Token name (console.log)</button>
            </p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
