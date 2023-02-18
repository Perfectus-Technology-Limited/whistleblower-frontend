import Head from "next/head";
import { Avatar, Card, Col, Divider, Row, Skeleton } from "antd";
import PostCard from "@/components/PostCard";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

const style = {
  background: "#0092ff",
  padding: "8px 0",
};

export default function Home() {
  const { Meta } = Card;

  const svgRef = useRef();

  useEffect(() => {
    let width = 600;
    let height = 350;
    const margin = { top: 20, right: 30, bottom: 65, left: 90 };
    const xAxisLabelOffset = 50;
    const yAxisLabelOffset = 45;

    const svg = d3
      .select(svgRef.current)
      .style("marginLeft", "90")
      .style("marginRight", "auto")
      .style("width", "100%")
      .style("height", "700px");

    // var projection = d3
    //   .geoMercator()
    //   .center([6, 20]) // GPS of location to zoom on
    //   .scale(99) // This is like the zoom
    //   .translate([width, height]);

    var projection = d3
      .geoNaturalEarth1()
      .scale(width / 2.5)
      .translate([width, height]);

    // var projection = d3
    // .scale(width / 1.3 / Math.PI)
    // .translate([width / 2, height / 2])

    const files = [
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_gpsLocSurfer.csv",
    ];

    const popByName = new Map();
    function row(d) {
      popByName.set(d.name, +d.population);
    }

    const promises = [];

    files.forEach(function (url, index) {
      promises.push(index ? d3.csv(url, row) : d3.json(url));
    });

    Promise.all(promises).then(function (data) {
      console.log(data); //check if all data was loaded
      //any code that depends on 'data' goes here
      ready("", data[0], data[1]);
    });

    function ready(error, dataGeo, data) {
      // Create a color scale
      var allContinent = d3
        .map(data, function (d) {
          return d.homecontinent;
        })
        .keys();
      var color = d3.scaleOrdinal().domain(allContinent).range(d3.schemePaired);

      // Add a scale for bubble size
      var valueExtent = d3.extent(data, function (d) {
        return +d.n;
      });
      var size = d3
        .scaleSqrt()
        .domain(valueExtent) // What's in the data
        .range([0, 1]); // Size in pixel

      // Draw the map
      svg
        .append("g")
        .selectAll("path")
        .data(dataGeo.features)
        .enter()
        .append("path")
        .attr("fill", "#74ec67")
        // .style("color", "white")
        // .attr("class","path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("width", "100%")
        .style("stroke", "white")
        .style("opacity", "none");

      // Add circles:
      svg
        .selectAll("myCircles")
        .data(
          data
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
          return color(d.homecontinent);
        })
        .attr("stroke", function (d) {
          if (d.n > 2000) {
            return "black";
          } else {
            return "none";
          }
        })
        .attr("stroke-width", 1)
        .style("color", "white")
        .style("background", "white")
        .attr("fill-opacity", 0.4);

      // Add title and explanation
      svg
        .append("text")
        .attr("text-anchor", "end")
        .style("fill", "black")
        .attr("x", width - 10)
        .attr("y", height - 30)
        .attr("width", 90)
        .style("color", "white")
        .style("background", "white")
        .html("WHERE SURFERS LIVE")
        .style("font-size", 14);

      // --------------- //
      // ADD LEGEND //
      // --------------- //

      // Add legend: circles
      var valuesToShow = [100, 4000, 15000];
      var xCircle = 40;
      var xLabel = 90;
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .style("color", "white")
        .style("background", "white")
        .attr("cx", xCircle)
        // .attr("cy", function (d) {
        //   return height - size(d);
        // })
        // .attr("r", function (d) {
        //   return size(d);
        // })
        .style("fill", "none")
        .attr("stroke", "black");

      // Add legend: segments
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .style("color", "white")
        .style("background", "white")
        // .attr("x1", function (d) {
        //   return xCircle + size(d);
        // })
        .attr("x2", xLabel)
        // .attr("y1", function (d) {
        //   return height - size(d);
        // })
        // .attr("y2", function (d) {
        //   return height - size(d);
        // })
        .attr("stroke", "black")
        .style("stroke-dasharray", "2,2");

      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr("x", xLabel)
        .style("color", "white")
        .style("background", "white")
        // .attr("y", function (d) {
        //   return height - size(d);
        // })
        .text(function (d) {
          return d;
        })
        .style("font-size", 10)
        .attr("alignment-baseline", "middle");

      // pin section
      var countries = getCountries();
      var features = countries.features;

      var values = features.map(function (d) {
        return [
          +d.geometry.properties.value,
          d.geometry.properties.countryCode,
        ];
      });

      for (var j = 0; j < features.length; j++) {
        // check if has value and draw line
        if (features[j].geometry.properties.value > 0) {
          var v = features[j].geometry.properties.value;
          // var vSize = d3.scale.linear().domain([0, 25]).range([0.5, 8]);
          // var vOp = d3.scale.linear().domain([0, 25]).range([0.25, 0.75]);

          // Random colour
          var randColour = ["#765", "#987"][Math.floor(Math.random() * 2)];

          var x = projection(features[j].geometry.coordinates)[0],
            y = projection(features[j].geometry.coordinates)[1];

          var marker = svg
            .append("svg:path")
            .attr("class", "marker")
            .attr(
              "d",
              "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z"
            )
            .attr("transform", "translate(" + x + "," + y + ") scale(0)")
            .transition()
            .delay(400)
            .attr("fill", "red")
            .duration(800)
            // .ease("elastic")
            .attr("transform", "translate(" + x + "," + y + ") scale(.75)");
          //.on('mouseover', function(d){})
          var cc = features[j].geometry.properties.countryCode;

          svg
            .append("svg:text")
            .attr("x", x)
            .attr("fill", "#fff")
            .attr("y", y)
            .attr("dx", ".5em")
            .attr("dy", ".35em")
            .text(cc)
            .attr("class", "cc");
        }

        /*
          marker.selectAll("path")
            .on("click", function(d) {
              d3.select(this)
                .transition()
                .duration(200)
                .ease("elastic")
                .attr("transform", "translate(" + d.x + "," + d.y + ") scale(2)");
            });
          */
      }
    }
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div>
          <Row>
            <Col
              className="gutter-row"
              span={24}
              style={{ textAlign: "center", height: "700px" }}
            >
              <div style={{ color: "#ffffff" }}>
                <svg ref={svgRef} id="my_dataviz"></svg>
              </div>
            </Col>
          </Row>
          <Divider style={{ background: "white" }} />
          <Row>
            <Row>
              <Col className="gutter-row">
                <h2 style={{ color: "#ffffff" }}>Featured</h2>
              </Col>
            </Row>
            <Row justify="space-between">
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
            </Row>
          </Row>

          <Row className="gutter-row" justify="space-between">
            <Col span={24} className="gutter-row">
              <h2 style={{ color: "#ffffff" }}>Third Section</h2>
            </Col>
            <Col
              className="gutter-row"
              xxl={6}
              xl={6}
              lg={8}
              md={12}
              sm={24}
              xs={24}
              style={{ background: "RED" }}
              span={4}
            >
              <div className="col-main-div">
                <Card
                  style={{
                    width: 300,
                    marginTop: 16,
                  }}
                >
                  <Skeleton loading={true} avatar active>
                    <Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title="Card title"
                      description="This is the description"
                    />
                  </Skeleton>
                </Card>
              </div>
            </Col>
            <Col
              className="gutter-row"
              xxl={6}
              xl={6}
              lg={8}
              md={12}
              sm={24}
              xs={24}
              style={{ background: "RED" }}
              span={4}
            >
              <div className="col-main-div">
                <Card
                  style={{
                    width: 300,
                    marginTop: 16,
                  }}
                >
                  <Skeleton loading={true} avatar active>
                    <Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title="Card title"
                      description="This is the description"
                    />
                  </Skeleton>
                </Card>
              </div>
            </Col>
            <Col
              className="gutter-row"
              xxl={6}
              xl={6}
              lg={8}
              md={12}
              sm={24}
              xs={24}
              style={{ background: "RED" }}
              span={4}
            >
              <div className="col-main-div">
                <Card
                  style={{
                    width: 300,
                    marginTop: 16,
                  }}
                >
                  <Skeleton loading={true} avatar active>
                    <Meta
                      avatar={
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                      }
                      title="Card title"
                      description="This is the description"
                    />
                  </Skeleton>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </main>
    </>
  );
}

