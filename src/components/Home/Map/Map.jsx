import React, { Component, useState } from "react";
import { Map as MapView, Marker, GoogleApiWrapper } from "google-maps-react";
import * as d3 from "d3";
import axios from "axios";

const mapStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        saturation: 36,
      },
      {
        color: "#000000",
      },
      {
        lightness: 40,
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      {
        visibility: "on",
      },
      {
        color: "#000000",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#d81717",
      },
      {
        lightness: 20,
      },
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 17,
      },
      {
        weight: 1.2,
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [
      {
        visibility: "simplified",
      },
      {
        lightness: "-22",
      },
    ],
  },
  {
    featureType: "administrative.country",
    elementType: "geometry",
    stylers: [
      {
        visibility: "on",
      },
      {
        hue: "#ff0000",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "all",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 20,
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 21,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 17,
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 29,
      },
      {
        weight: 0.2,
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 18,
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 16,
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#000000",
      },
      {
        lightness: 19,
      },
    ],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      {
        visibility: "on",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#000",
      },
      {
        lightness: 10,
      },
    ],
  },
];

const containerStyle = {
  position: "absolute",
  width: "100%",
  top: 81,
  right: 0,
  left: 0,
  bottom: 0,
  height: "750px",
};

export class Map extends Component {
  constructor() {
    super(),
      (this.state = {
        mappedData: [],
      });
  }

  componentWillMount() {
    const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/countries`;
    axios.get(endpoint).then((response) => {
      this.setState({
        mappedData: response.data,
      });
    });
  }

  _mapLoaded(mapProps, map) {
    map.setOptions({
      styles: mapStyle,
    });
  }

  render() {
    const { mappedData } = this.state;

    const valueExtent = d3.extent(mappedData, function (d) {
      return +d.n;
    });

    const size = d3.scaleSqrt().domain(valueExtent).range([3, 10]);

    return (
      <div style={{ height: "997px", color: "red" }}>
        <MapView
          containerStyle={containerStyle}
          style={{ height: "997px" }}
          google={this.props.google}
          streetViewControl={false}
          mapTypeControl={false}
          zoom={3}
          initialCenter={{ lat: 55.575459, lng: 2.878064 }}
          onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
        >
          {mappedData?.map((d) => (
            <Marker
              position={{ lat: d.homelat, lng: d.homelon }}
              icon={{
                url: "/circle-icon.svg",
                // anchor: new google.maps.Point(32, 32),
                scaledSize: new google.maps.Size(size(+d.n), size(+d.n)),
              }}
            />
          ))}
        </MapView>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE",
})(Map);
