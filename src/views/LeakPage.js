import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, Spin } from 'antd';
import SearchBar from '@/components/Leaks/SearchBar';
import { leaksList } from '@/constants/mockData';
import LeakCardWidget from '@/components/Common/LeakCardWiget';
import axios from 'axios'

function LeakPage() {

  const [searchKey, setSearchKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(16)
  const [leakList, setLeakList] = useState([])
  const [isLeakListLoading, setIsLeakListLoading] = useState(false)

  useEffect(() => {
    fetchLeaks()
  }, [pageSize, currentPage, searchKey])

  const fetchLeaks = async () => {
    try {
      setIsLeakListLoading(true)
      const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/all?page=${currentPage}&limit=${pageSize}&search=${searchKey}`
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
      <Row justify="center" style={{ margin: "50px 0px" }}>
        <Col span={24}>
          <div className="search-input">
            <SearchBar setSearchKey={setSearchKey} />
          </div>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          {/* add category list here */}
        </Col>
      </Row>

      <Row className="gutter-row" justify="start">
        {
          isLeakListLoading ? (
            <div className='d-flex justify-content-center'>
              <Spin />
            </div>
          ) : (
            leakList?.map((data, index) => (
              <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={index} style={{ marginBottom: '40px' }}>
                <LeakCardWidget data={data} index={index} />
              </Col>
            ))
          )
        }

      </Row>

      <Row className="gutter-row" justify="center">
        <Col span={24}>
          <Pagination
            onChange={(_currentPage) => setCurrentPage(_currentPage)}
            onShowSizeChange={(_pageSize) => setPageSize(_pageSize)}
            total={leakList?.length}
            showSizeChanger
            showQuickJumper
            showTotal={(total) => `Total ${total} items`}
            style={{
              color: "#fff",
              background: "none",
              fontWeight: "bold",
              margin: "0 0 0 auto",
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default LeakPage
