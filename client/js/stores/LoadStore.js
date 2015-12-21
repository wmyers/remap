import ActionTypes from '../constants/ActionTypes';
import AbstractStore from './AbstractStore';


class LoadStore extends AbstractStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._resetState();
  }

  _registerToActions(action) {
    switch(action.type) {

      case ActionTypes.START_LOAD:
        this._loadState = {
          loading:true
        }
        this.emitChange();
        break;

      case ActionTypes.STOP_LOAD:
        this._resetState();
        this.emitChange();
        break;

      default:
        break;
    }
  }

  _resetState(){
    this._loadState = {
      loading:false
    }
  }

  get loadState() {
    return this._loadState;
  }

}

export default new LoadStore();
