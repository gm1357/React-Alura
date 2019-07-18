import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import SelectCustomizado from './componentes/SelectCustomizado';
import BotaoSubmitCustomizado from './componentes/BotaoSubmitCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class TabelaLivros extends Component {

  render() {
    return(
      <table className="pure-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Preço</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.lista.map(livro => {
              return (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor.nome}</td>
                  <td>{livro.preco}</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

class FormularioLivros extends Component {

  constructor() {
    super();
    this.state = { 
      titulo: '',
      preco: '',
      autorId: '',
      listaAutores: []
    };

    this.enviaForm = this.enviaForm.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setTitulo = this.setTitulo.bind(this);
  }

  componentWillMount() {
    $.ajax({
      url: 'https://cdc-react.herokuapp.com/api/autores',
      dataType: 'json',
      success: autores => {    
        this.setState({ listaAutores: autores });
      }
    });
  }

  enviaForm(evento) {
    evento.preventDefault();

    $.ajax({
      url:'https://cdc-react.herokuapp.com/api/livros',
      contentType:'application/json',
      dataType:'json',
      type:'post',
      data: JSON.stringify({
        titulo: this.state.titulo,
        preco: this.state.preco,
        autorId: this.state.autorId
      }),
      success: novaLista => {
        PubSub.publish('atualiza-lista-livros', novaLista);
        this.setState({titulo: '', preco: '', autorId: ''});
      },
      error: resposta => {
        if (resposta.status === 400) {
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      },
      beforeSend: () => PubSub.publish('limpa-erros', {})
    });
  }

  setTitulo(evento) {
    this.setState({ titulo: evento.target.value});
  }

  setPreco(evento) {
    this.setState({ preco: evento.target.value});
  }

  setAutorId(evento) {
    this.setState({ autorId: evento.target.value});
  }

  render() {
    return(
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>
          <InputCustomizado id="titulo" label="Título" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} />
          <InputCustomizado id="preco" label="Preço" type="number" name="preco" value={this.state.preco} onChange={this.setPreco} />
          <SelectCustomizado id="autorId" label="Autor" name="autorId" value={this.state.autorId} onChange={this.setAutorId} listaValores={this.state.listaAutores} />
          <BotaoSubmitCustomizado label="Gravar"/>
        </form>             
      </div>
    );
  }
}

export default class LivroBox extends Component {

  constructor() {
    super();
    this.state = { listaLivros: [] };
  }

  componentDidMount(){  
    $.ajax({
        url: 'https://cdc-react.herokuapp.com/api/livros',
        dataType: 'json',
        success: livros => {    
          this.setState({ listaLivros: livros });
        }
      }
    );

    PubSub.subscribe('atualiza-lista-livros', (topico, novaLista) => {
      this.setState({ listaLivros: novaLista });
    });
  }

  render() {
    return (
      <div>
        <div id="main">
          <div className="header">
            <h1>Cadastro de livros</h1>
          </div>
          <div className="content" id="content">
            <FormularioLivros />
            <TabelaLivros lista={this.state.listaLivros} />
          </div>
        </div> 
      </div>
    );
  }
}