import { getCountries } from "@/constants";
import React from "react";

function Marker({ projection }) {
  const countries = getCountries();
  var featuresforMarker = countries?.features;

  return (
    <>
      {featuresforMarker?.map(
        (marker, key) =>
              marker.geometry.properties.value > 0 && (
            <a href="/location/test/leaks" key={key}>
                <path 
                key={key}
                className="marker"
                d="
                M 10, 10
                a 2,2 0 1,1 50,0
                a 2,2 0 1,1 -50,0
                "
                transform={
                    "translate(" +
                    projection(marker.geometry.coordinates)[0] +
                    ", " +
                    projection(marker.geometry.coordinates)[1] +
                    ") scale(0.1,0.1)"
                }
                        ></path>
            </a>
          )
      )}
    </>
  );
}

export default Marker;
