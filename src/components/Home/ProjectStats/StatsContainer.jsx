import React, { useEffect, useState } from "react";
import { Row, Col, Space } from "antd";
import StatsWidget from "./StatsWidget";
import axios from "axios";

function StatsContainer() {
  const [isLoading, setIsLoading] = useState(false);
  const [incidentReportCount, setIncidentReportCount] = useState(0);
  const [braveContributorsCount, setBraveContributorsCount] = useState(0);
  const [locationsCount, setLocationsCount] = useState(0);
  const [signersCount, setSignersCount] = useState(0);

  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/country-count`;
      const response = await axios.get(endpoint);
      if (response && response.status === 200) {
        const payload = response.data.payload;
        console.log(payload);
        setIncidentReportCount(payload.incidentReportCount);
        setBraveContributorsCount(payload.braveContributorsCount);
        setLocationsCount(payload.locationsCount);
        setSignersCount(payload.signersCount);
      }
      setIsLoading(false);
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <>
      <Row className="gutter-row" justify="center">
        <Col
          span={24}
          className="gutter-row"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <h2 style={{ color: "#ffffff" }}>Project Stats</h2>
        </Col>
      </Row>
      <Row className="gutter-row" justify="flex-start" gutter={16}>
        <Col
          style={{ marginTop: "10px" }}
          xxl={6}
          xl={6}
          lg={8}
          md={12}
          sm={24}
          xs={24}
        >
          <StatsWidget
            title="Incident Reported"
            value={incidentReportCount}
            isLoading={isLoading}
          />
        </Col>
        <Col
          style={{ marginTop: "10px" }}
          xxl={6}
          xl={6}
          lg={8}
          md={12}
          sm={24}
          xs={24}
        >
          <StatsWidget
            isLoading={isLoading}
            title="Brave Contributors"
            value={braveContributorsCount}
          />
        </Col>
        <Col
          style={{ marginTop: "10px" }}
          xxl={6}
          xl={6}
          lg={8}
          md={12}
          sm={24}
          xs={24}
        >
          <StatsWidget
            title="Locations"
            value={locationsCount}
            isLoading={isLoading}
          />
        </Col>
        <Col
          style={{ marginTop: "10px" }}
          xxl={6}
          xl={6}
          lg={8}
          md={12}
          sm={24}
          xs={24}
        >
          <StatsWidget
            title="Votes & Counting"
            value={signersCount}
            isLoading={isLoading}
          />
        </Col>
      </Row>
    </>
  );
}

export default StatsContainer;
