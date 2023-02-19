import React, { useEffect, useState } from "react";
import * as d3 from "d3";

function Paths({ projection }) {
  const promises = [];
  const [data, setData] = useState([]);
  const paths = new Map();
  const path = d3.geoPath().projection(projection);
  const files = [
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv",
  ];

  function row(d) {
    paths.set(d.name, +d.population);
  }

  useEffect(() => {
    promises.push(d3.json(files[0]));

    Promise.all(promises).then(function (promise) {
      setData(promise);
    });

    console.log(data);
  }, []);

  useEffect(() => {
    // console.log(d3.json(url));
  }, [data]);

  if (!data) {
    return <>dfgbfg</>;
  }

  return (
    <>
      <g className="marks" span={24}>
        {/* <path span={24} className="sphere" d={path({ type: "Sphere" })} /> */}
        {data[0]?.features.map((feature, i) => (
          <path className="feature" key={i} d={path(feature)} />
        ))}
      </g>
    </>
  );
}

export default Paths;
