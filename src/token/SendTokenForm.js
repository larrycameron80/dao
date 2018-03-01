import React, { Component } from 'react';
import '../ui/form/Form.css';
import './SendTokenForm.css';

class SendTokenForm extends Component {
  render() {
    if (this.props.tokensSent) {
      return (
        <div className="box blue">
          <p>Tokens sent.</p>
        </div>
      );
    } else {
      return (
        <div className="Send-token-form">
          <form className="pure-form pure-form-aligned" onSubmit={ this.props.onSubmit }>
            <fieldset>
              <div className="pure-control-group">
                <input name="sendTo" type="text" className="pure-input-1-2" placeholder="Send to address" value={ this.props.to } onChange={ this.props.onChange } />
              </div>
              <div className="pure-control-group">
                <input name="sendAmount" type="text" className="pure-input-1-2" placeholder="Amount of TALAOs" value={ this.props.amount } onChange={ this.props.onChange } />
              </div>
              <div className="pure-control-group">
                <input className="pure-input-1-2 pure-button btn" type="submit" value="Send TALAOs" />
              </div>
            </fieldset>
          </form>
        </div>
      );
    }
  }
}

export default SendTokenForm;
