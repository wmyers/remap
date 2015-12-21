import ActionTypes from '../constants/ActionTypes';
import AbstractRequestStore from './AbstractRequestStore';
import { dispatch } from '../dispatchers/AppDispatcher';

class SignupStore extends AbstractRequestStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._error = null;
    this._token = null;
  }

  _registerToActions(action) {
    switch(action.type) {
      case ActionTypes.REQUEST_SIGNUP_USER_SUCCESS:
        this._error = null;
        this._token = action.body.token;
        this.emitChange();
        break;

      case ActionTypes.REQUEST_SIGNUP_USER_ERROR:
        this._token = null;
        this._error = action.error;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get error() {
    return this._error;
  }

  get token() {
    return this._token;
  }
}

export default new SignupStore();
