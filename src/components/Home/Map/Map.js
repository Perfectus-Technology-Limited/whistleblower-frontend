import React from "react";
import * as d3 from "d3";
import Marker from "./Markers";

export default function Map() {
  const projection = d3.geoMercator();
  return (
    <>
      <Marker projection={projection} />
    </>
  );
}
