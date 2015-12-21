import React from "react";
import moment from "moment";
import MapStore from "../stores/MapStore";
import SLocMapStyle from "../map-styles/slocMapStyle";

class SL_Map extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      locations: null,
      map: null,
      mapCenter:[1.3,103.8] //currently Singapore
    }

    //TODO integrate these properties into the component state?
    this.markers = [];
    this.circles = [];
    this.infoWindow = null;
  }

  componentWillMount() {
    this.changeListener = this._onMapStoreChange.bind(this);
    MapStore.addChangeListener(this.changeListener);
  }

  componentDidMount(){
    this._initMap();
  }

  componentWillUnmount() {
    MapStore.removeChangeListener(this.changeListener);
    this._clearMarkers();
    this.infoWindow = null;
  }

  //seems to be not getting the updated state here
  // componentWillUpdate(){
  //   this._updateMap(this.state.locations || []);
  // }

  _onMapStoreChange() {
    //error handling
    if(MapStore.error){
      this.alertModalError(MapStore.error.message);
      return;
    }

    this.setState({
        locations: MapStore.locations
    });
    //nb state shouldn't always update in time, but works here but not in componentWillUpdate?
    this._updateMap(this.state.locations || [])

    //pan to the first returned location as the new center
    this.state.locations.length && this._panToMapCenter(this.state.locations[0].geo);
  }

  _initMap() {
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      minZoom: 2, //cannot zoom all the way out
      scrollwheel: false, //cannot zoom with the scroll-wheel
      center: new google.maps.LatLng(...this.state.mapCenter),
      mapTypeId: google.maps.MapTypeId.TERRAIN,
      styles: SLocMapStyle
    });
    this.setState({map});

    this.infoWindow = new google.maps.InfoWindow({
      content: "",
      maxWidth: 200
    });
  }

  //custom rendering
  _updateMap(locations){
    //clear any existing markers
    this._clearMarkers();

    //clear any circles
    this._clearCircles();

    // Loop through the results array and place a marker for each
    // set of coordinates.
    locations.forEach((l, i) => {
      let latLng = new google.maps.LatLng(...l.geo);

      //marker
      let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        map: this.state.map
      });

      //iife for marker to display map location data in the info window
      let clickHandler = ((mkr, loc, win) => {
        let createdAt = moment(loc.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
        return () => {
          win.setContent(
            '<div>' +
            '<p><b>IP address: </b>'+loc.address+'</p>'+
            '<p><b>Geolocation: </b>Lat:'+loc.geo[0]+' Long:'+loc.geo[1]+'</p>'+
            '<p><b>Date: </b>'+createdAt+'</p>'+
            '</div>'
          );
          win.open(this.state.map, mkr);
        }
      })(marker, l, this.infoWindow);

      marker.addListener('click', clickHandler.bind(this));
      this.markers.push(marker);

      //circles only appear on higher zoom levels
      //TODO render circle radius according to time periods
      let circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: this.state.map,
        center: {lat:latLng.lat(), lng:latLng.lng()},
        radius: 100000/(this.state.map.getZoom()*5)
      });

      this.circles.push(circle);
    });

    //reposition the viewport
    //add a listener to check not too far zoomed in
    let map = this.state.map;
    google.maps.event.addListenerOnce(this.state.map, 'zoom_changed', function() {
      var z = map.getZoom();
      if(z > 10){
        map.setZoom(10);
      }
    });
    let bounds = new google.maps.LatLngBounds();
    this.markers.forEach(marker => bounds.extend(marker.getPosition()));
    this.state.map.fitBounds(bounds);
  }

  //explicit pan
  _panToMapCenter(center) {
    this.state.map.panTo(new google.maps.LatLng(...center));
  }

  //explicit zoom
  _zoomMap(zoom) {
    this.state.map.setZoom(zoom);
  }

  _clearMarkers(){
    this.markers.forEach(m => m.setMap(null));
    this.markers.length = 0;
  }

  _clearCircles(){
    this.circles.forEach(m => m.setMap(null));
    this.circles.length = 0;
  }

  render() {
    return (
      <section className="map-container">
        <div id="map" className="map" ref="map"></div>
      </section>
    );
  }
}

export default SL_Map;
