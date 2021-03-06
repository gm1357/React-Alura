import React, { Component } from 'react';
import FotoItem from './FotoItem';

export default class Timeline extends Component {

  constructor() {
    super();
    this.state = {fotos: []};
  }

  carregaFotos(props) {
    let urlPerfil;

    if (props.login === undefined) {
      urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
    } else {
      urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${props.login}`;
    }

    fetch(urlPerfil)
      .then(response => response.json())
      .then(fotos => {
        this.setState({fotos: fotos});
      });
  }
  
  componentDidMount() {
    this.carregaFotos(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login !== undefined) {
      this.carregaFotos(nextProps);
    }
  }

  render(){
      return (
      <div className="fotos container">
        {
          this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto}/>)
        }
      </div>            
      );
  }
}