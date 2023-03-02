import React, { useEffect, useState } from 'react'
import { Row, Col, Pagination, Spin } from 'antd';
import SearchBar from '@/components/Leaks/SearchBar';
import LeakCardWidget from '@/components/Common/LeakCardWiget';
import axios from 'axios'

function LeakPage() {

  const [searchKey, setSearchKey] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [leakList, setLeakList] = useState([])
  const [totalItemCount, setTotalItemCount] = useState(0)
  const [isLeakListLoading, setIsLeakListLoading] = useState(false)

  const pageSizeOptions = [8, 16, 24, 32, 40, 48, 56]
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
        // console.log(payload)
        const itemList = payload?.payload?.items
        setLeakList(itemList)
        setTotalItemCount(payload?.payload?.meta?.totalItems)
      }
      setIsLeakListLoading(false)
    } catch (error) {
      console.log("ERROR while fetching leaks data from API ", error)
      setIsLeakListLoading(false)
      setLeakList([])
    }
  }

  const handlePageChange = (_currentPage, _pageSize) => {
    if (_pageSize) {
      setPageSize(_pageSize)
    }

    if (_currentPage) {
      setCurrentPage(_currentPage)
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
            <div className='d-flex justify-content center'>
              <Spin size='large' />
            </div>
          ) : (

            leakList && leakList.length > 0 ? (
              leakList?.map((data, index) => (
                <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={index} style={{ marginBottom: '40px' }}>
                  <LeakCardWidget data={data} index={index} />
                </Col>
              ))
            ) : (
              <div className='d-flex justify-center'>
                <h3 style={{ color: "#ffffff" }}>No leaks found</h3>
              </div>
            )
          )
        }

      </Row>

      <Row className="gutter-row" justify="center">
        <Col span={24}>
          <Pagination
            onChange={handlePageChange}
            total={totalItemCount}
            showSizeChanger
            defaultPageSize={8}
            showQuickJumper
            pageSizeOptions={pageSizeOptions}
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
