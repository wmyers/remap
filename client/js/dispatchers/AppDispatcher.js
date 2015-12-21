//taken from gaeron flux-react-router-example with minor edits
//https://github.com/gaearon/flux-react-router-example/

import { Dispatcher } from 'flux';

const flux = new Dispatcher();

export function register(callback) {
  return flux.register(callback);
}

export function waitFor(ids) {
  return flux.waitFor(ids);
}

// Some Flux examples have methods like `handleViewAction`
// or `handleServerAction` here. They are only useful if you
// want to have extra pre-processing or logging for such actions,
// but I found no need for them.

/**
 * Dispatches a single action.
 */
export function dispatch(type, action = {}) {
  if (!type) {
    throw new Error('You forgot to specify type.');
  }

  //check for differently formatted error objects
  if(action.error){
    var err = action.error;
    //check for an error obj wrapped in an error obj, returned by express errorHandler middleware
    //TODO fix this issue on the backend
    if(err.error){
      err = err.error;
    }
    //check if error is a String
    if(typeof err === "string"){
      err = {message: err};
    }
    action.error = err;
  }

  // In production, thanks to DefinePlugin in webpack.config.production.js,
  // this comparison will turn `false`, and UglifyJS will cut logging out
  // as part of dead code elimination.
  if (process.env.NODE_ENV !== 'production') {
    // Logging all actions is useful for figuring out mistakes in code.
    // All data that flows into our application comes in form of actions.
    // Actions are just plain JavaScript objects describing “what happened”.
    // Think of them as newspapers.
    if (action.error) {
      console.error('**', type, action);
    } else {
      console.log('**', type, action);
    }
  }

  flux.dispatch({ type, ...action });
}

/**
 * Dispatches three actions for an async operation represented by promise.
 */
export function dispatchAsync(promise, types, action = {}) {
  const { request, success, failure } = types;

  dispatch(request, action);
  //NB: unable to use Promise.catch() syntax here
  promise.then(
    //dispatches the action for the async-promise-resolved
    //with a hash of the async-promise params and the response body
    (body) => dispatch(success, { ...action, body }),
    (error) => dispatch(failure, { ...action, error })
  )
}
