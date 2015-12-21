var ModalMixin = {
  alertModalError(error){
    //TODO is there some ES6y way of doing this
    let ErrorUtils = require('../utils/ErrorUtils');
    let UIActionCreators = require('../actions/UIActionCreators');

    let title = this.props.route ? this.props.route.title+' Error' : 'Error';
    let message = ErrorUtils.getModalErrorMessage(error);
    UIActionCreators.showModal(
      'alert',
      false,
      title,
      message,
      null
    );
  },
  showModalMessage(title, message){
    require('../actions/UIActionCreators').showModal(
      'message',
      false,
      title,
      message,
      null
    );
  },
  showModalHTML(title, message){
    require('../actions/UIActionCreators').showModal(
      'html',
      false,
      title,
      message,
      null
    );
  }
}

export default ModalMixin;
