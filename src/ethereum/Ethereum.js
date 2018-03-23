import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faEthereum from '@fortawesome/fontawesome-free-brands/faEthereum';

class Ethereum extends Component {
  constructor (props) {
    super (props);

    this.state = {
      userBalance: null
    }
  }
  componentDidMount() {
    // Get user balance.
    this.getUserBalance();
    // Watch latest block.
    this.filterLatestBlock = window.web3old.eth.filter('latest');
    this.filterLatestBlock.watch((err, block) => {
      if (err) console.error (err);
      else this.getUserBalance();
    });
  }
  componentWillUnmount() {
    this.filterLatestBlock.stopWatching( () => {} );
  }
  // Helper to get user balance (ethereum).
  getUserBalance() {
    window.web3.eth.getBalance(this.context.web3.selectedAccount, (err, balance) => {
      if (err) console.error (err);
      else {
        let ethers = window.web3.utils.fromWei(balance.toString());
        ethers = parseFloat(ethers).toFixed(2);
        this.setState ({
          userBalance: ethers
        });
      }
    });
  }
  render() {
    return (
      <div className="Ethereum">
        <h2>My ETHERs</h2>
        <div className="yellow box big">
          { this.state.userBalance } <FontAwesomeIcon icon={ faEthereum } />
        </div>
      </div>
    );
  }
}

Ethereum.contextTypes = {
  web3: PropTypes.object
}

export default Ethereum;
