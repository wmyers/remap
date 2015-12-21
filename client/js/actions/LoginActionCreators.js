import { dispatch, dispatchAsync } from '../dispatchers/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export default {
  loginUser: (email, password) => {
    let promise = AuthService.login(email, password);
    dispatchAsync(promise, {
      request: ActionTypes.REQUEST_LOGIN_USER,
      success: ActionTypes.REQUEST_LOGIN_USER_SUCCESS,
      failure: ActionTypes.REQUEST_LOGIN_USER_ERROR
    }, { email, password });
  },

  //logging in via Facebook with OAuth strategy
  loginFBUser: () => {
    AuthService.fbLogin();
  },

  //after loggedIn callback from third party (e.g Facebook via OAuth)
  loggedInViaThirdParty: (token) => {
    setTimeout(() => {
      let body = {token};
      dispatch(ActionTypes.REQUEST_LOGIN_USER_SUCCESS, {body});
    }, 1)
  },

  //signing up and then immediately logging in
  loginSignup: (token) => {
    setTimeout(() => {
      let body = {token};
      dispatch(ActionTypes.REQUEST_LOGIN_USER_SUCCESS, {body});
    }, 1)
  },

  signup: (firstName, lastName, email, password, userType) => {
    let promise = AuthService.signup(firstName, lastName, email, password, userType);
    dispatchAsync(promise, {
      request: ActionTypes.REQUEST_SIGNUP_USER,
      success: ActionTypes.REQUEST_SIGNUP_USER_SUCCESS,
      failure: ActionTypes.REQUEST_SIGNUP_USER_ERROR
    }, { firstName, lastName, email, password, userType});
  },

  logoutUser: () => {
    dispatch(ActionTypes.LOGOUT_USER);
  },

  getUserData: (token) => {
    let promise = UserService.get(token);
    dispatchAsync(promise, {
      request: ActionTypes.REQUEST_USER_DATA,
      success: ActionTypes.REQUEST_USER_DATA_SUCCESS,
      failure: ActionTypes.REQUEST_USER_DATA_ERROR
    }, {} );
  }
}
