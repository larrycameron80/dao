import React, { Component } from 'react';
import './Objection.css';
import ObjectionForm from './ObjectionForm';

class Objection extends Component {
  constructor (props) {
    super (props);

    const objectionContract = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentObjectionId","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"currentObjection","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"objection_id","type":"int256"},{"indexed":false,"name":"user","type":"address"}],"name":"UserHasRejected","type":"event"}]);

    this.state = {
      objectionInstance: objectionContract.at ('0xEa51467f393fb5030B61cdfB332244697cE5EF91'),
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

    this.handleLoad = this.handleLoad.bind (this);
    this.handleSubmitOpen = this.handleSubmitOpen.bind (this);
    this.handleClickReject = this.handleClickReject.bind (this);
    this.state.event = this.state.objectionInstance.Succeed();
  }
  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }
  handleLoad() {
    const { ending_date } = this.state.objectionInstance;
    ending_date ((err, ending_date) => {
      if (err) console.error (err);
      else {
        this.setState ({
          objectionEndingDate: ending_date.toString()
        });
        if (ending_date > 0) {
          const { currentObjectionId } = this.state.objectionInstance;
          currentObjectionId ((err, objection_id) => {
            if (err) console.error (err);
            else {
              this.setState ({
                currentObjectionId: objection_id.toString()
              });
              this.state.objectionInstance.UserHasRejected(
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
    const { variable_name } = this.state.objectionInstance;
    variable_name ((err, variable_name) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionVariableName: window.web3.toAscii(variable_name).replace(/\u0000/g, '')
      });
    });
    const { proposed_value } = this.state.objectionInstance;
    proposed_value ((err, proposed_value) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionProposedValue: proposed_value.toString()
      });
    });
    const { currentJustification } = this.state.objectionInstance;
    currentJustification ((err, currentJustification) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionCurrentJustification: currentJustification
      });
    });
    const { currentOwner } = this.state.objectionInstance;
    currentOwner ((err, currentOwner) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionCurrentOwner: currentOwner
      });
    });
  }
  handleSubmitOpen() {
    const { ending_date } = this.state.objectionInstance;
    ending_date ((err, ending_date) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionEndingDate: ending_date
      });
    });
  }
  handleClickReject() {
    const { reject } = this.state.objectionInstance;
    reject (
      {
        from: window.web3.eth.accounts[0],
      },
      (err, tx) => {
        if (err) console.error ('An error occured:', err);
        else {
          this.setState({
            objectionUserHasRejected: true
          });
        }
      }
    );
  }
  render() {
    return (
      <div className="Objection">
        <div className="Objection-open" style={ this.state.objectionEndingDate === '0' ? {} : { display: 'none' }}>
          <h2>No current objection</h2>
          <p>Would you like to propose to change a variable value?</p>
          <div className="container message green">
            <ObjectionForm/>
          </div>
        </div>
        <div className="Objection-reject" style={ this.state.objectionEndingDate === '0' ? { display: 'none' } : {}}>
          <h2>Current objection</h2>
          <div className="container message green">
            <p className="big">
              Assign the value <strong>{ this.state.objectionProposedValue }</strong> to the variable <strong>{ this.state.objectionVariableName }</strong>.
            </p>
          </div>
          <p>
            <a href={ 'https://etherscan.io/address/' + this.state.objectionCurrentOwner } target="_blank">{ this.state.objectionCurrentOwner }</a> said:
          </p>
          <p>
            <em>{ this.state.objectionCurrentJustification }</em>
          </p>
          <div className="container message green" style={ this.state.userHasRejected ? { display: 'none' } : {} }>
            <button onClick={ this.handleClickReject }>
              Reject
            </button>
          </div>
          <div className="container message green" style={ this.state.userHasRejected ? {} : { display: 'none' }}>
            You have rejected this objection, but the vote is not finished yet.
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
      <li key={ index }className="Objection-rejected-item">
        <a href={ 'https://etherscan.io/address/' + item } target="_blank">
          { item }
        </a>
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
      //console.log(this.props.usersHaveRejected);
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
