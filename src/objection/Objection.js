import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Objection.css';
import ObjectionOpenForm from './ObjectionOpenForm';
import ObjectionUsersHaveRejectedList from './ObjectionUsersHaveRejectedList';
import Table from '../ui/table/Table';
import Button from '../ui/button/Button';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import faWindowClose from '@fortawesome/fontawesome-free-solid/faWindowClose';
import Countdown from 'react-countdown-now';

class Objection extends Component {
  constructor (props) {
    super (props);

    const contract = new window.web3.eth.Contract (
      JSON.parse(process.env.REACT_APP_OBJECTION_ABI),
      process.env.REACT_APP_OBJECTION_ADDRESS
    );

    this.state = {
      contract: contract,
      endingDate: null,
      variableName: '',
      proposedValue: '',
      currentJustification: '',
      currentOwner: null,
      succeed: null,
      currentObjectionId: null,
      usersHaveRejected: null,
      userHasRejected: null,
      objectionOpenFormSubmitted: false,
      succeededObjections: null,
      failedObjections: null,
      flashMessage: null
    }

    this.handleObjectionOpenFormInputChange = this.handleObjectionOpenFormInputChange.bind(this);
    this.handleObjectionOpenFormSubmit = this.handleObjectionOpenFormSubmit.bind(this);
    this.handleClickReject = this.handleClickReject.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    // this.state.event = this.state.contract.Succeed();
  }
  componentDidMount() {
    // Is an objection open?
    this.state.contract.methods.ending_date().call().then(ending_date => {
      this.setState ({
        endingDate: ending_date.toString()
      });
      // Get the objection.
      if (ending_date > 0) {
        this.state.contract.methods.currentObjectionId().call().then(objection_id => {
          this.setState ({
            currentObjectionId: objection_id.toString()
          });
          // Get the events in which users rejected the objection.
          this.state.contract
            .getPastEvents('UserHasRejected', {
              filter: {objection_id: this.state.currentObjectionId},
              fromBlock: 0,
              toBlock: 'latest'})
            .then(rejected => {
              this.setState ({
                usersHaveRejected: rejected
              });
              // Did the current user reject the objection?
              rejected.forEach( (event) => {
                if (event['returnValues']['user'] === this.context.web3.selectedAccount) {
                  this.setState ({
                    userHasRejected: true
                  });
                }
              })
            });
        });
      }
    });
    // Get objection variable name.
    this.state.contract.methods.variable_name().call().then(variable => {
      this.setState ({
        variableName: window.web3.utils.toAscii(variable).replace(/\u0000/g, '')
      });
    });
    // Get objection proposed value.
    this.state.contract.methods.proposed_value().call().then(proposed => {
      this.setState ({
        proposedValue: proposed.toString()
      });
    });
    // Get objection justification.
    this.state.contract.methods.currentJustification().call().then(justification => {
      this.setState ({
        currentJustification: justification
      });
    });
    // Get objection creator.
    this.state.contract.methods.currentOwner().call().then(owner => {
      this.setState ({
        currentOwner: owner
      });
    });
    // Get previously succeeded objections.
    this.state.contract.getPastEvents('Succeed', {}, {fromBlock: 0, toBlock: 'latest'}).then(events => {
      var succeededObjections = [];
      events.forEach( (event) => {
        let variable_name = window.web3.utils.toAscii(event['returnValues']['varname']).replace(/\u0000/g, '');
        let value = (event['returnValues']['value']).toString();
        let succeededObjection = {
          variable: variable_name,
          value: value
        }
        succeededObjections.push(succeededObjection);
      });
      this.setState ({
        succeededObjections: succeededObjections
      });
    });
    // Get previously failed objections.
    this.state.contract.getPastEvents('Fail', {}, {fromBlock: 0, toBlock: 'latest'}).then(events => {
      var failedObjections = [];
      events.forEach( (event) => {
        let variable_name = window.web3.utils.toAscii(event['returnValues']['varname']).replace(/\u0000/g, '');
        let value = (event['returnValues']['value']).toString();
        let failedObjection = {
          variable: variable_name,
          value: value
        }
        failedObjections.push(failedObjection);
      });
      this.setState ({
        failedObjections: failedObjections
      });
    });
  }
  handleObjectionOpenFormInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleObjectionOpenFormSubmit(event) {
    event.preventDefault();
    this.state.contract.methods
      .openObjection(this.state.currentJustification, this.state.proposedValue, window.web3.utils.asciiToHex(this.state.variableName))
      .send({from: this.context.web3.selectedAccount})
      .on('transactionHash', (hash) => {
        this.setState({
          flashMessage: 'Open objection: tx submitted (' + hash + ')'
        });
      })
      .on('receipt', (receipt) => {
        let hash = receipt.events.reject.transactionHash;
        this.setState({
          objectionOpenFormSubmitted: true,
          flashMessage: 'Opening an objection (tx: ' + hash + ')'
        });
      })
      .on('confirmation', (confirmationNumber, receipt) => {
        if (confirmationNumber > 0) {
          let hash = receipt.events.openObjection.transactionHash;
          this.setState({
            flashMessage: 'Objection opened (tx: ' + hash + ')'
          });
        }
      });
    this.state.contract.methods.ending_date().call().then(date => {
      this.setState ({
        endingDate: date
      });
    });
  }
  handleClickReject() {
    this.state.contract.methods
      .reject()
      .send({from: this.context.web3.selectedAccount})
      .on('transactionHash', (hash) => {
        this.setState({
          sendShow: false,
          flashMessage: 'Reject: tx submitted (' + hash + ')'
        });
      })
      .on('receipt', (receipt) => {
        let hash = receipt.events.reject.transactionHash;
        this.setState({
          flashMessage: 'You rejected the objection (tx: ' + hash + ')'
        });
      });
  }
  handleClickClose() {
    this.state.contract.methods
      .endObjection()
      .send({from: this.context.web3.selectedAccount})
      .on('transactionHash', (hash) => {
        this.setState({
          sendShow: false,
          flashMessage: 'Close objection: tx submitted (' + hash + ')'
        });
      })
      .on('receipt', (receipt) => {
        let hash = receipt.events.reject.transactionHash;
        this.setState({
          flashMessage: 'You closed the objection (tx: ' + hash + ')'
        });
      });
  }
  render() {
    return (
      <div className="Objection">
        <h1>Objections</h1>
        <p>As a member of the Talao DAO, if you want to change some parameters of the DAO, then you can submit <em>Objections</em>.</p>
        <div className="Objection-open" style={ this.state.endingDate === '0' ? {} : { display: 'none' }}>
          <h2>No current objection</h2>
          <p>Would you like to propose to change a variable value?</p>
          <div className="box blue">
            <ObjectionOpenForm
              onChange = { this.handleObjectionOpenFormInputChange }
              onSubmit = { this.handleObjectionOpenFormSubmit }
              variableName = { this.state.variableName }
              proposedValue = { this.state.proposedValue }
              currentJustification = { this.state.currentJustification }
              objectionOpenFormSubmitted = { this.state.objectionOpenFormSubmitted }
            />
          </div>
        </div>
        <div className="Objection-reject" style={ this.state.endingDate === '0' ? { display: 'none' } : {}}>
          <h2>Current objection</h2>
          <div className="box blue">
            <p className="big">
              Assign the value <strong>{ this.state.proposedValue }</strong> to the variable <strong>{ this.state.variableName }</strong>.
            </p>
            <p>The author, { this.state.currentOwner }, said:</p>
            <p><em>{ this.state.currentJustification }</em></p>
            <div style={ this.state.userHasRejected ? { display: 'none' } : {} }>
              <Button value="Reject" icon={ faBan } onClick={ this.handleClickReject } />
            </div>
            <div style={ this.state.userHasRejected ? {} : { display: 'none' }}>
              <Button value="You have rejected this objection." icon={ faBan } disabled="true" />
            </div>
            <div className="Objection-countdown" style={ this.state.endingDate > Date.now().toString() ? {} : { display: 'none' } }>
              <p>This objection ends in:</p>
              <Countdown date={ this.state.endingDate * 1000 } />
            </div>
            <div className="Objection-finished" style={ this.state.endingDate > Date.now().toString() ? { display: 'none' } : {} }>
              <p>This objection is over.</p>
              <div>
                <Button value="Close this objection" icon={ faWindowClose } onClick={ this.handleClickClose } />
              </div>
            </div>
          </div>
        </div>
        <ObjectionUsersHaveRejectedList {...this.state } />
        <div className="Objections-previous">
          <h2>Previous objections</h2>
        </div>
        <Table
          className = "Objections-succeeded box green"
          caption = "Previously succeeded objections"
          rows = { this.state.succeededObjections }
        />
        <Table
          className = "Objections-failed box yellow"
          caption = "Previously failed objections"
          rows = { this.state.failedObjections }
        />
      </div>
    );
  }
}

Objection.contextTypes = {
  web3: PropTypes.object
}

export default Objection;
