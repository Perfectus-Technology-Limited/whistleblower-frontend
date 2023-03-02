import React, { useEffect, useState } from "react";
import { fetchDataFromIPFSCID } from "@/services/ipfs.service";
import { Avatar, Card, Col, Row, Space, Spin } from "antd";
import LeakHeader from "@/components/LeaksDetails/LeakHeader";
import LeakDescription from "@/components/LeaksDetails/LeakDescription";
import AuthorDetails from "@/components/LeaksDetails/AuthorDetails";
import LeakFilesSection from "@/components/LeaksDetails/LeakFilesSection";
// import VoteCastWidget from "@/components/LeaksDetails/VoteCastWidget";
import Contribute from "@/components/LeaksDetails/Contribute";
import { UserOutlined } from "@ant-design/icons";
import { useContractRead } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import { shortenEthAddress, truncateText } from "@/utils/helpers";

const styles = {
  pageContainer: {
    marginTop: "100px",
  },
  postDescription: {
    fontSize: "15px",
    color: "#ffffff",
    marginTop: "20px",
    whiteSpace: "pre-line",
  },
  submitBy: {
    padding: "10px 20px",
    fontSize: "15px",
    fontWeight: "800",
    color: "#ffffff",
  },
};

function LeakDetailsPage({ ipfsCID }) {
  const [isLeaksDataLoading, setIsLeaksDataLoading] = useState(false);
  const [leakData, setLeakData] = useState(null);
  let commentsWithUser = [];

  const { data: comments, isLoading: commentsLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "getAllComments",
    args: [ipfsCID],
    // enabled: !!ipfsCID,
    // watch: true,
  });

  const { data: commentedUsers, isLoading: commentedUserLoading } =
    useContractRead({
      address: whistleblowerConfig?.contractAddress,
      abi: whistleblowerConfig?.contractAbi,
      functionName: "getAllCommentedUsers",
      args: [ipfsCID],
      // enabled: !!ipfsCID,
      // watch: true,
    });

  for (let i = 0; i < comments?.length; i++) {
    commentsWithUser.push({
      user: commentedUsers[0],
      comment: comments[0],
    });
  }

  console.log(leakData);

  useEffect(() => {
    if (ipfsCID) {
      fetchDataFromIPFS();
    }
  }, [ipfsCID]);

  const fetchDataFromIPFS = async () => {
    setIsLeaksDataLoading(true);
    const dataResponse = await fetchDataFromIPFSCID(ipfsCID);
    setLeakData(dataResponse);
    setIsLeaksDataLoading(false);
  };

  return (
    <div className="leak-details-container" style={styles.pageContainer}>
      <Row gutter={16}>
        {isLeaksDataLoading ? (
          <div className="d-flex justify-content center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <Col sx={24} md={24} lg={16}>
              <LeakHeader
                title={leakData?.title}
                date={leakData?.date}
                coverImageCID={leakData?.coverImage}
              />

              <LeakDescription description={leakData?.description} />

              {/* TODO: we might meed to add like latest votes address and status or comments */}
            </Col>
            <Col lg={1}></Col>

            <Col sx={24} md={24} lg={7}>
              <AuthorDetails
                address={leakData?.account}
                date={leakData?.date}
              />

              <Contribute leakCID={ipfsCID} />
              <div className="voting-container"></div>

              <LeakFilesSection files={leakData?.uploadedFiles} />
            </Col>
          </>
        )}
      </Row>
      <Row
        style={{ marginTop: "40px", display: "flex", flexDirection: "column" }}
      >
        <div style={{ color: "white", fontSize: "20px", fontWeight: "400" }}>
          Comments
        </div>
        {commentsWithUser.map((comment) => (
          <Col sx={24} md={24} lg={16}>
            <Card
              style={{
                padding: "0 10px 20px 10px",
                marginTop: "30px",
                background: "none",
                border: "1px solid #134c04",
                color: "white",
              }}
              sx={24} md={24} lg={16}
            >
              <Space direction="vertical" size={16}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <Space size={16}>
                    <span>
                      <Avatar
                        size={"large"}
                        icon={<Jazzicon
                          diameter={35}
                          seed={jsNumberForAddress(
                            comment.user ? comment.user.toString() : ""
                          )}
                        />}
                        style={{ color: "white", background: "#888" }}
                      />
                    </span>
                    <span >{shortenEthAddress(comment.user, 8)}</span>
                  </Space>
                </div>
                <div>
                  <span style={{ color: "#aaa" }}>{comment.comment}</span>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
        {/* 
        <Col sx={24} md={24} lg={16}>
          <Card
            style={{
              padding: "0 10px 20px 10px",
              marginTop: "30px",
              background: "none",
              border: "1px solid #134c04",
              color: "white",
            }}
          >
            <Space direction="vertical" size={16}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <Space size={16}>
                  <span>
                    <Avatar
                      size={"large"}
                      icon={<UserOutlined />}
                      style={{ color: "white", background: "#888" }}
                    />
                  </span>
                  <span>0x1dAe7a8F39F831320DC8B6e436dd687f421B8EF0</span>
                </Space>
              </div>
              <div>
                <span style={{ color: "#aaa" }}>
                  sdf sdfsdfg sdfgsdfg sdfgsdfg sdrgsdfg sdfgsdfg sdfgsdfg
                  sdfgsdfg sdfgsdfg safgsdfg sdfgsdfg sdfgsdfg sdfgsdfg sdfgsdfg
                  sdfgsdfg sdfgsdfg
                </span>
              </div>
            </Space>
          </Card>
        </Col>

        <Col sx={24} md={24} lg={16}>
          <Card
            style={{
              padding: "0 10px 20px 10px",
              marginTop: "30px",
              background: "none",
              border: "1px solid #134c04",
              color: "white",
            }}
          >
            <Space direction="vertical" size={16}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <Space size={16}>
                  <span>
                    <Avatar
                      size={"large"}
                      icon={<UserOutlined />}
                      style={{ color: "white", background: "#888" }}
                    />
                  </span>
                  <span style={{ overflow: "hidden" }}>
                    0x1dAe7a8F39F831320DC8B6e436dd687f421B8EF0
                  </span>
                </Space>
              </div>
              <div>
                <span style={{ color: "#aaa" }}>
                  sdf sdfsdfg sdfgsdfg sdfgsdfg sdrgsdfg sdfgsdfg sdfgsdfg
                  sdfgsdfg sdfgsdfg safgsdfg sdfgsdfg sdfgsdfg sdfgsdfg sdfgsdfg
                  sdfgsdfg sdfgsdfg
                </span>
              </div>
            </Space>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}

export default LeakDetailsPage;
