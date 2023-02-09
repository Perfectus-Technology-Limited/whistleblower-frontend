import React from "react";
import { Avatar, Card, Col, Footer } from "antd";
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import { useRouter } from "next/router";
import IconBxUserCircle from "@/utils/IconBxUserCircle";

const { Meta } = Card;

function PostCard() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/leaks/test");
  };

  return (
    <Col className="gutter-row" xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
      <div className="col-main-div">
        <Card
          onClick={handleClick}
          style={{
            width: 300,
            cursor: "pointer",
          }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
        >
          <div className="avatar-div">
            <Meta
              avatar={
                <Avatar
                  src={
                    <IconBxUserCircle
                      style={{
                        color: "#000000",
                        width: "2.5em",
                        height: "2.5em",
                      }}
                    />
                  }
                />
              }
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="publisher-wallet-address">
                0x5b9141b2258A45B133b61D32112fC9369D95Af24
              </span>
              <span>08/02/2023</span>
            </div>
          </div>
          <Meta
            title="The Intolerance Network"
            description="Today WikiLeaks releases documents pertaining to the Fishrot case that have come to light as a result of investigation into bribes, money laundering and tax evasion."
          />
          <div className="card-entire-footer">
            <div className="card-footer">
              <div className="card-footer-arrows">
                <div
                  style={{
                    paddingRight: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconArrowUpSquareFill />
                  <span style={{ paddingLeft: "5px" }}>55</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconArrowDownSquareFill />
                  <span style={{ paddingLeft: "5px" }}>45</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Col>
  );
}

export default PostCard;
