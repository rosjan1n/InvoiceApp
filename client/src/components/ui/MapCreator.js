import React, { Component } from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

class MapContainer extends Component {
  handleMapClick = (mapProps, map, clickEvent) => {
    const geocoder = new this.props.google.maps.Geocoder();
    geocoder.geocode({ location: clickEvent.latLng }, (results, status) => {
      if (status === "OK") {
        const address = results[0].address_components;
        const street = address.find((comp) =>
          comp.types.includes("route")
        )?.long_name;
        const city = address.find((comp) =>
          comp.types.includes("locality")
        )?.long_name;
        const postalCode = address.find((comp) =>
          comp.types.includes("postal_code")
        )?.long_name;
        console.log(`${street}, ${city} ${postalCode}`);
      } else {
        console.error(
          "Geocode was not successful for the following reason:",
          status
        );
      }
    });
  };

  render() {
    return (
      <div className="m-auto">
        <Map
          google={this.props.google}
          onClick={this.handleMapClick}
          initialCenter={{ lat: 52.22977, lng: 21.01178 }}
          zoom={10}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDIF438lNbCB5BSuBN_S-Jvj6PG71Y1dKc",
  language: "pl",
})(MapContainer);
