import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { shortenEthAddress } from "@/utils/helpers";
import { Avatar, Card, Col, Row, Space } from "antd";
import React from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useContractRead } from "wagmi";

function CommentDetails({ ipfsCID }) {
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
  return (
    <>
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
              sx={24}
              md={24}
              lg={16}
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
                        icon={
                          <Jazzicon
                            diameter={35}
                            seed={jsNumberForAddress(
                              comment.user ? comment.user.toString() : ""
                            )}
                          />
                        }
                        style={{ color: "white", background: "#888" }}
                      />
                    </span>
                    <span>{shortenEthAddress(comment.user, 8)}</span>
                  </Space>
                </div>
                <div>
                  <span style={{ color: "#aaa" }}>{comment.comment}</span>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default CommentDetails;
