import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommunitiesList from './CommunitiesList';
import './Communities.css';

class Communities extends Component {
  constructor (props) {
    super (props);

    const contractFabriq = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_COMMUNITY_FABRIQ_ABI),
      process.env.REACT_APP_COMMUNITY_FABRIQ_ADDRESS
    );

    this.state = {
      contractFabriq: contractFabriq,
      communities: []
    }
  }
  componentDidMount() {
    // Get communities contracts.
    this.state.contractFabriq.getPastEvents('CommunityListing', {}, {fromBlock: 0, toBlock: 'latest'}).then( events => {
      let communities = [];
      events.forEach( (event) => {
        console.log(event);
        let address = event['returnValues']['community'];
        let contract = new window.web3.eth.Contract (
          JSON.parse(process.env.REACT_APP_COMMUNITY_ABI),
          address);
        // Get community name.
        contract.methods.communityName().call().then(name => {
          communities.push({
            address: address,
            contract: contract,
            name: name
          })
          this.setState ({
            communities: communities
          });
        });
      });
    });
  }
  render() {
    return (
      <div className="Communities">
        <h1>Communities</h1>
        <p>Talents can join Talao communities and get involved in their management.</p>
        <CommunitiesList communities = { this.state.communities } />
      </div>
    );
  }
}

Communities.contextTypes = {
  web3: PropTypes.object
}

export default Communities;
