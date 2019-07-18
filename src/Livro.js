import React, {Component} from 'react';

export default class Livro extends Component {

  render() {
    return (
      <div>
        <div id="main">
          <div className="header">
            <h1>Cadastro de livros</h1>
          </div>
          <div className="content" id="content">
          </div>
        </div> 
      </div>
    );
  }
}