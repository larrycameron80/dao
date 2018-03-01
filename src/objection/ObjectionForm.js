import React, { Component } from 'react';
import './Objection.css';
import '../ui/form/Form.css';

class ObjectionForm extends Component {
  constructor(props) {
    super(props);

    const objectionContractObject = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentObjectionId","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"currentObjection","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"objection_id","type":"int256"},{"indexed":false,"name":"user","type":"address"}],"name":"UserHasRejected","type":"event"}]);

    this.state = {
      objectionContract: objectionContractObject.at ('0x9fbcdbeed80a3ca6c3b0fcee6f751b95c99d71b4'),
      variable_name: '',
      proposed_value: '',
      currentJustification: '',
      objectionOpened: false
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    const { openObjection } = this.state.objectionContract;
    openObjection (
      this.state.currentJustification,
      this.state.proposed_value,
      this.state.variable_name,
      {
        from: window.web3.eth.accounts[0],
      },
      (err, tx) => {
        if (err) console.error (err);
        else {
          console.log(tx);
          this.setState({
            objectionOpened: true
          });
        }
      }
    );
  }
  render() {
    if (this.state.objectionOpened) {
      return (
        <div className="box green">
          <p>Got it! Let's see what the other members think about it, now.</p>
        </div>
      );
    } else {
      return (
        <form id="Objection-open-form" className="pure-form pure-form-aligned" onSubmit={this.handleSubmit}>
          <fieldset>
            <div className="pure-control-group">
              <input name="variable_name" type="text" className="pure-input-1-2" placeholder="Variable name" value={this.state.variable_name} onChange={this.handleInputChange} />
            </div>
            <div className="pure-control-group">
              <input name="proposed_value" type="text" className="pure-input-1-2" placeholder="Proposed value" value={this.state.proposed_value} onChange={this.handleInputChange} />
            </div>
            <div className="pure-control-group">
              <input name="currentJustification" type="text" className="pure-input-1-2" placeholder="Justification" value={this.state.currentJustification} onChange={this.handleInputChange} />
            </div>
            <div className="pure-control-group">
              <input id="Objection-open-form-submit" className="pure-input-1-2 pure-button btn btn-green-inversed" type="submit" value="Open objection" />
            </div>
          </fieldset>
        </form>
      );
    }
  }
}

export default ObjectionForm;
