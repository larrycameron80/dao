import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faLock from '@fortawesome/fontawesome-free-solid/faLock';
import faLockOpen from '@fortawesome/fontawesome-free-solid/faLockOpen';
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
      sponsored: false,
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
      if (sponsor !== '0x0000000000000000000000000000000000000000') {
        this.setState ({
          sponsor: sponsor,
          isSponsored: true
        });
      }
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
        <h1>
          { this.state.name + ' ' }
          { this.state.isPrivate && <FontAwesomeIcon icon = { faLock } /> }
          { !this.state.isPrivate && <FontAwesomeIcon icon = { faLockOpen } /> }
        </h1>
        <div className = "Community-info blue box">
          {
            this.state.isSponsored &&
            <div className = "Community-info-sponsor">
              <h2>Sponsored by</h2>
              <a
                href={ 'https://ropsten.etherscan.io/address/' + this.state.sponsor }
                target="_blank" rel="noopener noreferrer">
                  { this.state.sponsor }
              </a>
            </div>
          }
          <h2>Address</h2>
          <a
            href={ 'https://ropsten.etherscan.io/address/' + this.state.address }
            target="_blank" rel="noopener noreferrer">
              { this.state.address }
          </a>
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
      </div>
    );
  }
}

Community.contextTypes = {
  web3: PropTypes.object
}

export default Community;
