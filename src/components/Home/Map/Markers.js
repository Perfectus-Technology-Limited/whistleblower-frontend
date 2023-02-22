import { getCountries } from "@/constants";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Paths from "./Paths";

function Marker({ projection }) {
  const [data, setData] = useState([]);
  let svgRef = useRef();

  useEffect(() => {
    setData(getCountries());
  }, []);

  useEffect(() => {
    if (data) {
      var allContinent = d3
        .map(data, function (d) {
          return d.homecontinent;
        })
        .keys();
      var color = d3.scaleOrdinal().domain(allContinent).range(d3.schemePaired);

      var valueExtent = d3.extent(data, function (d) {
        return +d.n;
      });
      var size = d3
        .scaleSqrt()
        .domain(valueExtent) // What's in the data
        .range([1, 50]);

      d3.select(svgRef.current)
        .selectAll("myCircles")
        .data(
          data
            .sort(function (a, b) {
              return +b.n - +a.n;
            })
            .filter(function (d, i) {
              return i < 1000 && i > 10;
            })
        )
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return projection([+d.homelon, +d.homelat])[0];
        })
        .attr("cy", function (d) {
          return projection([+d.homelon, +d.homelat])[1];
        })
        .attr("r", function (d) {
          return size(+d.n);
        })
        .style("fill", function (d) {
          return "red";
          return color(d.homecontinent);
        })
        .attr("stroke", function (d) {
          if (d.n > 2000) {
            return "white";
          } else {
            return "none";
          }
        })
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.4);
    }

    console.log(data);
  }, [data]);

  return (
    <>
      <svg ref={svgRef} viewBox="0 0 960 500">
        <Paths projection={projection} />
      </svg>
    </>
  );
}

export default Marker;
