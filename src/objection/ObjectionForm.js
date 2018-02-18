import React, { Component } from 'react';

class ObjectionForm extends Component {
  constructor(props) {
    super(props);

    const objectionContract = window.web3.eth.contract ([{"constant":true,"inputs":[],"name":"currentJustification","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"names","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"reject","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"forceEnd","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"proposed_value","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ending_date","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"variable_name","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"endObjection","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"values","outputs":[{"name":"value","type":"int256"},{"name":"used","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"justification","type":"string"},{"name":"value","type":"int256"},{"name":"variable","type":"bytes32"}],"name":"openObjection","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"Fail","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"varname","type":"bytes32"},{"indexed":false,"name":"value","type":"int256"}],"name":"Succeed","type":"event"}]);

    this.state = {
      objectionInstance: objectionContract.at ('0x54d11B9dfA840B0b7a36BC625D47913c381c8417'),
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
    const { openObjection } = this.state.objectionInstance;
    openObjection (
      this.state.currentJustification,
      this.state.proposed_value,
      this.state.variable_name,
      {
        from: window.web3.eth.accounts[0],
      },
      (err, tx) => {
        if (err) console.error ('An error occured:', err);
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
        <div class="container green">
          <p>Got it! Let's see what the other members think about it, now.</p>
          <p><em>TODO: send a prop / state to the parent component, or re-organize components.</em></p>
        </div>
      );
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Variable name:
            <input name="variable_name" type="text" value={this.state.variable_name} onChange={this.handleInputChange} />
          </label>
          <label>
            Proposed value:
            <input name="proposed_value" type="text" value={this.state.proposed_value} onChange={this.handleInputChange} />
          </label>
          <label>
            Justification:
            <input name="currentJustification" type="text" value={this.state.currentJustification} onChange={this.handleInputChange} />
          </label>
          <input type="submit" value="Open objection" />
        </form>
      );
    }
  }
}

export default ObjectionForm;
