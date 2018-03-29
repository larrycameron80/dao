import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NotificationManager } from 'react-notifications';
import Button from '../ui/button/Button';
import './Communities.css';

class Communities extends Component {
  constructor (props) {
    super (props);

    const contract = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_COMMUNITY_FABRIQ_ABI),
      process.env.REACT_APP_COMMUNITY_FABRIQ_ADDRESS
    );

    this.state = {
      contract: contract,
      communities: null
    }
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div className="Communities">
        <p>Communities</p>
      </div>
    );
  }
}

Communities.contextTypes = {
  web3: PropTypes.object
}

export default Communities;
