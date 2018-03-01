import React, { Component } from 'react';
import '../ui/form/Form.css';
import './SendTokenForm.css';

class SendTokenForm extends Component {
  render() {
    if (this.props.tokensSent) {
      return (
        <div className="box green">
          <p>Tokens sent.</p>
        </div>
      );
    } else {
      return (
        <div className="Send-token-form yellow">
          <div className="box green">
            <form id="Token-send-form" className="pure-form pure-form-aligned" onSubmit={ this.props.onSubmit }>
              <fieldset>
                <div className="pure-control-group">
                  <input name="sendTokensTo" type="text" className="pure-input-1-2" placeholder="Send to address" value={ this.props.to } onChange={ this.props.onChange } />
                </div>
                <div className="pure-control-group">
                  <input name="sendTokensAmount" type="text" className="pure-input-1-2" placeholder="Amount of TALAOs" value={ this.props.amount } onChange={ this.props.onChange } />
                </div>
                <div className="pure-control-group">
                  <input className="pure-input-1-2 pure-button btn" type="submit" value="Send TALAOs" />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      );
    }
  }
}

export default SendTokenForm;
