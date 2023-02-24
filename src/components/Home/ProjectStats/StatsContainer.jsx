import React from 'react'
import { Row, Col } from 'antd'
import StatsWidget from './StatsWidget'
import * as checkMarkAnimation from '../../../animations/checkMark.json'
import * as voteAnimation from '../../../animations/vote.json'
import * as locationAnimation from '../../../animations/location.json'
import * as contributorsAnimation from '../../../animations/contributors.json'

function StatsContainer() {
  return (
    <>
      <Row className="gutter-row" justify="flex=start">
        <Col span={24} className="gutter-row">
          <h2 style={{ color: "#ffffff" }}>Project Stats</h2>
        </Col>
      </Row>
      <Row className="gutter-row" justify="flex-start" gutter={16}>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="234 Incident Reported" animation={checkMarkAnimation} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="189 Brave Contributors" animation={contributorsAnimation} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="88 Locations " animation={locationAnimation} />
        </Col>
        <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
          <StatsWidget title="8970 Votes " animation={voteAnimation} />
        </Col>
      </Row>
    </>
  )
}

export default StatsContainer
