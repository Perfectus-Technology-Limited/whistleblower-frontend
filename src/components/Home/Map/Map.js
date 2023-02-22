import React from "react";
import * as d3 from "d3";
import Marker from "./Markers";
import Paths from "./Paths";

export default function Map() {
  const projection = d3.geoMercator();
  return (
    <>
      <svg viewBox="0 0 960 500">
        <Paths projection={projection} />
        <Marker projection={projection} />
      </svg>
    </>
  );
}
