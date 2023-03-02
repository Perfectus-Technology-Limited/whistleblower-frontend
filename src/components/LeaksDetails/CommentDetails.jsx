import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { shortenEthAddress } from "@/utils/helpers";
import { Avatar, Card, Col, Pagination, Row, Space } from "antd";
import React, { useState } from "react";
import { jsNumberForAddress } from "react-jazzicon";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { useContractRead } from "wagmi";

function CommentDetails({ ipfsCID }) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  let commentsWithUser = [];

  const { data: comments, isLoading: commentsLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "getAllComments",
    args: [ipfsCID],
    // enabled: !!ipfsCID,
    watch: true,
  });

  const { data: commentedUsers, isLoading: commentedUserLoading } =
    useContractRead({
      address: whistleblowerConfig?.contractAddress,
      abi: whistleblowerConfig?.contractAbi,
      functionName: "getAllCommentedUsers",
      args: [ipfsCID],
      // enabled: !!ipfsCID,
      watch: true,
    });

  let newComments = comments?.slice().reverse();
  let newCommentedUser = commentedUsers?.slice().reverse();

  let end = pageSize * currentPage;
  let start = end - pageSize;

  if (comments?.length > 0 && commentedUsers?.length > 0) {
    if (end > comments.length) {
      end = comments.length;
    }
    for (let i = start; i < end; i++) {
      commentsWithUser.push({
        user: newComments[i],
        comment: newCommentedUser[i],
      });
    }
  }

  const handlePageChange = (_currentPage, _pageSize) => {
    if (_pageSize) {
      setPageSize(_pageSize);
    }

    if (_currentPage) {
      setCurrentPage(_currentPage);
    }
  };
  return (
    <>
      <Row
        style={{ marginTop: "40px", display: "flex", flexDirection: "column" }}
      >
        <div style={{ color: "white", fontSize: "20px", fontWeight: "400" }}>
          Reasons for signing
        </div>
        <span style={{ color: "#ccc", fontSize: "13px" }}>
          {commentedUsers?.length} have signed
        </span>
        {commentsWithUser.map((comment) => (
          <Col sx={24} md={24} lg={16}>
            <Card
              style={{
                marginTop: "15px",
                background: "none",
                border: "1px solid #134c04",
                color: "white",
              }}
              sx={24}
              md={24}
              lg={16}
            >
              <Space direction="vertical" size={2}>
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
                      <Jazzicon
                        diameter={35}
                        seed={jsNumberForAddress(
                          comment.user ? comment.user.toString() : ""
                        )}
                      />
                    </span>
                    <span className="shrot-address">
                      {shortenEthAddress(comment.user, 8)}
                    </span>
                    <span className="full-address">{comment.user}</span>
                  </Space>
                </div>
                <div>
                  <span style={{ color: "#aaa", fontSize: "12px" }}>
                    {comment.comment}
                  </span>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      <Row>
        <Col
          sx={24}
          md={24}
          lg={16}
          style={{ color: "white", padding: "10px", margin: "10px 0" }}
        >
          <Pagination
            onChange={handlePageChange}
            style={{ color: "white" }}
            total={comments?.length}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
            defaultPageSize={pageSize}
            // defaultCurrent={2}
            current={currentPage}
          />
        </Col>
      </Row>
    </>
  );
}

export default CommentDetails;
