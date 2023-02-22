import React from 'react'
import { Row, Col } from 'antd'
import LeakCardWidget from '../Common/LeakCardWiget'

function FeaturedList({ featuredItems }) {
  return (
    <>
      <Row>
        <Col className="gutter-row">
          <h2 style={{ color: "#ffffff" }}>Featured</h2>
        </Col>
      </Row>

      <Row className="gutter-row" justify="space-between">
        {featuredItems?.map((data, index) => (
          <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={index} style={{ marginBottom: '40px' }}>
            <LeakCardWidget data={data} index={index} />
          </Col>
        ))}
      </Row>
    </>

  )
}

export default FeaturedList
