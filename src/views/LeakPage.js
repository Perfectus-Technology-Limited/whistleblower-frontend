import React, { useState } from 'react'
import { Row, Col, Pagination } from 'antd';
import SearchBar from '@/components/Leaks/SearchBar';
import { leaksList } from '@/constants/mockData';
import LeakCardWidget from '@/components/Common/LeakCardWiget';

function LeakPage() {
  const [searchKey, setSearchKey] = useState('')
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

      <Row className="gutter-row" justify="center">
        {leaksList?.map((data, index) => (
          <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={index} style={{ marginBottom: '40px' }}>
            <LeakCardWidget data={data} index={index} />
          </Col>
        ))}
      </Row>

      <Row className="gutter-row" justify="center">
        <Col span={24}>
          <Pagination
            total={85}
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
