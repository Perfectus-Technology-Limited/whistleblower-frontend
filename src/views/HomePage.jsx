import React, { useState, useEffect } from 'react'
import { leaksList } from '@/constants/mockData'
import Map from '@/components/Home/Map/Map'
import FeaturedList from '@/components/Home/FeaturedList'
import { Row, Col } from 'antd'
import StatsContainer from '@/components/Home/ProjectStats/StatsContainer'

function HomePage() {

  const [featuredList, setFeaturedList] = useState([])

  useEffect(() => {
    if (leaksList && leaksList.length > 0) {
      //get the first 8 items from the array
      const featuredListFormatted = leaksList.slice(0, 8)
      setFeaturedList(featuredListFormatted)
    }
  }, [])

  return (
    <main className="container">
      <Row>
        <Col span={24} className="gutter-row">
          <h2 style={{ color: "#74ec67", fontFamily: "sans-serif" }}>
            Whistleblowers unite! Your voice can change the world!
          </h2>
        </Col>
      </Row>

      <Row>
        <Col className="gutter-row" span={24}>
          <Map />
        </Col>
      </Row>

      <FeaturedList featuredItems={featuredList} />

      <StatsContainer />
    </main>
  )
}

export default HomePage
