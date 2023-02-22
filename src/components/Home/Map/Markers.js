import { getCountries } from "@/constants";
import React, { useState } from "react";
import * as d3 from "d3";

function Marker({ projection }) {
  const [data, setData] = useState(getCountries());

  const valueExtent = d3.extent(data, function (d) {
    return +d.n;
  });

  const size = d3.scaleSqrt().domain(valueExtent).range([1, 50]);

  const locations = data
    .sort(function (a, b) {
      return +b.n - +a.n;
    })
    .filter(function (d, i) {
      return i < 1000 && i > 10;
    });

  return (
    <>
      {locations.map((d, index) => (
        <circle
          key={index}
          cx={projection([+d.homelon, +d.homelat])[0]}
          cy={projection([+d.homelon, +d.homelat])[1]}
          r={size(+d.n)}
          stroke={d.n > 2000 ? "white" : "none"}
          strokeWidth="1"
          fillOpacity="0.4"
          style={{ fill: "red" }}
        ></circle>
      ))}
    </>
  );
}

export default Marker;
