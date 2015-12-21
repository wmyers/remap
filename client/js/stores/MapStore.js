import ActionTypes from '../constants/ActionTypes';
import AbstractRequestStore from './AbstractRequestStore';
import _ from 'lodash';

//static data
import { ip_cities } from '../../data/static/ip_cities';

class MapStore extends AbstractRequestStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._error = null;
    this._locations = null;
  }

  //TODO seperate out storage of different returned collections of locations

  _registerToActions(action) {
    switch(action.type) {

      case ActionTypes.REQUEST_TARGET_GET_DATA:
        this.requestPending = true;
        break;

      case ActionTypes.REQUEST_TARGET_GET_DATA_SUCCESS:
        this.requestPending = false;
        this._error = null;
        this._locations = action.body.locations;
        this.emitChange();
        break;

      case ActionTypes.REQUEST_TARGET_GET_DATA_ERROR:
        this.requestPending = false;
        this._error = action.error;
        this.emitChange();
        break;

      case ActionTypes.LOGOUT_USER:
        this._locations = null;
        break;

      default:
        break;
    }
  }

  get locations() {
    return this._locations;
  }

  get error() {
    return this._error;
  }

  get ipCities(){
    return ip_cities;
  }

}

export default new MapStore();
