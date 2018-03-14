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

    const contractObject = window.web3.eth.contract (JSON.parse(process.env.REACT_APP_OBJECTION_ABI));

    this.state = {
      contract: contractObject.at (process.env.REACT_APP_OBJECTION_ADDRESS),
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
      failedObjections: null
    }

    this.handleObjectionOpenFormInputChange = this.handleObjectionOpenFormInputChange.bind(this);
    this.handleObjectionOpenFormSubmit = this.handleObjectionOpenFormSubmit.bind(this);
    this.handleClickReject = this.handleClickReject.bind(this);
    this.handleClickClose = this.handleClickClose.bind(this);
    this.state.event = this.state.contract.Succeed();
  }
  componentDidMount() {
    // Is an objection open?
    const { ending_date } = this.state.contract;
    ending_date ((err, ending_date) => {
      if (err) console.error (err);
      else {
        this.setState ({
          endingDate: ending_date.toString()
        });
        // Get the objection.
        if (ending_date > 0) {
          const { currentObjectionId } = this.state.contract;
          currentObjectionId ((err, objection_id) => {
            if (err) console.error (err);
            else {
              this.setState ({
                currentObjectionId: objection_id.toString()
              });
              // Get the events in which users rejected the objection.
              this.state.contract.UserHasRejected(
                {objection_id: this.state.currentObjectionId},
                {fromBlock: 0, toBlock: 'latest'}
              )
              .get (
                (err, rejected) => {
                  if (err) console.error (err);
                  else {
                    this.setState ({
                      usersHaveRejected: rejected
                    });
                    // Did the current user reject the objection?
                    rejected.forEach( (event) => {
                      if (event['args']['user'] === this.context.web3.selectedAccount) {
                        this.setState ({
                          userHasRejected: true
                        });
                      }
                    })
                  }
                }
              );
            }
          });
        }
      }
    });
    // Get objection variable name.
    const { variable_name } = this.state.contract;
    variable_name ((err, variable_name) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        variableName: window.web3.toAscii(variable_name).replace(/\u0000/g, '')
      });
    });
    // Get objection proposed value.
    const { proposed_value } = this.state.contract;
    proposed_value ((err, proposed_value) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        proposedValue: proposed_value.toString()
      });
    });
    // Get objection justification.
    const { currentJustification } = this.state.contract;
    currentJustification ((err, currentJustification) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        currentJustification: currentJustification
      });
    });
    // Get objection creator.
    const { currentOwner } = this.state.contract;
    currentOwner ((err, currentOwner) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        currentOwner: currentOwner
      });
    });
    // Get previously succeeded objections.
    this.state.contract.Succeed(
      {},
      {fromBlock: 0, toBlock: 'latest'}
    )
    .get (
      (err, succeeded) => {
        if (err) console.error (err);
        else {
          var succeededObjections = [];
          succeeded.forEach( (event) => {
            let variable_name = window.web3.toAscii(event['args']['varname']).replace(/\u0000/g, '');
            let value = (event['args']['value']).toString();
            let succeededObjection = {
              variable: variable_name,
              value: value
            }
            succeededObjections.push(succeededObjection);
          });
          this.setState ({
            succeededObjections: succeededObjections
          });
        }
      }
    );
    // Get previously failed objections.
    this.state.contract.Fail(
      {},
      {fromBlock: 0, toBlock: 'latest'}
    )
    .get (
      (err, failed) => {
        if (err) console.error (err);
        else {
          var failedObjections = [];
          failed.forEach( (event) => {
            let variable_name = window.web3.toAscii(event['args']['varname']).replace(/\u0000/g, '');
            let value = (event['args']['value']).toString();
            let failedObjection = {
              variable: variable_name,
              value: value
            }
            failedObjections.push(failedObjection);
          });
          this.setState ({
            failedObjections: failedObjections
          });
        }
      }
    );
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
    const { openObjection } = this.state.contract;
    openObjection (
      this.state.currentJustification,
      this.state.proposedValue,
      this.state.variableName,
      {
        from: this.context.web3.selectedAccount,
      },
      (err, tx) => {
        if (err) console.error (err);
        else {
          this.setState({
            objectionOpenFormSubmitted: true
          });
        }
      }
    );
    const { ending_date } = this.state.contract;
    ending_date ((err, ending_date) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        endingDate: ending_date
      });
    });
  }
  handleClickReject() {
    const { reject } = this.state.contract;
    reject (
      {
        from: this.context.web3.selectedAccount,
      },
      (err, tx) => {
        if (err) console.error ('An error occured:', err);
        else {
          this.setState({
            userHasRejected: true
          });
        }
      }
    );
  }
  handleClickClose() {
    const { endObjection } = this.state.contract;
    endObjection (
      {
        from: this.context.web3.selectedAccount,
      },
      (err, tx) => {
        if (err) console.error ('An error occured:', err);
        else {
          this.setState({
            endingDate: 0
          });
        }
      }
    );
  }
  render() {
    return (
      <div className="Objection yellow">
        <div className="Objection-open" style={ this.state.endingDate === '0' ? {} : { display: 'none' }}>
          <h2>No current objection</h2>
          <p>Would you like to propose to change a variable value?</p>
          <div className="box green">
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
          <div className="box green">
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
        <Table
          className = "Objections-succeeded box green"
          caption = "Previously succeeded objections"
          rows = { this.state.succeededObjections }
        />
        <Table
          className = "Objections-failed box green"
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
