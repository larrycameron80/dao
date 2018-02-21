import React, { Component } from 'react';
import logo from './assets/images/Talao-logo.png';
import './App.css';
import TokenButton from './token/TokenButton';
import EtherButton from './ether/EtherButton';
import Objection from './objection/Objection';

class App extends Component {
  constructor (props) {
    super (props);

    const tokenContract = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"},{"name":"newUnit","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);

    this.state = {
      tokenInstance: tokenContract.at ('0x584211Ed3a8D3f3c5CEF5DF1fDc6EC03315348E3'),
      tokenBalance: null,
      tokenTransferEvent: null,
      message: null
    }
    this.handleLoad = this.handleLoad.bind (this);
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }
  handleLoad() {
    const { balanceOf } = this.state.tokenInstance;
    balanceOf (
      window.web3.eth.accounts[0],
      (err, balance) => {
        if (err) console.error ('An error occured::::', err);
        let tokens = (window.web3.fromWei(balance.toString(), 'ether'));
        tokens = parseFloat(tokens).toFixed(2);
        this.setState({
          tokenBalance: tokens
        });
      }
    );
    this.state.tokenInstance.Transfer().watch (
      (err, event) => {
        if (err) console.error (err);
        else {
          if (event['args']['to'] === window.web3.eth.accounts[0]) {
            console.log(event);
            let tokens_wei = event['args']['value'].toString();
            this.setState({
              message: 'You just received ' + window.web3.fromWei(tokens_wei) + ' TALAO from ' + event['args']['from']
            });
          }
        }
      }
    );
  }
  renderTokenButton() {
    return (
      <TokenButton
        value={this.state.tokenBalance}
      />
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header container white">
          <a href="/">
            <img src={logo} className="App-logo" alt="logo" />
          </a>
          <h1 className="App-title">Talao</h1>
          <p>The first Ethereum-based Talents Autonomous Organization.</p>
        </header>
        <div className="App-intro container blue">
          <div className="App-intro-message">
            { this.state.message }
          </div>
          <div className="App-intro-buttons">
            <div className="Token-button">
              <button>
                My Talao tokens: { this.state.tokenBalance }
              </button>
            </div>
            <EtherButton/>
          </div>
        </div>
        <div className="App-main container yellow">
          <Objection/>
        </div>
        <footer className="App-footer container green">
          <p>Talao React.js prototype v0.1.3</p>
        </footer>
      </div>
    );
  }
}

export default App;
