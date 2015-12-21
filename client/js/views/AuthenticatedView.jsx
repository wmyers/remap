import React from 'react';
import LoginStore from '../stores/LoginStore';
import RouterStore from '../stores/RouterStore';

import AbstractAuthenticatedView from './AbstractAuthenticatedView';

/**
 * Exports a higher-order component that connects the component to the LoginStore.
 * This higher-order component is most easily used as an ES7 decorator.
 * Decorators are just a syntax sugar over wrapping class in a function call.
 */

export default (ComposedView) => {
  return class AuthenticatedView extends AbstractAuthenticatedView{

    static onEnter(nextState, transition) {
      //always store the next location
      RouterStore.storeActiveTransitionPath(nextState.location.pathname);

      if (!LoginStore.isLoggedIn()) {
        transition.to('/shim');
      }
    }

    render() {

      let showSubHeader = this.props.route.hideSubHeader ? false : true;

      return (
        <div>
          <ComposedView
            {...this.props}
            user={this.state.user}
            jwt={this.state.jwt}
            userLoggedIn={this.state.userLoggedIn} />
        </div>
      );
    }
  }
};
