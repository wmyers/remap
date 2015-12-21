import React from "react";
import ReactMixin from "react-mixin";
import ModalMixin from '../mixins/ModalMixin';

import MapStore from "../stores/MapStore";
import DemoActionCreators from "../actions/DemoActionCreators";

class SL_MapForm extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      skId:'',
      demoIPAddress:''
    }
  }

  // Demo data request handlers

  _getDemoTargetWithIP(e) {
    e.target && e.preventDefault();
    if(!this.state.demoIPAddress || !this.state.demoIPAddress.match(/(\d+\.\d+\.\d+\.\d+)/)){
      this.alertModalError('Please input an IP address');
      return;
    }
    DemoActionCreators.getData('/geoip', this.state.demoIPAddress);
  }

  _getTargetCityWithIP(e) {
    e.target && e.preventDefault();
    let ip = event.target.value;
    if(!ip){
      return;
    }
    DemoActionCreators.getData('/geoip', ip);
  }

  _getDemoTargetAPAC(e) {
    e.target && e.preventDefault();
    DemoActionCreators.getDummyData('demo_locations_APAC');
  }

  render() {

    return (

        <div className="ui-container">

          <section className="form-style">
            <label htmlFor="ipAddress">IP Address</label>
            <input type="text" name="demoIPAddress" id="demoIPAddress" ref="demoIPAddress" valueLink={this.linkState('demoIPAddress')} />
            <button type="button" onClick={this._getDemoTargetWithIP.bind(this)}>Get Location</button>
  				</section>

          <section className="form-style">
            <label htmlFor="city">Test City</label>
            <select onChange={this._getTargetCityWithIP.bind(this)}>
              {this.props.ipCityOptions}
            </select>
            <hr></hr>
            <button type="button" onClick={this._getDemoTargetAPAC.bind(this)}>Test Location History</button>
  				</section>

        </div>
    );
  }
}

ReactMixin(SL_MapForm.prototype, React.addons.LinkedStateMixin);
ReactMixin(SL_MapForm.prototype, ModalMixin);

SL_MapForm.defaultProps = {
  ipCityOptions: MapStore.ipCities.map(
    city => <option key={`option-${city.name}`} value={city.ip}>{city.name}</option>)
};

export default SL_MapForm;
