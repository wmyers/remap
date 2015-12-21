//customise message for express-jwt validation fails
module.exports = function jwtError(err, req, res, next){
  if(err.name === "UnauthorizedError" && err.inner && err.inner.name === "TokenExpiredError"){
    err.message = "Your session has expired please login again";
  }
  next(err);
}
