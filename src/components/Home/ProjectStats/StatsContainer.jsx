import React from 'react'
import { Row, Col } from 'antd'
import StatsWidget from './StatsWidget'

function StatsContainer() {
  return (
    <>
      <Row className="gutter-row" justify="center">
        <Col span={24} className="gutter-row" style={{ display: 'flex', justifyContent: 'center' }}>
          <h2 style={{ color: "#ffffff" }}>Project Stats</h2>
        </Col>
      </Row>
      <Row className="gutter-row" justify="flex-start" gutter={16}>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="Incident Reported" value={243} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="Brave Contributors" value={178} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="Locations" value={88} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="Votes & Counting" value={8932} />
        </Col>
      </Row>
    </>
  )
}

export default StatsContainer
