import ActionTypes from '../constants/ActionTypes';
import AbstractStore from './AbstractStore';
import _ from 'lodash';


class ModalStore extends AbstractStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._resetModal();
  }

  _registerToActions(action) {
    switch(action.type) {

      case ActionTypes.SHOW_MODAL:
        this._modalData = {
          modalType: action.modalType,
          modalCancel: action.modalCancel,
          modalTitle: action.modalTitle,
          modalMessage: action.modalMessage,
          modalFunc: action.modalFunc,
          isShown:true
        }
        this.emitChange();
        break;

      case ActionTypes.HIDE_MODAL:
        this._resetModal();
        this.emitChange();
        break;

      default:
        break;
    }
  }

  _resetModal(){
    this._modalData = {
      modalType: 'alert',
      modalCancel: null,
      modalTitle: null,
      modalMessage: null,
      modalFunc: null,
      isShown:false
    }
  }

  get modalData() {
    return this._modalData;
  }

}

export default new ModalStore();
