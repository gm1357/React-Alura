import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class SelectCustomizado extends Component {

  constructor() {
    super();
    this.state = { msgErro: '' };
  }

  componentDidMount() {
    PubSub.subscribe('erro-validacao', (topico, erro) => {
      if (erro.field === this.props.name) {
        this.setState({ msgErro: erro.defaultMessage });
      }
    });

    PubSub.subscribe('limpa-erros', topico => this.setState({ msgErro: '' }));
  }

  render() {
    return (
      <div className="pure-control-group">
        <label htmlFor={ this.props.id }>{ this.props.label }</label>
        <select value={ this.props.value } name={ this.props.name } onChange={ this.props.onChange }>
          <option value="">Selecione</option>
          { 
            this.props.listaValores.map(valor =>
              <option key={ valor.id } value={ valor.id }>
                { valor.nome }
              </option>
            )
          }
        </select>
        <span className="erro">{this.state.msgErro}</span>
      </div>
    );
  }
}