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

import React, { Component, useState } from "react";
import { Map as MapView, Marker, GoogleApiWrapper } from "google-maps-react";
import * as d3 from "d3";
import axios from "axios";
import { index } from "d3";

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
  _mapLoaded(mapProps, map) {
    map.setOptions({
      styles: mapStyle,
    });
  }

  render() {
    let data = [];
    let isLoadingCountry = false;
    let a;
    const coords = { lat: 32, lng: 53 };

    const valueExtent = d3.extent(data, function (d) {
      return +d.n;
    });

    const size = d3.scaleSqrt().domain(valueExtent).range([1, 10]);

    const locations = data
      .sort(function (a, b) {
        return +b.n - +a.n;
      })
      .filter(function (d, i) {
        return true;
      });

    const countries = async () => {
      try {
        isLoadingCountry = true;
        const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/countries`;
        const response = await axios.get(endpoint);
        if (response && response.status === 200) {
          const payload = response.data;
          data.push(payload);
        }
        isLoadingCountry = false;
      } catch (error) {
        console.log("ERROR while fetching leaks data from API ", error);
        isLoadingCountry = false;
        data.push([]);
      }
    };

    countries();

    return (
      <div style={{ height: "997px" }}>
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
          {/* <Marker position={{ lat: 7, lng: 81 }} /> */}
          <Marker
            position={coords}
            icon={{
              url: "/circle-icon.svg",
              anchor: new google.maps.Point(32, 32),
              scaledSize: new google.maps.Size(20, 20),
              fillColor: "#0000ff",
              fillOpacity: 1,
            }}
          />

          {data[0]?.map((d) => {
            return (
              <Marker
                position={{ lat: d.homelat, lng: d.homelon }}
                icon={{
                  url: "/circle-icon.svg",
                  anchor: new google.maps.Point(32, 32),
                  scaledSize: new google.maps.Size(20, 20),
                }}
              />
            );
          })}
        </MapView>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE",
})(Map);
