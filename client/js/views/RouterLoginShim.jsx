import React from 'react';
import RouterStore from '../stores/RouterStore';
import LoginStore from '../stores/LoginStore';

class RouterLoginShim extends React.Component {

  constructor(props, context) {
    super(props, context);

    //the context router should exist by now
    this.transitionCheck();
  }

  transitionCheck(){
    let router = this.context.router;

    //if not waiting for some async login outcome then re-direct to login
    if (!LoginStore.isLoggingIn){
      router.transitionTo('/login');
    }

    //if you've gone here by accident
    if(LoginStore.isLoggedIn()){
      //get activeTransitionPath
      let transitionPath = RouterStore.activeTransitionPath || '/home';
      //reset the path again for the change handler in App.jsx
      RouterStore.storeActiveTransitionPath(transitionPath);

      router.transitionTo(transitionPath);
    }
  }

  render() {
    return (
      <div />
    );
  }
}

RouterLoginShim.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default RouterLoginShim
