import { getCountries } from "@/constants";
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Paths from "./Paths";

function Marker({ projection }) {
  const promises = [];
  const [data, setData] = useState([]);
  const paths = new Map();
  const path = d3.geoPath().projection(projection);
  let svgRef = useRef();
  let color;
  let valueExtent;
  let size;
  const files = [
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv",
  ];

  function row(d) {
    paths.set(d.name, +d.population);
  }

  useEffect(() => {
    files.forEach(function (url, index) {
      promises.push(index ? d3.csv(url) : d3.json(url));
    });

    Promise.all(promises).then(function (promise) {
      setData(promise);
    });
  }, []);

  useEffect(() => {
    if (data[1]) {
      var allContinent = d3
        .map(data[1], function (d) {
          return d.homecontinent;
        })
        .keys();
      var color = d3.scaleOrdinal().domain(allContinent).range(d3.schemePaired);

      var valueExtent = d3.extent(data[1], function (d) {
        return +d.n;
      });
      var size = d3
        .scaleSqrt()
        .domain(valueExtent) // What's in the data
        .range([1, 50]);

      d3.select(svgRef.current)
        // svg
        .selectAll("myCircles")
        .data(
          data[1]
            .sort(function (a, b) {
              return +b.n - +a.n;
            })
            .filter(function (d, i) {
              return i < 1000;
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
            // return "red"
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

      // Add legend: circles
      const valuesToShow = [100, 4000, 15000];
      const xCircle = 40;
      const xLabel = 90;
      var svg = d3.select(svgRef.current),
        width = +svg.attr("width"),
          height = +svg.attr("height");
        height =500;
      d3.select(svgRef.current)
        .selectAll("legend")
        .data(valuesToShow)
        .join("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) {
          return height - size(d);
        })
        .attr("r", function (d) {
          return size(d);
        })
        .style("fill", "none")
        .attr("stroke", "white");

      // Add legend: segments
      d3.select(svgRef.current)
        .selectAll("legend")
        .data(valuesToShow)
        .join("line")
        .attr("x1", function (d) {
          return xCircle + size(d);
        })
        .attr("x2", xLabel)
        .attr("y1", function (d) {
          return height - size(d);
        })
        .attr("y2", function (d) {
          return height - size(d);
        })
        .attr("stroke", "white")
        .style("stroke-dasharray", "2,2");

      // Add legend: labels
      d3.select(svgRef.current)
        .selectAll("legend")
        .data(valuesToShow)
        .join("text")
        .attr("x", xLabel)
        .attr("y", function (d) {
          return height - size(d);
        })
        .text(function (d) {
          return d;
        })
        .style("font-size", 10)
        .attr("class", "text-label")
        .attr("alignment-baseline", "middle");
    }

    console.log(data[1]);
  }, [data]);

  return (
    <>
      <svg ref={svgRef} viewBox="0 0 960 500">
        <Paths projection={projection} />

        {/* {data[1]?.map((marker, key) => (
          <a href="/location/test/leaks" key={key}> */}
        {/* <path
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
                ></path> */}
        {/* <circle
              className="marker"
              cx={projection(marker.homelon)}
              cy={projection(marker.homelat)}
              r={"12"}
              stroke={(d) => {
                id.n > 2000 ? "black" : "none";
              }}
              strokeWidth="1"
              fillOpacity="0.2"
              style={{ fill: "red" }}
            ></circle>
          </a>
        ))}
        <circle
          cx="318.80132711084366"
          cy="120.06182136396984"
          r="13.150454714646358"
          stroke="black"
          strokeWidth="1"
          fillOpacity="0.4"
          style={{ fill: "rgb(227, 26, 28)" }}
        ></circle> */}
      </svg>
    </>
  );
}

export default Marker;
