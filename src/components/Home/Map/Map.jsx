import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
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
  const router=useRouter()
  const [isMapDataLoading, setIUsMapDataLoading] = useState(false);
  const [markerCoordinates, setMarkerCoordinates] = useState([]);

  const valueExtent = d3.extent(markerCoordinates, function (d) {
    return +d.n;
  });

  const size = d3.scaleSqrt().domain(valueExtent).range([3, 15]);

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

  const handleClick = () => {
    router.push('/leaks')
  }

  return (
    <LoadScript googleMapsApiKey="AIzaSyAlSTMjfsA49Sw0bb9lpcpXxon-fsTVKDE">
      <GoogleMap
        mapContainerStyle={{ height: "70vh", width: "100%" }}
        options={mapOptions}
        zoom={3}
        center={{ lat: 21.287934, lng: 37.790933 }}
      >
        {markerCoordinates &&
          markerCoordinates.map((marker, index) => (
            <Marker
              onClick={handleClick}
              options={{
                icon: {
                  url: mapMarker.src,
                  scaledSize: {
                    width: size(+marker.n),
                    height: size(+marker.n),
                  },
                },
              }}
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
            />
          ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
