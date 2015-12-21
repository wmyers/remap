// Using loading-spinner and loading-spinner-indicator styles from touchstoneJS

'use strict';

import React from 'react';
import LoadStore from '../stores/LoadStore';

class LoadingSpinner extends React.Component {
	constructor(){
		super();
		this.state = {
			loading:false
		}
	}

	componentDidMount() {
    this.changeListener = this._onLoadChange.bind(this);
    LoadStore.addChangeListener(this.changeListener);
  }

	_onLoadChange(){
    this.setState({
      ...LoadStore.loadState
    });
  }

  componentWillUnmount() {
    LoadStore.removeChangeListener(this.changeListener);
  }

	render() {
		let displayStyle = {
			display: this.state.loading ? 'block' : 'none'
		}

		return (
			<div style={displayStyle}>
				{/*<div className="loading-overlay"/>*/}
				<div className="loading-spinner"/>
				<div className="loading-spinner-indicator"/>
			</div>
		);
	}
}

export default LoadingSpinner;
