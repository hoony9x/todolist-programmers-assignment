import React from 'react';
import ReactDOM from 'react-dom';
import { loadCSS } from 'fg-loadcss';

import App from './App';
import * as serviceWorker from './serviceWorker';

/* Load Roboto Font from Google CDN */
loadCSS('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');

/* Font Awesome */
loadCSS('https://use.fontawesome.com/releases/v5.9.0/css/all.css');

/* XEIcon - for Kakao Icon */
loadCSS('https://cdn.jsdelivr.net/npm/xeicon@2.3.3/xeicon.min.css');

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();