function getCountries() {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "1",
        geometry: {
          type: "Point",
          coordinates: ["55.30472", "25.25817"],
          properties: {
            name: "United Arab Emirates",
            countryCode: "AE",
            value: "1.19",
          },
        },
      },
      {
        type: "Feature",
        id: "8",
        geometry: {
          type: "Point",
          coordinates: ["-65", "-35"],
          properties: {
            name: "Argentina",
            countryCode: "AR",
            value: "0.03",
          },
        },
      },
      {
        type: "Feature",
        id: "12",
        geometry: {
          type: "Point",
          coordinates: ["134.0", "-25.0"],
          properties: {
            name: "Australia",
            countryCode: "AU",
            value: "10.64",
          },
        },
      },
      {
        type: "Feature",
        id: "30",
        geometry: {
          type: "Point",
          coordinates: ["-52", "-10"],
          properties: {
            name: "Brazil",
            countryCode: "BR",
            value: "0.20",
          },
        },
      },
      {
        type: "Feature",
        id: "37",
        geometry: {
          type: "Point",
          coordinates: ["-112.0", "60.0"],
          properties: {
            name: "Canada",
            countryCode: "CA",
            value: "4.17",
          },
        },
      },
      {
        type: "Feature",
        id: "47",
        geometry: {
          type: "Point",
          coordinates: ["103.7", "34.7"],
          properties: {
            name: "China",
            countryCode: "CN",
            value: "2.59",
          },
        },
      },
      {
        type: "Feature",
        id: "50",
        geometry: {
          type: "Point",
          coordinates: ["-82.38304", "23.13302"],
          properties: {
            name: "Cuba",
            countryCode: "CU",
            value: "0",
          },
        },
      },
      {
        type: "Feature",
        id: "56",
        geometry: {
          type: "Point",
          coordinates: ["10.0", "51.0"],
          properties: {
            name: "Germany",
            countryCode: "DE",
            value: "4.57",
          },
        },
      },
      {
        type: "Feature",
        id: "67",
        geometry: {
          type: "Point",
          coordinates: ["-3.70256", "40.4165"],
          properties: {
            name: "Spain",
            countryCode: "ES",
            value: "2.95",
          },
        },
      },
      {
        type: "Feature",
        id: "74",
        geometry: {
          type: "Point",
          coordinates: ["2.5", "46.5"],
          properties: {
            name: "France",
            countryCode: "FR",
            value: "4.37",
          },
        },
      },
      {
        type: "Feature",
        id: "88",
        geometry: {
          type: "Point",
          coordinates: ["23.71622", "37.97945"],
          properties: {
            name: "Greece",
            countryCode: "GR",
            value: "0.68",
          },
        },
      },
      {
        type: "Feature",
        id: "104",
        geometry: {
          type: "Point",
          coordinates: ["79", "23"],
          properties: {
            name: "India",
            countryCode: "IN",
            value: "1.20",
          },
        },
      },
      {
        type: "Feature",
        id: "108",
        geometry: {
          type: "Point",
          coordinates: ["-18", "65"],
          properties: {
            name: "Iceland",
            countryCode: "IS",
            value: "0.13",
          },
        },
      },
      {
        type: "Feature",
        id: "114",
        geometry: {
          type: "Point",
          coordinates: ["36.8166667", "-1.2833333"],
          properties: {
            name: "Kenya",
            countryCode: "KE",
            value: "0.14",
          },
        },
      },
      {
        type: "Feature",
        id: "173",
        geometry: {
          type: "Point",
          coordinates: ["-76", "-10"],
          properties: {
            name: "Peru",
            countryCode: "PE",
            value: "0.06",
          },
        },
      },
      {
        type: "Feature",
        id: "196",
        geometry: {
          type: "Point",
          coordinates: ["17", "64"],
          properties: {
            name: "Sweden",
            countryCode: "SE",
            value: "1.24",
          },
        },
      },
      {
        type: "Feature",
        id: "217",
        geometry: {
          type: "Point",
          coordinates: ["100.50144", "13.75398"],
          properties: {
            name: "Thailand",
            countryCode: "TH",
            value: "0.62",
          },
        },
      },
      {
        type: "Feature",
        id: "224",
        geometry: {
          type: "Point",
          coordinates: ["32.8542709350586", "39.9198743755027"],
          properties: {
            name: "Turkey",
            countryCode: "TR",
            value: "0.30",
          },
        },
      },
      {
        type: "Feature",
        id: "233",
        geometry: {
          type: "Point",
          coordinates: ["-100.7", "40.1"],
          properties: {
            name: "United States",
            countryCode: "US",
            value: "28.77",
          },
        },
      },
      {
        type: "Feature",
        id: "240",
        geometry: {
          type: "Point",
          coordinates: ["106.62965", "10.82302"],
          properties: {
            name: "Vietnam",
            countryCode: "VN",
            value: "0.10",
          },
        },
      },
      {
        type: "Feature",
        id: "247",
        geometry: {
          type: "Point",
          coordinates: ["24", "-31"],
          properties: {
            name: "South Africa",
            countryCode: "ZA",
            value: "1.84",
          },
        },
      },
    ],
  };
}
