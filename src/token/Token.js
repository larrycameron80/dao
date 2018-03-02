import React, { Component } from 'react';
import './Token.css';
import Button from '../ui/button/Button';
import SendTokenForm from './SendTokenForm';
import faExchangeAlt from '@fortawesome/fontawesome-free-solid/faExchangeAlt';
import EtherButton from '../ethereum/EtherButton';

class Token extends Component {
  constructor (props) {
    super (props);

    const contractObject = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"unit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"},{"name":"newUnit","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]);

    this.state = {
      contract: contractObject.at ('0xf9e0b5D9c06eCA0c12ACA32eF19B2E1655Fa4e57'),
      userAddress: null,
      userBalance: null,
      flashMessage: null,
      sendShow: false,
      sendTo: '',
      sendAmount: ''
    }

    this.handleSendShow = this.handleSendShow.bind(this);
    this.handleSendInputChange = this.handleSendInputChange.bind(this);
    this.handleSendSubmit = this.handleSendSubmit.bind(this);
  }
  componentDidMount() {
    // Get user adress.
    window.web3.eth.getAccounts((err, addresses) => {
      if (err) console.error (err);
      else {
        this.setState({
          userAddress: addresses[0]
        });
        // Get user balance (token).
        const { balanceOf } = this.state.contract;
        balanceOf (
          this.state.userAddress,
          (err, balance) => {
            if (err) console.error (err);
            else {
              let tokens = (window.web3.fromWei(balance.toString(), 'ether'));
              tokens = parseFloat(tokens).toFixed(2);
              this.setState({
                userBalance: tokens
              });
            }
          }
        );
        // Watch Transfer events (token).
        // Note: we could set 2 watches with filters on the user address (from & to) instead of 1 watch on all Transfer events.
        this.state.contract.Transfer().watch (
          (err, event) => {
            if (err) console.error (err);
            else {
              // The user is involved in this event.
              if (event['args']['to'] === this.state.userAddress || event['args']['from'] === this.state.userAddress) {
                // Get his new balance.
                balanceOf (
                  this.state.userAddress,
                  (err, balance) => {
                    if (err) console.error (err);
                    else {
                      let tokens = (window.web3.fromWei(balance.toString(), 'ether'));
                      tokens = parseFloat(tokens).toFixed(2);
                      this.setState({
                        userBalance: tokens
                      });
                    }
                  }
                );
                // How many tokens?
                let tokens_wei = event['args']['value'].toString();
                let tokens = window.web3.fromWei(tokens_wei);
                // Did the user receive or send the tokens ?
                let transferContent = (event['args']['to'] === this.state.userAddress) ? event['args']['from'] + ' sent you ' + tokens + ' tokens' : 'You sent ' + tokens + ' tokens to ' + event['args']['to'];
                // Date of the transaction.
                window.web3.eth.getBlock(event['blockNumber'], (err, block) => {
                  let transferTimestamp = block.timestamp;
                  let transferDate = new Date(transferTimestamp * 1000);
                  let transferDateUtc = transferDate.toUTCString();
                  // Send flash message.
                  this.setState({
                    flashMessage: 'Last event on ' + transferDateUtc + ': ' + transferContent
                  });
                });
              }
            }
          }
        );
      }
    });
  }
  handleSendShow() {
    this.setState({
      sendShow: this.state.sendShow ? false : true
    });
  }
  handleSendInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleSendSubmit(event) {
    event.preventDefault();
    const { transfer } = this.state.contract;
    transfer (
      this.state.sendTo,
      this.state.sendAmount,
      {
        from: this.state.userAddress
      },
      (err, tx) => {
        if (err) console.error (err);
        else {
          this.setState({
            sendShow: false,
            flashMessage: 'Tokens sent.'
          });
        }
      }
    );
  }
  render() {
    return (
      <div className="Token blue">
        <div className="Token-header-buttons">
          <Button value={ 'My TALAOs: ' + this.state.userBalance } disabled="true" />
          <Button value="Send TALAOs" icon={ faExchangeAlt } onClick={ this.handleSendShow } />
          <EtherButton />
        </div>
        <div>
          <p>My address: { this.state.userAddress }</p>
        </div>
        <div style={ this.state.sendShow ? {} : { display: 'none' }}>
          <SendTokenForm onChange={ this.handleSendInputChange } onSubmit={ this.handleSendSubmit } to={ this.state.sendTo } amount={ this.state.sendTokensAmount }/>
        </div>
        <div className="Token-header-flashmessage">
          <p>{ this.state.flashMessage }</p>
        </div>
      </div>
    );
  }
}

export default Token;
