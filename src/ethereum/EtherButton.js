import React, { Component } from 'react';
import Button from '../ui/button/Button';
import faEthereum from '@fortawesome/fontawesome-free-brands/faEthereum';

class EtherButton extends Component {
  constructor (props) {
    super (props);

    this.state = {
      userAddress: null,
      userBalance: null
    }
  }
  componentDidMount() {
    // Get user adress.
    window.web3.eth.getAccounts((err, addresses) => {
      if (err) console.error (err);
      else {
        this.setState({
          userAddress: addresses[0]
        });
        // Get user balance.
        window.web3.eth.getBalance(this.state.userAddress, (err, balance) => {
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
            window.web3.eth.getBalance(this.state.userAddress, (err, balance) => {
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
    });
  }
  componentWillUnmount() {
    this.filterLatestBlock.stopWatching();
  }
  render() {
    return (
      <Button value={ 'My Ether: ' + this.state.userBalance } icon={ faEthereum } />
    );
  }
}

export default EtherButton;
