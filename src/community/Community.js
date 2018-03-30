import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '../ui/button/Button';
import faCopy from '@fortawesome/fontawesome-free-solid/faCopy';
import './Community.css';

class Community extends Component {
  constructor (props) {
    super (props);

    const contract = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_COMMUNITY_ABI),
      this.props.match.params.communityAddress
    );

    this.state = {
      contract: contract,
      address: this.props.match.params.communityAddress,
      name: null,
      isActive: null,
      isPrivate: null,
      sponsor: null,
      balanceToVote: null,
      minimumTokensToVote: null,
      minimumReputationToVote: null,
      jobCommission: null,
      joinFee: null,
      members: null
    }
  }
  componentDidMount() {
    // Community name.
    this.state.contract.methods.communityName().call().then(name => {
      this.setState ({
        name: name
      });
    });
    // Active community?
    this.state.contract.methods.communityIsActive().call().then(isActive => {
      this.setState ({
        isActive: isActive
      });
    });
    // Private community?
    this.state.contract.methods.communityIsPrivate().call().then(isPrivate => {
      this.setState ({
        isPrivate: isPrivate
      });
    });
    // Sponsor address if private community.
    this.state.contract.methods.communitySponsor().call().then(sponsor => {
      this.setState ({
        sponsor: sponsor
      });
    });
    // Token percentage balance to vote in community (10 = 10% token, 90% reputation). From 1 to 100.
    this.state.contract.methods.communityBalanceToVote().call().then(balance => {
      this.setState ({
        balanceToVote: balance
      });
    });
    // Minimum tokens to vote in community. From 1 to 100.
    this.state.contract.methods.communityMinimumTokensToVote().call().then(minimumTokensToVote => {
      this.setState ({
        minimumTokensToVote: minimumTokensToVote
      });
    });
    // Minimum reputation to vote in community. From 1 to 100.
    this.state.contract.methods.communityMinimumReputationToVote().call().then(minimumReputationToVote => {
      this.setState ({
        minimumReputationToVote: minimumReputationToVote
      });
    });
    // (Community commission on job) / 100. 100 means 1%. From 0 to 10000.
    this.state.contract.methods.communityJobCommission().call().then(jobCommission => {
      this.setState ({
        jobCommission: jobCommission
      });
    });
    // Fee to join community.
    this.state.contract.methods.communityJoinFee().call().then(joinFee => {
      this.setState ({
        joinFee: joinFee
      });
    });
  }
  render() {
    return (
      <div className = "Community">
        <h1>{ this.state.name + ' community'}</h1>
        <div className = "Community-info blue box">
          <h2>Address</h2>
          <a
            href={ 'https://ropsten.etherscan.io/address/' + this.state.address }
            target="_blank" rel="noopener noreferrer">
              { this.state.address }
          </a>
          <CopyToClipboard
            text = { this.state.address }
            onCopy = { () => NotificationManager.success('Copied to clipboard') }>
            <Button
              value = "copy"
              icon = { faCopy } />
          </CopyToClipboard>
          <h2>Parameters</h2>
          <ul>
            <li>
              Balance to vote: { this.state.balanceToVote }% tokens / { 100 - this.state.balanceToVote }% reputation
            </li>
            <li>
              Minimum tokens to vote: { this.state.minimumTokensToVote } tokens
            </li>
            <li>
              Minimum reputation to vote: { this.state.minimumReputationToVote }
            </li>
            <li>
              Community commission on jobs: { this.state.jobCommission / 100 }%
            </li>
            <li>
              Fee to join: { this.state.joinFee } tokens
            </li>
          </ul>
        </div>
        <p>
          (Debug:
            Active or inactive: { this.state.isActive } /
            Open or private: { this.state.isPrivate } /
            Sponsor: { this.state.sponsor }
          )
        </p>
      </div>
    );
  }
}

Community.contextTypes = {
  web3: PropTypes.object
}

export default Community;
