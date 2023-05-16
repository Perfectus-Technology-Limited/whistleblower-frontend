import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { googleMapStyle } from "./MapStyle";
import axios from "axios";
import mapMarker from "../../../images/map-icons/circle-icon.svg";
import * as d3 from "d3";
import { useRouter } from "next/router";

const mapOptions = {
  streetViewControl: false,
  fullscreenControl: false,
  mapTypeControl: false,
  zoomControl: true,
  styles: googleMapStyle,
};

function Map() {
  const router = useRouter();
  const [isMapDataLoading, setIUsMapDataLoading] = useState(false);
  const [markerCoordinates, setMarkerCoordinates] = useState([]);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const valueExtent = d3.extent(markerCoordinates, function (d) {
    return +d.n;
  });

  // map height depend on window size
  const handleWindowResize = () => {
    setWindowHeight(window.innerHeight);
  };

  window.addEventListener("resize", handleWindowResize);

  const size = d3.scaleSqrt().domain(valueExtent).range([1, 20]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE",
  });

  useEffect(() => {
    countries();
  }, []);

  const countries = async () => {
    try {
      setIUsMapDataLoading(true);
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/countries`;
      const response = await axios.get(endpoint);
      if (response && response.status === 200) {
        const payload = response.data;
        const coordinatePoints = [];
        if (payload && payload.length > 0) {
          payload.map((item) => {
            const markerPoint = {
              lat: item?.homelat,
              lng: item?.homelon,
              n: item.n,
              country: item.homecontinent,
            };
            coordinatePoints.push(markerPoint);
          });
          setMarkerCoordinates(coordinatePoints);
        }
      }
      setIUsMapDataLoading(false);
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error);
      setIUsMapDataLoading(false);
      setMarkerCoordinates([]);
    }
  };

  const handleClick = (country) => {
    router.push(`/leaks/country?name=${country}`);
  };

  return (
    isLoaded && (
      <GoogleMap
        mapContainerStyle={{ height: windowHeight - 81, width: "100%" }}
        options={mapOptions}
        zoom={2.5}
        center={{ lat: 21.287934, lng: 37.790933 }}
      >
        {markerCoordinates &&
          markerCoordinates.map((marker, index) => (
            <Marker
              onClick={() => handleClick(marker.country)}
              options={{
                icon: {
                  url: mapMarker.src,
                  scaledSize: {
                    width: +marker?.n < 15 ? 15 : size(+marker?.n),
                    height: +marker?.n < 15 ? 15 : size(+marker?.n),
                  },
                },
              }}
              key={index}
              position={{ lat: marker?.lat, lng: marker?.lng }}
            />
          ))}
      </GoogleMap>
    )
  );
}

export default Map;
