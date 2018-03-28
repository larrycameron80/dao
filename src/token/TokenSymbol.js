import React, { Component } from 'react';
import SVG from 'react-inlinesvg';
import './TokenSymbol.css';
import image from './assets/images/TokenSymbol.svg';

class TokenSymbol extends Component {
  render() {
    return (
      <div className="TokenSymbol">
        <SVG
          src = { image }>
          <img src = { image } alt = "TALAO" />
        </SVG>
      </div>
    );
  }
}

export default TokenSymbol;
