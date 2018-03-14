import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../ui/button/Button';
import faEthereum from '@fortawesome/fontawesome-free-brands/faEthereum';

class EtherButton extends Component {
  constructor (props) {
    super (props);

    this.state = {
      userBalance: null
    }
  }
  componentDidMount() {
    // Get user balance.
    window.web3.eth.getBalance(this.context.web3.selectedAccount, (err, balance) => {
      if (err) console.error (err);
      else {
        let ethers = window.web3.fromWei(balance.toString());
        ethers = parseFloat(ethers).toFixed(2);
        this.setState ({
          userBalance: ethers
        });
      }
    });
    // Watch latest block.
    let filterLatestBlock = window.web3.eth.filter('latest');
    filterLatestBlock.watch((err, block) => {
      if (err) console.error (err);
      else {
        // Update user balance.
        window.web3.eth.getBalance(this.context.web3.selectedAccount, (err, balance) => {
          if (err) console.error (err);
          else {
            let ethers = window.web3.fromWei(balance.toString());
            ethers = parseFloat(ethers).toFixed(2);
            this.setState ({
              userBalance: ethers
            });
          }
        });
      }
    });
  }
  componentWillUnmount() {
    this.filterLatestBlock.stopWatching();
  }
  render() {
    return (
      <Button
        value = { 'My Ether: ' + this.state.userBalance }
        icon = { faEthereum } disabled="true"
      />
    );
  }
}

EtherButton.contextTypes = {
  web3: PropTypes.object
}

export default EtherButton;
