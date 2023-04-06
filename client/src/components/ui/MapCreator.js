import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      street: '',
      city: '',
      postal_code: ''
    };
  }

  handleMapClick = (t, map, coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    // Uzyskanie danych z API Google Maps
    const geocoder = new this.props.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        const addressComponents = results[0].address_components;
        const street = addressComponents.find(
          component => component.types.includes('route')
        )?.long_name;
        const city = addressComponents.find(
          component => component.types.includes('locality')
        )?.long_name;
        const postal_code = addressComponents.find(
          component => component.types.includes('postal_code')
        )?.long_name;

        this.setState({ street, city, postal_code });

        this.props.onMapClick({ street, city, postal_code });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  };

  render() {
    return (
      <Map
        google={this.props.google}
        containerStyle={{"width": 50 + "%", "height": 65 + "%", "left": 25 + "%", "right": 25 + "%"}}
        style={{"marginBottom": 5 + "rem"}}
        initialCenter={{ lat: 52.2297, lng: 21.0122 }}
        zoom={14}
        onClick={this.handleMapClick}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDIF438lNbCB5BSuBN_S-Jvj6PG711dKc",
  language: "pl",
})(MapContainer);
