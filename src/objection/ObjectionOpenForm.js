import React, { Component } from 'react';
import '../ui/form/Form.css';

class ObjectionOpenForm extends Component {
  render() {
    return (
      <form
        id="Objection-open-form"
        className="pure-form pure-form-aligned"
        onSubmit={ this.props.onSubmit }>
        <fieldset>
          <div className="pure-control-group">
            <input
              name="variableName" type="text"
              className="pure-input-1"
              placeholder="Variable name"
              value={ this.props.variableName }
              onChange={ this.props.onChange } />
          </div>
          <div className="pure-control-group">
            <input
              name="proposedValue" type="text"
              className="pure-input-1"
              placeholder="Proposed value"
              value={ this.props.proposedValue }
              onChange={ this.props.onChange } />
          </div>
          <div className="pure-control-group">
            <input
              name="currentJustification"
              type="text" className="pure-input-1"
              placeholder="Justification"
              value={ this.props.currentJustification }
              onChange={ this.props.onChange } />
          </div>
          <div className="pure-control-group">
            <input
              id="Objection-open-form-submit"
              className="pure-input-1 pure-button btn btn-green-inversed"
              type="submit"
              value="Open objection" />
          </div>
        </fieldset>
      </form>
    );
  }
}

export default ObjectionOpenForm;
