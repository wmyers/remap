import request from 'request';
import bluebird from 'bluebird';
import BaseService from './BaseService';

class UserService extends BaseService {

  get(token) {
    return new bluebird( (resolve, reject) => {
      request.get(
        {
          url: this.domain + '/api/user/me',
          headers: {
            'Authorization': 'Bearer ' + token
          },
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

export default new UserService();
