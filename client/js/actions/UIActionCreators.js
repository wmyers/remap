import { dispatch, dispatchAsync } from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import StaticDataService from '../services/StaticDataService';

export default {
  simpleListItemRequest(store){
    dispatch(ActionTypes.SIMPLE_LIST_ITEM_REQUEST, {store});
  },

  showModal(modalType, modalCancel, modalTitle, modalMessage, modalFunc){
    setTimeout(() => {
      dispatch(ActionTypes.SHOW_MODAL, {modalType, modalCancel, modalTitle, modalMessage, modalFunc});
    }, 0)
  },

  hideModal(){
    setTimeout(() => {
      dispatch(ActionTypes.HIDE_MODAL, {});
    }, 0)
  },

  setLoadingState(bool){
    setTimeout(() => {
      let action = bool ? ActionTypes.START_LOAD : ActionTypes.STOP_LOAD;
      dispatch(action, {});
    }, 0)
  }
};
