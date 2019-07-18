import PubSub from 'pubsub-js';

export default class TratadorErros {

  publicaErros(erros) {
    erros.errors.map(erro => PubSub.publish('erro-validacao', erro));
  }
}