import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import Button from '../ui/button/Button';
import faSignInAlt from '@fortawesome/fontawesome-free-solid/faSignInAlt';
import './Freelancer.css';

class Freelancer extends Component {
  constructor (props) {
    super (props);

    const freelancerContract = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_FREELANCER_ABI),
      process.env.REACT_APP_FREELANCER_ADDRESS
    );

    this.state = {
      freelancerContract: freelancerContract,
      isFreelancerActive: null,
      isFreelancerBlocked: null
    }

    this.handleJoinClick = this.handleJoinClick.bind(this);
  }
  componentDidMount() {
    // Is the freelancer registred and active in the DAO?
    this.state.freelancerContract.methods.isFreelancerActive(this.context.web3.selectedAccount).call().then(isFreelancerActive => {
      this.setState({
        isFreelancerActive: isFreelancerActive
      });
    });
  }
  handleJoinClick() {
    this.state.freelancerContract.methods
      .joinDao()
      .send({from: this.context.web3.selectedAccount})
      .on('transactionHash', (hash) => {
        let message = 'Joining the Talao DAO (transaction hash: ' + hash + ')';
        NotificationManager.create({
          id: 200,
          type: 'info',
          message: message,
          title: 'Transaction submitted',
          timeOut: 0,
        });
      })
      .on('receipt', (receipt) => {
        let message = 'Joining the Talao DAO';
        NotificationManager.remove({id: 200});
        NotificationManager.create({
          id: 201,
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
          let message = 'You joined the Talao DAO! Welcome :)';
          NotificationManager.remove({id: 201});
          NotificationManager.success(message, 'Transaction completed');
          this.setState({
            isFreelancerActive: true
          });
        }
      })
      .on('error', console.error);
  }
  render() {
    return (
      <div className = "Freelancer">
        <h2>My status in the Talao DAO</h2>
        <div
          className = "Freelancer-active blue-dark box"
          style = { this.state.isFreelancerActive ? {} : { display: 'none' }}>
          <p>Your Ethereum address is <strong>active in the Talao DAO</strong> :)</p>
        </div>
        <div
          className = "Freelancer-inactive blue-dark box"
          style = { this.state.isFreelancerActive ? { display: 'none' } : {}}>
          <p>Your Ethereum address is <strong>not active</strong> in the Talao DAO...</p>
          <Button
            value = "Join the Talao DAO"
            icon = { faSignInAlt }
            onClick = { this.handleJoinClick } />
        </div>
      </div>
    );
  }
}

Freelancer.contextTypes = {
  web3: PropTypes.object
}

export default Freelancer;
