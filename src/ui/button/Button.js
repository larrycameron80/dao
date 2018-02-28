import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './Button.css';

class Button extends Component {
  icon() {
    return (
      <FontAwesomeIcon icon={ this.props.icon } />
    );
  }
  render() {
    return (
      <button className="pure-button btn">
        { !!(this.props.icon) ? <FontAwesomeIcon icon={ this.props.icon } /> : '' } { this.props.value }
      </button>
    );
  }
}

export default Button;
