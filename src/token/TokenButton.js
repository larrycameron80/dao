import React, { Component } from 'react';

class TokenButton extends Component {
  render() {
    return(
      <div className="Token-button">
        <button>
          My Talao tokens: { this.props.balance }
        </button>
      </div>
    );
  }
}

export default TokenButton;
