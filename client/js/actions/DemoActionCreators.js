import { dispatch, dispatchAsync } from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import LoginStore from '../stores/LoginStore';
import UserDataService from '../services/UserDataService';
import StaticDataService from '../services/StaticDataService';


export default {
  //use StaticDataService
  getDummyData: (filename) => {
    let promise = StaticDataService.getStaticData(filename);
    dispatchAsync(promise, {
      request: ActionTypes.REQUEST_TARGET_GET_DATA,
      success: ActionTypes.REQUEST_TARGET_GET_DATA_SUCCESS,
      failure: ActionTypes.REQUEST_TARGET_GET_DATA_ERROR
    }, {filename} );
  },

  getData: (path, param) => {
    let token = LoginStore.jwt;
    let promise = UserDataService.getData('demo'+path, token, param);
    dispatchAsync(promise, {
      request: ActionTypes.REQUEST_TARGET_GET_DATA,
      success: ActionTypes.REQUEST_TARGET_GET_DATA_SUCCESS,
      failure: ActionTypes.REQUEST_TARGET_GET_DATA_ERROR
    }, {path, param} );
  }
};
