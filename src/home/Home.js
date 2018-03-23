import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <article className="Home">
        <h1>Welcome to the Talao DAO!</h1>
        <p>This is a <strong>prototype</strong> of the Talao DAO.</p>
        <p>As a member of the Talao DAO, if you want to change some parameters of the DAO, then you can submit Objections. For now, you can try here an extremely simple Objection.</p>
        <p>More sophisticated Objections and other stuff will come soon. For more more information about Talao, please head to the <a href="https://ico.talao.io" target="_blank" rel="noopener noreferrer">Talao ICO website</a>.</p>
        <p><em>Happy testing and reading!</em></p>
      </article>
    );
  }
}

export default Home;
