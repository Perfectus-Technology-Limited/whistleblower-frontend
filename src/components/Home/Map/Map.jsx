// import React from "react";
// import * as d3 from "d3";
// import Marker from "./Markers";
// import Paths from "./Paths";

// export default function Map() {
//   const projection = d3.geoMercator();
//   return (
//     <>
//       <svg viewBox="0 0 960 500">
//         <Paths projection={projection} />
//         <Marker projection={projection} />
//       </svg>
//     </>
//   );
// }

import React, { Component } from "react";
import { Map as MapView, Marker, GoogleApiWrapper } from "google-maps-react";
// import Marker as Mark from "./Markers";

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
        color: "#000000",
      },
      {
        lightness: 17,
      },
    ],
  },
];

export class Map extends Component {
  _mapLoaded(mapProps, map) {
    map.setOptions({
      styles: mapStyle,
    });
  }
  render() {
    const coords = { lat: 32, lng: 53 };
    return (
      <div style={{height:"600px"}}>
        <MapView
          style={{ height: "600px"}}
          google={this.props.google}
          zoom={2}
          initialCenter={{ lat: 7, lng: 81 }}
          onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
        >
          {/* <Marker
            position={coords}
            icon={{
              url: "/favicon.ico",
              anchor: new google.maps.Point(32, 32),
              scaledSize: new google.maps.Size(10, 10),
            }}
          /> */}
          <Marker position={{ lat: 7, lng: 81 }} />
        </MapView>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE",
})(Map);
