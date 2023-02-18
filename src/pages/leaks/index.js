import PostCard from "@/components/PostCard";
import { Col, Row, Input, Tabs, Radio, Pagination } from "antd";
import React from "react";
import { useState } from "react";

const { Search } = Input;

function Leaks() {
  const onSearch = (value) => console.log(value);
  const [mode, setMode] = useState("top");

  return (
    <div className="container">
      <Row justify="center" style={{ margin: "20px 0px" }}>
        <Col span={24}>
          <div className="search-input">
            <Search
              placeholder="Search Keywords ..."
              onSearch={onSearch}
              enterButton
              size="large"
            />
          </div>
        </Col>
      </Row>
      <div>
        <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
          // style={{
          //   height: 220,
          // }}
          items={new Array(30).fill(null).map((_, i) => {
            const id = String(i);
            return {
              label: `Tab-${id}`,
              key: id,
              // disabled: i === 28,
              // children: `Content of tab ${id}`,
            };
          })}
        />
      </div>
      <Row justify="space-between">
        <Row>
          <Col className="gutter-row">
            <h2 style={{ color: "#ffffff" }}>Leaks</h2>
          </Col>
        </Row>
        <Row>
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </Row>
        <Row
          style={{
            width: "100%",
            marginTop: "30px",
          }}
        >
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
        </Row>
      </Row>
    </div>
  );
}

export default Leaks;
