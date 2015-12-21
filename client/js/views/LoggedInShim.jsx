import React from 'react';
import LoginActionCreators from '../actions/LoginActionCreators';

class LoggedInShim extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.dispatchToken();
  }

  dispatchToken(){
    let token = this.props.routeParams.token;
    LoginActionCreators.loggedInViaThirdParty(token);
  }

  render() {
    return (
      <div />
    );
  }
}

export default LoggedInShim
