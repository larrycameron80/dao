import React, { Component } from 'react';
import './Button.css';

class ButtonLink extends Component {
  render() {
    return (
      <a className="pure-button btn" href={ this.props.href }>
        { this.props.anchor }
      </a>
    );
  }
}

export default ButtonLink;
