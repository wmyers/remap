// Using Modal-backdrop and Modal-dialog styles from touchstoneJS

'use strict';

import React from 'react';
import ModalStore from '../stores/ModalStore';
import UIActionCreators from '../actions/UIActionCreators';

class Modal extends React.Component {
	constructor(){
		super();
		this.state = {
			isShown:false
		}
	}

	onOK(){
		this.state.modalFunc && this.state.modalFunc();
		UIActionCreators.hideModal();
	}

	onCancel(){
		UIActionCreators.hideModal();
	}

	componentDidMount() {
    this.changeListener = this._onModalChange.bind(this);
    ModalStore.addChangeListener(this.changeListener);
  }

	_onModalChange(){
		this.setState({
      ...ModalStore.modalData
    });
  }

  componentWillUnmount() {
    ModalStore.removeChangeListener(this.changeListener);
  }

	createMarkup() {
    return {__html: this.state.modalMessage};
  };

	render() {

		let displayStyle = {
			display: this.state.isShown ? 'block' : 'none'
		}

		return (
			<div style={displayStyle}>
				<div className="Modal-backdrop"/>
				<div className="Modal-dialog">
					<h3>
						{this.state.modalTitle}
          </h3>
					<div>
						{
							this.state.modalType === 'alert' && this.state.modalMessage
						}
						{
							this.state.modalType === 'message' &&
							<UI.Textarea disabled className="text-left text-md" value={this.state.modalMessage} rows={8}/>
						}
						{
							this.state.modalType === 'html' &&
							<div className="text-left text-md"
				        dangerouslySetInnerHTML={this.createMarkup()}
				        />
						}
					</div>
					<button className="form-style-button" type="button" onClick={this.onOK.bind(this)}>OK</button>
					{
						this.state.modalCancel &&
						<button className="form-style-button" type="button" onClick={this.onCancel.bind(this)}>Cancel</button>
					}
				</div>
			</div>
		);
	}
}

export default Modal;
