import React, { Component } from 'react';

class EtherButton extends Component {
  constructor (props) {
    super (props);
    this.state = {
      etherBalance: null
    }
    this.handleLoad = this.handleLoad.bind (this);
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }
  handleLoad() {
    window.web3.eth.getBalance(window.web3.eth.accounts[0], (err, balance) => {
      if (err) console.error ('An error occured:', err);
      else {
        this.setState ({
          etherBalance: window.web3.fromWei(balance.toString())
        });
      }
    });
  }
  render() {
    return (
      <div className="Ether-button">
        <button>
          My Ethers: { this.state.etherBalance }
        </button>
      </div>
    );
  }
}

export default EtherButton;
