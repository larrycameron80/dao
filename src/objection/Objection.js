import React, { Component } from 'react';
import './Objection.css';
import ObjectionForm from './ObjectionForm';

class Objection extends Component {
  constructor (props) {
    super (props);

    const objectionContract = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"}]);

    this.state = {
      objectionInstance: objectionContract.at ('0x54d11B9dfA840B0b7a36BC625D47913c381c8417'),
      objectionEndingDate: null,
      objectionVariableName: null,
      objectionProposedValue: null,
      objectionCurrentJustification: null,
      objectionCurrentOwner: null,
      objectionHasRejected: null, //TODO delete if hasRejected stays private
      objectionUserHasRejected: false,
      objectionSucceed: null,
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
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionEndingDate: ending_date.toString()
      });
    });
    const { variable_name } = this.state.objectionInstance;
    variable_name ((err, variable_name) => {
      if (err) console.error ('An error occured:', err);
      this.setState ({
        objectionVariableName: window.web3.toAscii(variable_name)
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
    //TODO delete if hasRejected stays private
    // const { hasRejected } = this.state.objectionInstance;
    // hasRejected ((err, hasRejected) => {
    //   if (err) console.error ('An error occured:', err);
    //   else if  (this.state.objectionInstance.includes(window.web3.eth.accounts[0])) {
    //      this.setState ({
    //        objectionUserHasRejected: true
    //      });
    //    }
    // });
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
          console.log(tx);
          this.setState({
            objectionUserHasRejected: true
          });
        }
      }
    );
  }
  render() {

    this.state.event.watch ((err, event) => {
      console.log(event);
    });

    return (
      <div className="Objection">
        <div className="Objection-open" style={ this.state.objectionEndingDate === '0' ? {} : { display: 'none' }}>
          <h2>No current objection</h2>
          <p>Would you like to propose to change a variable value?</p>
          <ObjectionForm/>
        </div>
        <div className="Objection-reject" style={ this.state.objectionEndingDate === '0' ? { display: 'none' } : {}}>
          <h2>Current objection</h2>
          <p className="big">
            Assign the value <strong>{ this.state.objectionProposedValue }</strong> to the variable <strong>{ this.state.objectionVariableName }</strong>.
          </p>
          <p>
            <a href={ 'https://etherscan.io/address/' + this.state.objectionCurrentOwner } target="_blank">{ this.state.objectionCurrentOwner }</a> said:
          </p>
          <p>
            <em>{ this.state.objectionCurrentJustification }</em>
          </p>
          <button onClick={ this.handleClickReject } style={ this.state.objectionUserHasRejected ? { display: 'none' } : {} }>
            Reject
          </button>
          <p><em>TODO: hasRejected should be public to hide this button if a user already rejected. Also, we could display the list of the members who rejected the objection. At last, voting again should be prevented in contract.</em></p>
        </div>
        <div className="Objection-list">
          <h3>Objection events</h3>
          <p><em>TODO: The events are watched and logged in console.log, for now.</em></p>
        </div>
      </div>
    );
  }
}

export default Objection;
