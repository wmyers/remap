import React from 'react';
import LoginStore from '../stores/LoginStore';
import RouterStore from '../stores/RouterStore';


class AbstractAuthenticatedView extends React.Component {

  constructor() {
    super();
    this.state = this._getLoginState();
  }

  _getLoginState() {
    return {
      userLoggedIn: LoginStore.isLoggedIn(),
      user: LoginStore.user,
      jwt: LoginStore.jwt
    };
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState(this._getLoginState());
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  // this resolves an issue where an authenticated view can refresh after
  // the user has logged out due to asyncifying the AppDispatcher dispatches
  shouldComponentUpdate(){
    return !!LoginStore.user;
  }
};

export default AbstractAuthenticatedView;
