import React, { Component } from "react";
import $ from "jquery";
import InputCustomizado from "./componentes/InputCustomizado";
import BotaoSubmitCustomizado from "./componentes/BotaoSubmitCustomizado";
import PubSub from "pubsub-js";
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

  constructor() {
    super();

    this.state = {
      nome: '',
      email: '',
      senha: ''
    };

    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento) {
    evento.preventDefault();

    $.ajax({
      url:'https://cdc-react.herokuapp.com/api/autores',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({
        nome: this.state.nome,
        email: this.state.email,
        senha: this.state.senha
      }),
      success: novaLista => {
        PubSub.publish('atualiza-lista-autores', novaLista);
        this.setState({nome: '', email: '', senha: ''});
      },
      error: resposta => {
        if (resposta.status === 400) {
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: () => PubSub.publish('limpa-erros', {})
    });
  }

  salvaAlteracao(nomeInput, evento) {
    const campo = {};
    campo[nomeInput] = evento.target.value;
    this.setState(campo);
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>
          <InputCustomizado id="nome" label="Nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')} />
          <InputCustomizado id="email" label="Email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')} />
          <InputCustomizado id="senha" label="Senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')} />
          <BotaoSubmitCustomizado label="Gravar"/>
        </form>             
      </div>
    );
  }
}

class TabelaAutores extends Component {

  render() {
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.lista.map(autor => {
              return (
                <tr key={autor.id}>
                  <td>{autor.nome}</td>
                  <td>{autor.email}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

export default class AutorBox extends Component {

  constructor() {
    super();
    this.state = {lista : []};
    this.atualizaListagem = this.atualizaListagem.bind(this);
  }

  componentDidMount(){  
    $.ajax({
        url: 'https://cdc-react.herokuapp.com/api/autores',
        dataType: 'json',
        success: resposta => {    
          this.setState({lista:resposta});
        }
      }
    );

    PubSub.subscribe('atualiza-lista-autores', (topico, novaLista) => {
      this.setState({ lista: novaLista });
    });
  }

  atualizaListagem(novaLista) {
    this.setState({lista:novaLista});
  }

  render() {
    return (
      <div>
        <div id="main">
          <div className="header">
            <h1>Cadastro de autores</h1>
          </div>
          <div className="content" id="content">
            <FormularioAutor />  
            <TabelaAutores lista={this.state.lista} />
          </div>
        </div> 
      </div>
    );
  }
}