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
      active: null,
      private: null,
      sponsor: null,
      balanceForVoting: null,
      minToken: null,
      minReputation: null,
      commission: null,
      fee: null,
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
    // Active or inactive community.
    this.state.contract.methods.communityState().call().then(active => {
      this.setState ({
        active: active
      });
    });
    // Open (0) or private (1) community.
    this.state.contract.methods.communityType().call().then(type => {
      this.setState ({
        type: type
      });
    });
    // Sponsor address if private community.
    this.state.contract.methods.communitySponsor().call().then(sponsor => {
      this.setState ({
        sponsor: sponsor
      });
    });
    // Token percentage balance for voting in community (10 = 10% token, 90% reputation).
    this.state.contract.methods.communityBalanceForVoting().call().then(balanceForVoting => {
      this.setState ({
        balanceForVoting: balanceForVoting
      });
    });
    // Minimum tokens to vote in community.
    this.state.contract.methods.communityMinimumToken().call().then(minToken => {
      this.setState ({
        minToken: minToken
      });
    });
    // Minimum reputation to vote in community.
    this.state.contract.methods.communityMinimumReputation().call().then(minReputation => {
      this.setState ({
        minReputation: minReputation
      });
    });
    // x 1/10000 community commission on job = 0 at bootstrap. 100 means 1%.
    this.state.contract.methods.communityJobCom().call().then(commission => {
      this.setState ({
        commission: commission
      });
    });
    // Fee to join community (0 by default).
    this.state.contract.methods.communityMemberFees().call().then(fee => {
      this.setState ({
        fee: fee
      });
    });
  }
  render() {
    return (
      <div className = "Community">
        <h1>{ this.state.name + ' community'}</h1>
        <div className = "Community-info blue box">
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
          <ul>
            <li>
              Balance for voting: { this.state.balanceForVoting }% tokens / { 100 - this.state.balanceForVoting }% reputation
            </li>
            <li>
              Minimum tokens to vote: { this.state.minToken } tokens
            </li>
            <li>
              Minimum reputation to vote: { this.state.minReputation }
            </li>
            <li>
              Community commission on jobs: { this.state.commission / 100 }%
            </li>
            <li>
              Fee to join: { this.state.fee } tokens
            </li>
          </ul>
        </div>
        <p>
          (Debug:
            Active or inactive: { this.state.active } /
            Open or private: { this.state.type } /
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
