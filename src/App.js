import React, { Component } from 'react';
import Header from './componentes/Header';
import Timeline from './componentes/Timeline';

class App extends Component {
  render() {
    const { match: { params } } = this.props;
    console.log(params.login);

    return (
    <div id="root">
      <div className="main">
        <Header/>
        <Timeline login={params.login}/>
      </div>
    </div>
    );
  }
}

export default App;