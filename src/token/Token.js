import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Token.css';
import Button from '../ui/button/Button';
import SendTokenForm from './SendTokenForm';
import faExchangeAlt from '@fortawesome/fontawesome-free-solid/faExchangeAlt';
import QrCode from 'qrcode.react';
import EtherButton from '../ethereum/EtherButton';

class Token extends Component {
  constructor (props) {
    super (props);

    const contractObject = window.web3.eth.contract (JSON.parse(process.env.REACT_APP_TOKEN_ABI));

    this.state = {
      contract: contractObject.at (process.env.REACT_APP_TOKEN_ADDRESS),
      tokenName: null,
      tokenSymbol: null,
      userBalance: null,
      flashMessage: null,
      sendShow: false,
      sendTo: '',
      sendAmount: '',
      showQrCode: false
    }

    this.handleSendShow = this.handleSendShow.bind(this);
    this.handleSendInputChange = this.handleSendInputChange.bind(this);
    this.handleSendSubmit = this.handleSendSubmit.bind(this);
    this.handleQrCodeShowClick = this.handleQrCodeShowClick.bind(this);
  }
  componentDidMount() {
    // Get token name.
    const { name } = this.state.contract;
    name (
      (err, name) => {
        if (err) console.error (err);
        else {
          this.setState({
            tokenName: name
          });
        }
      }
    );
    // Get token symbol.
    const { symbol } = this.state.contract;
    symbol (
      (err, symbol) => {
        if (err) console.error (err);
        else {
          this.setState({
            tokenSymbol: symbol
          });
        }
      }
    );
    // Get user balance (token).
    const { balanceOf } = this.state.contract;
    balanceOf (
      this.context.web3.selectedAccount,
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
          if (event['args']['to'] === this.context.web3.selectedAccount || event['args']['from'] === this.context.web3.selectedAccount) {
            // Get his new balance.
            balanceOf (
              this.context.web3.selectedAccount,
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
            let transferContent = (event['args']['to'] === this.context.web3.selectedAccount) ? event['args']['from'] + ' sent you ' + tokens + ' tokens' : 'You sent ' + tokens + ' tokens to ' + event['args']['to'];
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
    let tokens_wei = window.web3.toWei(this.state.sendAmount);
    transfer (
      this.state.sendTo,
      tokens_wei,
      {
        from: this.context.web3.selectedAccount
      },
      (err, tx) => {
        if (err) console.error (err);
        else {
          this.setState({
            sendShow: false,
            flashMessage: 'Send tokens: transaction submitted, hash:' + tx
          });
        }
      }
    );
  }
  handleQrCodeShowClick() {
    this.setState({
      showQrCode: this.state.showQrCode ? false : true
    });
  }
  render() {
    return (
      <div className="Token blue">
        <div className="Token-header-buttons">
          <Button
            value={ 'My ' + this.state.tokenSymbol + 's: ' + this.state.userBalance }
            disabled = "true" />
          <Button
            value = { 'Send ' + this.state.tokenSymbol + 's' }
            icon = { faExchangeAlt }
            onClick = { this.handleSendShow } />
          <EtherButton />
        </div>
        <div>
          <p>My address: { this.context.web3.selectedAccount }</p>
          <p className="Token-qr-code-show" onClick = { this.handleQrCodeShowClick }>Show { this.state.tokenSymbol }'s QR code</p>
        </div>
        <div className = "Token-qr-code" style={ this.state.showQrCode ? {} : { display: 'none' }}>
          <p>Display this on your desktop. On your mobile, open Cipher Browser, go to your account details, click <em>ADD TOKENS</em> and scan this QR code.</p>
          <QrCode value = { process.env.REACT_APP_TOKEN_ADDRESS } />
        </div>
        <div style={ this.state.sendShow ? {} : { display: 'none' }}>
          <SendTokenForm
            onChange = { this.handleSendInputChange }
            onSubmit = { this.handleSendSubmit }
            to = { this.state.sendTo }
            amount = { this.state.sendTokensAmount }
            tokenSymbol = { this.state.tokenSymbol } />
        </div>
        <div className="Token-header-flashmessage">
          <p>{ this.state.flashMessage }</p>
        </div>
      </div>
    );
  }
}

Token.contextTypes = {
  web3: PropTypes.object
}

export default Token;
