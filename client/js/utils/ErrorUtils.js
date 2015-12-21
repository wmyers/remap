export function getModalErrorMessage(error){
  let errMessage = '', errs, err, i;
  if(error.errors){
    errs = error.errors;
  }else if(error.message){
    errs = [error];
  }else if(typeof error === 'string'){
    let msg = error.substr(0, error.indexOf(' '));
    msg = msg === 'UnauthorizedError:' ? 'Please login' : error;
    errs = [{message: msg}];
  }else{
    errs = [{message: 'Something went wrong, please try again'}];
  }
  for(i in errs){
    err = errs[i];
    if(err.message){
      errMessage += err.message + '\n';
    }
  }
  return errMessage;
}
