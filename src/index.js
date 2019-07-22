import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import * as serviceWorker from './serviceWorker';
import './css/timeline.css';
import './css/login.css';
import './css/reset.css';
import {BrowserRouter, Route} from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

ReactDOM.render(
  <BrowserRouter history={history}>
    <Route path="/" exact component={Login} />
    <Route path="/timeline" component={App} />
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
