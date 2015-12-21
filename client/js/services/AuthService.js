import request from 'request';
import bluebird from 'bluebird';
import BaseService from './BaseService';

class AuthService extends BaseService {

  fbLogin() {
    //redirect in the browser
    window.location =  window.location.origin+'/auth/facebook';
  }

  login(email, password) {
    return new bluebird( (resolve, reject) => {
      request.post(
        {
          url: this.domain+'/auth/local',
          body: {email, password},
          json: true
        },
        (err, response, body) => {
          if(err){
            return reject(err);
          }
          if(response.statusCode >= 400){
            return reject(body);
          }
          return resolve(body);
        }
      );
    });
  }

  signup(firstName, lastName, email, password, userType) {
    return new bluebird( (resolve, reject) => {
      request.post(
        {
          url: this.domain+'/api/user',
          body: {firstName, lastName, email, password, userType},
          json: true
        },
        (err, response, body) => {
          if(err){
            return reject(err);
          }
          if(response.statusCode >= 400){
            return reject(body);
          }
          return resolve(body);
        }
      );
    });
  }

}

export default new AuthService();
