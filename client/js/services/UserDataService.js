import request from 'request';
import bluebird from 'bluebird';
import BaseService from './BaseService';

class UserDataService extends BaseService {

  registerData(endpoint, token, config) {
    return new bluebird( (resolve, reject) => {
      request.post(
        {
          url: this.domain+'/api/'+endpoint,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: config,
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

  getData(endpoint, token, id) {
    return new bluebird( (resolve, reject) => {
      request.get(
        {
          url: this.domain + '/api/'+endpoint+'/'+id,
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

  updateData(endpoint, token, id, config) {
    return new bluebird( (resolve, reject) => {
      request.put(
        {
          url: this.domain + '/api/'+endpoint+'/'+id,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: config,
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

export default new UserDataService();
