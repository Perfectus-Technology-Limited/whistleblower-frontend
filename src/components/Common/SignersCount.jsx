import React from "react";
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import { useContractRead } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { Spin } from "antd";
import { EditFilled } from "@ant-design/icons";

const styles = {
  upVote: {
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    color: "#00A771",
    fontSize: "18px",
  },
  downVote: {
    display: "flex",
    alignItems: "center",
    color: "#F05250",
    fontSize: "18px",
  },
};
function SignersCount({ leakCID }) {
  const { data: comments, isLoading: isCommentsLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: 'getAllComments',
    args: [leakCID],
    enabled: !!leakCID,
    watch: true,
  })

  return (
    <div className="card-entire-footer" style={{position:"relative",position:"sticky"}}>
      {/* { */}
      {/* // isVoteCountLoading ? ( */}
      {/* <div className="d-flex">
            <Spin size='small' />
          </div> */}
      {/* // ) : ( */}
      <div className="card-footer">
        <div className="card-footer-arrows">
          <div style={styles.upVote}>
            <EditFilled />

            <span style={{ paddingLeft: "10px", fontSize: "14px" }}>
              {`${comments?.length} Signers`}
            </span>
          </div>
        </div>
      </div>
      {/* // ) */}
      {/* } */}
    </div>
  );
}

export default SignersCount;
