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
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
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

  setNome(evento) {
    this.setState({ nome: evento.target.value });
  }

  setEmail(evento) {
    this.setState({ email: evento.target.value });
  }

  setSenha(evento) {
    this.setState({ senha: evento.target.value });
  }

  render() {
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>
          <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
          <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
          <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
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