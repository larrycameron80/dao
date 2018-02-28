import React from 'react';
import ReactDOM from 'react-dom';
import 'purecss';
import './assets/fonts/akkmono.woff';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
registerServiceWorker();
