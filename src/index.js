import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './componentes/Login';
import Logout from './componentes/Logout';
import * as serviceWorker from './serviceWorker';
import './css/timeline.css';
import './css/login.css';
import './css/reset.css';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('auth-token') !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state:{msg:'Você precisa estar logado para acessar a Timeline!'}
            }}
          />
        )
      }
    />
  );
}

ReactDOM.render(
  <Router history={history}>
    <Switch> 
      <Route exact path="/" component={Login} />
      <Route path="/logout" component={Logout} />
      <PrivateRoute path="/timeline" component={App} />
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
