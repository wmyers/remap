import React from "react";
import ReactMixin from "react-mixin";
import ModalMixin from '../mixins/ModalMixin';
import LoginActionCreators from "../actions/LoginActionCreators";
import LoginStore from "../stores/LoginStore";
import RouterStore from "../stores/RouterStore";

class Login extends React.Component {

  constructor() {
    super()
    this.state = {
			email: "dave@test.com",
			password: "test",
    };
  }

  componentDidMount() {
    this.changeListener = this._onLoginChange.bind(this);
    LoginStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    LoginStore.removeChangeListener(this.changeListener);
  }

  _onLoginChange() {
    //error handling
    if(LoginStore.error){
      this.alertModalError(LoginStore.error);
    }
  }

  //action
  login(e) {
    e.target && e.preventDefault();
    LoginActionCreators.loginUser(this.state.email, this.state.password);
  }

  signup(e) {
    e.target && e.preventDefault();
    RouterStore.storeNextTransitionKey('show-from-right');
    this.context.router.transitionTo('signup');
  }

  render() {

    return (
      <div className="form-style login-form">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" placeholder="email" valueLink={this.linkState("email")}/>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" valueLink={this.linkState("password")}/>
        <button type="button" onClick={this.login.bind(this)}>Login</button>
        <button type="button" onClick={this.signup.bind(this)}>Signup</button>
      </div>
    );
  }
}

ReactMixin(Login.prototype, React.addons.LinkedStateMixin);
ReactMixin(Login.prototype, ModalMixin);

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Login;
