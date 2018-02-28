import React, { Component } from 'react';
import './Objection.css';
import ObjectionForm from './ObjectionForm';
import Button from '../ui/button/Button';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';

class Objection extends Component {
  constructor (props) {
    super (props);

    const objectionContractObject = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentObjectionId","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"currentObjection","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"objection_id","type":"int256"},{"indexed":false,"name":"user","type":"address"}],"name":"UserHasRejected","type":"event"}]);

    this.state = {
      objectionContract: objectionContractObject.at ('0x9D8F7Fb04c740Aaa34995d0E19fcaD92A6001C5B'),
      objectionEndingDate: null,
      objectionVariableName: null,
      objectionProposedValue: null,
      objectionCurrentJustification: null,
      objectionCurrentOwner: null,
      objectionSucceed: null,
      currentObjectionId: null,
      usersHaveRejected: null,
      userHasRejected: null,
    }

    this.handleSubmitOpen = this.handleSubmitOpen.bind (this);
    this.handleReject = this.handleReject.bind (this);
    this.state.event = this.state.objectionContract.Succeed();
  }
  componentDidMount() {
    const { ending_date } = this.state.objectionContract;
    ending_date ((err, ending_date) => {
      if (err) console.error (err);
      else {
        this.setState ({
          objectionEndingDate: ending_date.toString()
        });
        if (ending_date > 0) {
          const { currentObjectionId } = this.state.objectionContract;
          currentObjectionId ((err, objection_id) => {
            if (err) console.error (err);
            else {
              this.setState ({
                currentObjectionId: objection_id.toString()
              });
              this.state.objectionContract.UserHasRejected(
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
    const { variable_name } = this.state.objectionContract;
    variable_name ((err, variable_name) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionVariableName: window.web3.toAscii(variable_name).replace(/\u0000/g, '')
      });
    });
    const { proposed_value } = this.state.objectionContract;
    proposed_value ((err, proposed_value) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionProposedValue: proposed_value.toString()
      });
    });
    const { currentJustification } = this.state.objectionContract;
    currentJustification ((err, currentJustification) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionCurrentJustification: currentJustification
      });
    });
    const { currentOwner } = this.state.objectionContract;
    currentOwner ((err, currentOwner) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionCurrentOwner: currentOwner
      });
    });
  }
  handleSubmitOpen() {
    const { ending_date } = this.state.objectionContract;
    ending_date ((err, ending_date) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionEndingDate: ending_date
      });
    });
  }
  handleReject() {
    const { reject } = this.state.objectionContract;
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
        <div className="Objection-open" style={ this.state.objectionEndingDate === '0' ? {} : { display: 'none' }}>
          <h2>No current objection</h2>
          <p>Would you like to propose to change a variable value?</p>
          <div className="box green">
            <ObjectionForm/>
          </div>
        </div>
        <div className="Objection-reject" style={ this.state.objectionEndingDate === '0' ? { display: 'none' } : {}}>
          <h2>Current objection</h2>
          <div className="box green">
            <p className="big">
              Assign the value <strong>{ this.state.objectionProposedValue }</strong> to the variable <strong>{ this.state.objectionVariableName }</strong>.
            </p>
            <p>The author, { this.state.objectionCurrentOwner }, said:</p>
            <p><em>{ this.state.objectionCurrentJustification }</em></p>
            <div style={ this.state.userHasRejected ? { display: 'none' } : {} }>
              <Button value="Reject" icon={ faBan } onClick={ this.handleReject } />
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

class ObjectionRejectedList extends Component {
  renderItem(item, index) {
    return (
      <li key={ index }>
        { item }
      </li>
    );
  }
  renderList(list) {
    if (list.length > 0) {
      return (
        <ul>
          {
            list.map(
              (item, index) => (
                this.renderItem(item, index)
              )
            )
          }
        </ul>
      );
    }
  }
  render() {
    if (this.props.usersHaveRejected !== null && this.props.usersHaveRejected.length > 0) {
      var list = this.props.usersHaveRejected.map(i => i.args['user']);
      return (
        <div className="Objection-rejected-list">
          <h3>They rejected this objection</h3>
          { this.renderList(list) }
        </div>
      );
    }
    else if (this.props.objectionEndingDate > 0) {
      return (
        <div className="Objection-rejected-list">
          <p>No one rejected this objection, so far.</p>
        </div>
      );
    }
    else return null;
  }
}

export default Objection;
