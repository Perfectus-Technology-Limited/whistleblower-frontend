import { getCountries } from "@/constants";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

function Marker({ projection }) {
  const [data, setData] = useState([]);
  const [isLoadingCountry, setIsLoadingCountry] = useState(false);

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
      setIsLoadingCountry(true);
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/countries`;
      const response = await axios.get(endpoint);
      if (response && response.status === 200) {
        const payload = response.data;
        setData(payload);
      }
      setIsLoadingCountry(false);
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error);
      setIsLoadingCountry(false);
      setData([]);
    }
  };

  useEffect(() => {
    countries();
  }, []);

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
