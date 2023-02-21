import React from "react";
import * as d3 from "d3";
import Marker from "./Marker";
import { Col, Row } from "antd";

export default function Map() {
  const projection = d3.geoMercator();
  return (
    <>
      <Row>
        <Col className="gutter-row" span={24}>
          <Marker projection={projection} />
          {/* <svg viewBox="0 0 960 500">
            <Paths projection={projection} />
            <Marker projection={projection} />
          </svg> */}
        </Col>
      </Row>
    </>
  );
}
