import React from 'react';
import ReactDOM from 'react-dom';
import './assets/fonts/akkmono.woff';
import './index.css';
import { Web3Provider } from 'react-web3';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Web3Provider>
    <App />
  </Web3Provider>,
  document.getElementById('root')
);
registerServiceWorker();
