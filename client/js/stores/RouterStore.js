import ActionTypes from '../constants/ActionTypes';
import AbstractStore from './AbstractStore';

class RouterStore extends AbstractStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._activeRouterPath = null;
    this._pathHistoryLength = 0;
    this._nextRouterTransitionKey = 'view-transition-fade';
  }

  _registerToActions(action) {
    switch(action.type) {

      default:
        break;
    };
  }

  //using methods - actions don't work here, end up with 'dispatch within dispatch' errors and
  //the transition key does not seem to persist before it is accessed again by CSSTransitionGroup

  //store the active transition path, if requiring authentication
  storeActiveTransitionPath(path){
    this._activeRouterPath = path;
    this._pathHistoryLength ++;
  }

  //store the next transition key (animation type)
  storeNextTransitionKey(transitionKey){
    this._nextRouterTransitionKey =  'view-transition-'+ (transitionKey || 'fade');
  }

  //adjust the history count to go back one
  goBack(){
    this._pathHistoryLength--;
  }


  //only gets called by App.jsx after authenticating
  get activeTransitionPath() {
    return this._activeRouterPath;
  }

  get nextTransitionKey() {
    return this._nextRouterTransitionKey;
  }

  get pathHistoryLength() {
    return this._pathHistoryLength;
  }

}

export default new RouterStore();
