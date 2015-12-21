import AbstractStore from './AbstractStore'
import StaticDataService from '../services/StaticDataService';
import UIActionCreators from '../actions/UIActionCreators';
import Promise from 'bluebird';

export default class AbstractRequestStore extends AbstractStore {

  constructor() {
    super();
    this._requestPending = false;
  }

  getStaticDataAsPromise(staticData, fileName) {
    var that = this;
    return new Promise( (resolve, reject) => {
      if(staticData){
        return resolve(staticData);
      }else{
        return StaticDataService.getStaticData(fileName)
        .then((staticData) => {
          that['_'+fileName] = staticData;
          return resolve(staticData);
        })
      }
    })
  }

  get requestPending(){
    return this._requestPending;
  }

  set requestPending(bool){
    this._requestPending = bool;
    //TODO should AbstractRequestStore trigger a UIAction?
    UIActionCreators.setLoadingState(bool);
  }
}
