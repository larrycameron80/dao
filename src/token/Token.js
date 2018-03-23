import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Token.css';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '../ui/button/Button';
import SendTokenForm from './SendTokenForm';
import faCopy from '@fortawesome/fontawesome-free-solid/faCopy';
import faQrcode from '@fortawesome/fontawesome-free-solid/faQrcode';
import faArrowRight from '@fortawesome/fontawesome-free-solid/faArrowRight';
import QrCode from 'qrcode.react';

class Token extends Component {
  constructor (props) {
    super (props);

    const contract = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_TOKEN_ABI),
      process.env.REACT_APP_TOKEN_ADDRESS
    );

    this.state = {
      contract: contract,
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
    this.state.contract.methods.name().call().then(name => {
      this.setState({
        tokenName: name
      });
    });
    // Get token symbol.
    this.state.contract.methods.symbol().call( (err, symbol) => {
      if (err) console.error (err);
      else {
        this.setState({
          tokenSymbol: symbol
        });
      }
    });
    // Get user balance (tokens).
    this.updateUserBalance();
    // SUBSCRIPTIONS DO NOT WORK WITH METAMASK FOR NOW
    // Watch Transfer events (token).
    // Note: we could set 2 watches with filters on the user address (from & to) instead of 1 watch on all Transfer events.
    // this.state.contract.events.Transfer(
    //   (err, event) => {
    //     if (err) console.error (err);
    //     else {
    //       // The user is involved in this event.
    //       if (event['args']['to'] === this.context.web3.selectedAccount || event['args']['from'] === this.context.web3.selectedAccount) {
    //         // Get his new balance.
    //         this.updateUserBalance();
    //         // How many tokens?
    //         let tokens_wei = event['args']['value'].toString();
    //         let tokens = window.web3.utils.fromWei(tokens_wei);
    //         // Did the user receive or send the tokens ?
    //         let transferContent = (event['args']['to'] === this.context.web3.selectedAccount) ? event['args']['from'] + ' sent you ' + tokens + ' tokens' : 'You sent ' + tokens + ' tokens to ' + event['args']['to'];
    //         // Date of the transaction.
    //         window.web3.eth.getBlock(event['blockNumber'], (err, block) => {
    //           let transferTimestamp = block.timestamp;
    //           let transferDate = new Date(transferTimestamp * 1000);
    //           let transferDateUtc = transferDate.toUTCString();
    //           // Send flash message.
    //           this.setState({
    //             flashMessage: 'Last event on ' + transferDateUtc + ': ' + transferContent
    //           });
    //         });
    //       }
    //     }
    //   }
    // );
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
    let tokens_wei = window.web3.utils.toWei(this.state.sendAmount);
    this.state.contract.methods
      .transfer(this.state.sendTo, tokens_wei)
      .send({from: this.context.web3.selectedAccount})
      .on('transactionHash', (hash) => {
        this.setState({
          sendShow: false
        });
        let message = 'Sending ' + this.state.sendAmount + ' ' + this.state.tokenSymbol + ' (transaction hash: ' + hash + ')';
        NotificationManager.create({
          id: 1,
          type: 'info',
          message: message,
          title: 'Transaction submitted',
          timeOut: 0,
        });
      })
      .on('receipt', (receipt) => {
        let to = receipt.events.Transfer.returnValues.to;
        let tokens_wei = receipt.events.Transfer.returnValues.value;
        let tokens = window.web3.utils.fromWei(tokens_wei);
        let message = 'Sending ' + tokens + ' ' + this.state.tokenSymbol + 's to ' + to;
        NotificationManager.remove({id: 1});
        NotificationManager.create({
          id: 2,
          type: 'info',
          message: message,
          title: 'Transaction received',
          timeOut: 0,
        });
      })
      // TODO: Investigate: confirmationNumber goes up to 24 but it should not since no other block is mined locally.
      // It should go up to 12, one for each new mined block: https://web3js.readthedocs.io/en/1.0/web3-eth.html#sendtransaction
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber === 1) {
          let to = receipt.events.Transfer.returnValues.to;
          let tokens_wei = receipt.events.Transfer.returnValues.value;
          let tokens = window.web3.utils.fromWei(tokens_wei);
          let message = 'You sent ' + tokens + ' ' + this.state.tokenSymbol + 's to ' + to;
          NotificationManager.remove({id: 2});
          NotificationManager.success(message, 'Transaction completed');
          this.updateUserBalance();
        }
      })
      .on('error', console.error);
  }
  handleQrCodeShowClick() {
    this.setState({
      showQrCode: this.state.showQrCode ? false : true
    });
  }
  // Update user balance (token).
  updateUserBalance() {
    this.state.contract.methods.balanceOf(this.context.web3.selectedAccount).call().then(balance => {
      let tokens = (window.web3.utils.fromWei(balance.toString(), 'ether'));
      tokens = parseFloat(tokens).toFixed(2);
      this.setState({
        userBalance: tokens
      });
    });
  }
  render() {
    return (
      <div className="Token">
        <div className="Token-ethereum-address">
          <h2>My Ethereum address</h2>
          <div className="Token-ethereum-address-address blue box">
            <p>
              <a
                href={ 'https://ropsten.etherscan.io/address/' + this.context.web3.selectedAccount }
                target="_blank" rel="noopener noreferrer">
                  { this.context.web3.selectedAccount }
              </a>
              <CopyToClipboard
                text = { this.context.web3.selectedAccount }
                onCopy = { () => NotificationManager.success('Copied to clipboard') }>
                <Button
                  value = "copy"
                  icon = { faCopy } />
              </CopyToClipboard>
            </p>
          </div>
        </div>
        <div className="Token-token">
          <h2>{ 'My ' + this.state.tokenSymbol + 's' }</h2>
          <div className="green box">
            <p className="big">
              { this.state.userBalance + ' ' + this.state.tokenSymbol + 's' }
            </p>
            <div className="Token-token-actions">
              <Button
                value = { 'Send ' + this.state.tokenSymbol + 's' }
                icon = { faArrowRight }
                onClick = { this.handleSendShow } />
              <Button
                value = "Show QR code"
                icon = { faQrcode }
                onClick = { this.handleQrCodeShowClick } />
            </div>
            <div style = { this.state.sendShow ? {} : { display: 'none' }}>
              <SendTokenForm
                onChange = { this.handleSendInputChange }
                onSubmit = { this.handleSendSubmit }
                to = { this.state.sendTo }
                amount = { this.state.sendTokensAmount }
                tokenSymbol = { this.state.tokenSymbol } />
            </div>
            <div className = "Token-qr-code" style={ this.state.showQrCode ? {} : { display: 'none' }}>
              <p>Display this on your desktop. On your mobile, open Cipher Browser, go to your account details, click <em>ADD TOKENS</em> and scan this QR code.</p>
              <QrCode value = { process.env.REACT_APP_TOKEN_ADDRESS } />
            </div>
          </div>
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
