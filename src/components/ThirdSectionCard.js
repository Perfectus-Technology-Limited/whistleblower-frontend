import { Avatar, Card, Col, Skeleton } from "antd";
import React from "react";

function ThirdSectionCard() {
  const { Meta } = Card;
  return (
    <Col
      className="gutter-row"
      xxl={6}
      xl={6}
      lg={8}
      md={12}
      sm={24}
      xs={24}
      style={{ background: "RED" }}
      span={4}
    >
      <div className="col-main-div">
        <Card
          style={{
            width: 300,
            marginTop: 16,
          }}
        >
          <Skeleton loading={true} avatar active>
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Skeleton>
        </Card>
      </div>
    </Col>
  );
}

export default ThirdSectionCard;
