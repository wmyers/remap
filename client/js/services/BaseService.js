export default class BaseService {

  constructor() {
    this._domain = window.location.protocol + '//' + window.location.host;
  }

  get domain(){
    return this._domain;
  }

}
