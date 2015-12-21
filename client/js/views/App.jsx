import React, { cloneElement } from 'react/addons';

import LoginStore from '../stores/LoginStore';
import RouterStore from '../stores/RouterStore';
import LoginActionCreators from '../actions/LoginActionCreators';

import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';


const { CSSTransitionGroup } = React.addons;

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  //forces the default URL to home page or login
  static onEnter(nextState, transition) {
    if(nextState.location.pathname === '/'){
      transition.to('/home');
    }
  }

  componentDidMount() {
    //register change listener with LoginStore
    this.changeListener = this._onLoginChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }

  /*
    This event handler deals with all code-initiated routing transitions
    when logging in or logging out
  */
  _onLoginChange() {
    //get any activeTransitionPath
    let transitionPath = RouterStore.activeTransitionPath || '/home';

    //trigger router change
    if(LoginStore.isLoggedIn()){
      this.context.router.transitionTo(transitionPath);
    }else{
      this.context.router.transitionTo('/login');
    }
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  render() {
    var key = this.props.location.pathname;

    return (
      <div>
        <div className="page">
          <header>Remap</header>
          {this.props.children}
        </div>
        <LoadingSpinner/>
        <Modal/>
      </div>
    );
  }

}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default App;
