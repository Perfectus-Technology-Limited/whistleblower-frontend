import PostCard from "@/components/PostCard";
import { Col, Row, Input } from "antd";
import React from "react";

const { Search } = Input;

function Leaks() {
  const onSearch = (value) => console.log(value);

  return (
    <div>
      <Row justify="center" style={{ margin: "20px 0px" }}>
        <Col xl={12} lg={12} md={18} sm={16} xs={24}>
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
      <Row>
        <PostCard />
      </Row>
    </div>
  );
}

export default Leaks;
