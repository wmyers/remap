import React from "react";
import ReactMixin from "react-mixin";
import ModalMixin from '../mixins/ModalMixin';
import LoginActionCreators from "../actions/LoginActionCreators";
import SignupStore from "../stores/SignupStore";

class Signup extends React.Component {

  constructor() {
    super()
    this.state = {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
      error: null,
      confirmPassword: ""
    };
  }

  componentDidMount() {
    this.changeListener = this._onSignupChange.bind(this);
    SignupStore.addChangeListener(this.changeListener);
  }

  componentWillUnmount() {
    SignupStore.removeChangeListener(this.changeListener);
  }

  _onSignupChange() {
    //either display any error or process the successfully returned token
    if(SignupStore.error){
      this.alertModalError(SignupStore.error.message);
    }else if(SignupStore.token){
      LoginActionCreators.loginSignup(SignupStore.token);
    }
  }

  //action
  signup(e) {
    e.target && e.preventDefault();

    //Validate
    let vals = ["firstName", "lastName", "email", "password", "confirmPassword"], currVal;
    let isIncomplete = vals.some((val) => {
      currVal = val;
      return !!this.state[val] === false;
    })
    if(isIncomplete){
      this.alertModalError(`"${currVal}" is required`);
      return;
    }
    if(this.state.password !== this.state.confirmPassword){
      this.alertModalError("Passwords must match");
      return;
    }

    LoginActionCreators.signup(
      this.state.firstName,
      this.state.lastName,
      this.state.email,
      this.state.password
    );
  }

  render() {

    return (
			<div className="form-style signup-form">

					<div>
            <label htmlFor="firstName">First name</label>
						<input type="text" id="firstName" placeholder="First name" valueLink={this.linkState("firstName")}/>
            <label htmlFor="lastName">Last name</label>
            <input type="text" id="lastName" placeholder="Last name" valueLink={this.linkState("lastName")}/>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Email" valueLink={this.linkState("email")}/>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Password" valueLink={this.linkState("password")}/>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input type="password" id="confirmPassword" valueLink={this.linkState("confirmPassword")}/>
					</div>
          <div>
            <button type="button" onClick={this.signup.bind(this)}>Register</button>
          </div>
			</div>
    );
  }
}

ReactMixin(Signup.prototype, React.addons.LinkedStateMixin);
ReactMixin(Signup.prototype, ModalMixin);

export default Signup;
