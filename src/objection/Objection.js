import React, { Component } from 'react';
import './Objection.css';
import ObjectionOpenForm from './ObjectionOpenForm';
import ObjectionRejectedList from './ObjectionRejectedList';
import Button from '../ui/button/Button';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';

class Objection extends Component {
  constructor (props) {
    super (props);

    const contractObject = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentObjectionId","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"currentObjection","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"objection_id","type":"int256"},{"indexed":false,"name":"user","type":"address"}],"name":"UserHasRejected","type":"event"}]);

    this.state = {
      contract: contractObject.at ('0x9D8F7Fb04c740Aaa34995d0E19fcaD92A6001C5B'),
      endingDate: null,
      variableName: '',
      proposedValue: '',
      currentJustification: '',
      currentOwner: null,
      succeed: null,
      currentObjectionId: null,
      usersHaveRejected: null,
      userHasRejected: null,
      objectionOpenFormSubmitted: false
    }

    this.handleObjectionOpenFormInputChange = this.handleObjectionOpenFormInputChange.bind(this);
    this.handleObjectionOpenFormSubmit = this.handleObjectionOpenFormSubmit.bind(this);
    this.handleClickReject = this.handleClickReject.bind(this);
    this.state.event = this.state.contract.Succeed();
  }
  componentDidMount() {
    const { ending_date } = this.state.contract;
    ending_date ((err, ending_date) => {
      if (err) console.error (err);
      else {
        this.setState ({
          endingDate: ending_date.toString()
        });
        if (ending_date > 0) {
          const { currentObjectionId } = this.state.contract;
          currentObjectionId ((err, objection_id) => {
            if (err) console.error (err);
            else {
              this.setState ({
                currentObjectionId: objection_id.toString()
              });
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
                    rejected.forEach( (event) => {
                      if (event['args']['user'] === window.web3.eth.accounts[0]) {
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
    const { variable_name } = this.state.contract;
    variable_name ((err, variable_name) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        variableName: window.web3.toAscii(variable_name).replace(/\u0000/g, '')
      });
    });
    const { proposed_value } = this.state.contract;
    proposed_value ((err, proposed_value) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        proposedValue: proposed_value.toString()
      });
    });
    const { currentJustification } = this.state.contract;
    currentJustification ((err, currentJustification) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        currentJustification: currentJustification
      });
    });
    const { currentOwner } = this.state.contract;
    currentOwner ((err, currentOwner) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        currentOwner: currentOwner
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
    const { openObjection } = this.state.contract;
    openObjection (
      this.state.currentJustification,
      this.state.proposedValue,
      this.state.variableName,
      {
        from: window.web3.eth.accounts[0],
      },
      (err, tx) => {
        if (err) console.error (err);
        else {
          // TODO: Display & update TXN status.
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
        from: window.web3.eth.accounts[0],
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
          </div>
        </div>
        <ObjectionRejectedList {...this.state } />
      </div>
    );
  }
}

export default Objection;
