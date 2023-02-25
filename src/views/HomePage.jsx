import React from 'react'
import Map from '@/components/Home/Map/Map'
import FeaturedList from '@/components/Home/FeaturedList'
import { Row, Col } from 'antd'
import StatsContainer from '@/components/Home/ProjectStats/StatsContainer'
import RecentList from '@/components/Home/RecentList'

function HomePage() {

  return (
    <main className="container">
      <Row>
        <Col span={24} className="gutter-row">

          <div className="container-glitch">
            <div className="glitch"> Whistleblowers unite! Your voice can change the world!</div>
            <div className="glow">Whistleblowers unite! Your voice can change the world!</div>
          </div>
          <div className="scanlines"></div>
        </Col>
      </Row>

      <Row className='map-full-width'>
        <Col className="gutter-row" span={24}>
          <Map />
        </Col>
      </Row>

      <FeaturedList />

      <StatsContainer />

      <RecentList />

    </main>
  )
}

export default HomePage
