import React, { useEffect, useState } from 'react'
import { Row, Col, Spin } from 'antd'
import LeakCardWidget from '../Common/LeakCardWiget'
import axios from 'axios'
function RecentList() {

  const [leakList, setLeakList] = useState([])
  const [isLeakListLoading, setIsLeakListLoading] = useState(false)
  useEffect(() => {
    fetchLeaks()
  }, [])

  const fetchLeaks = async () => {
    try {
      setIsLeakListLoading(true)
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/all?page=1&limit=8`
      const response = await axios.get(endpoint)
      if (response && response.status === 200) {
        const payload = response.data
        const itemList = payload?.payload?.items
        setLeakList(itemList)
      }
      setIsLeakListLoading(false)
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error)
      setIsLeakListLoading(false)
      setLeakList([])
    }
  }

  return (
    <>
      <Row style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Col className="gutter-row">
          <h2 style={{ color: "#ffffff" }}>Recently Added</h2>
        </Col>
      </Row>

      <Row className="gutter-row" justify="start">
        {
          isLeakListLoading ? (
            <div className='d-flex justify-content-center'>
              <Spin />
            </div>
          ) : (
            leakList && leakList.length > 0 ? (
              leakList?.map((data, index) => (
                <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={index} style={{ marginBottom: '40px' }}>
                  <LeakCardWidget data={data} index={index} />
                </Col>
              ))
            ) : (
              <div className='d-flex justify-content-center'>
                <h3 style={{ color: "#ffffff" }}>No leaks found</h3>
              </div>
            )

          )
        }
      </Row>
    </>

  )
}

export default RecentList
