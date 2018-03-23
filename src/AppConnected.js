import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './AppConnected.css';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Home from './home/Home';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import Objection from './objection/Objection';
import Account from './account/Account';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faUser from '@fortawesome/fontawesome-free-solid/faUser';

class AppConnected extends Component {
  render() {
    return (
      <div className="AppConnected">
        <Router>
          <div>
            <nav className="AppConnected-menu blue-light">
              <ul>
                <li>
                  <Link to="/" className="hvr-shutter-in-horizontal"><FontAwesomeIcon icon={ faHome } /></Link>
                </li>
                <li>
                  <Link to="/objections"><FontAwesomeIcon icon={ faCog } /> Objections</Link>
                </li>
                <li>
                  <Link to="/account"><FontAwesomeIcon icon={ faUser } /> My account</Link>
                </li>
              </ul>
            </nav>
            <Route exact path="/" component={ Home } />
            <Route path="/objections" component={ Objection } />
            <Route path="/account" component={ Account } />
          </div>
        </Router>
      </div>
    );
  }
}

export default AppConnected;
