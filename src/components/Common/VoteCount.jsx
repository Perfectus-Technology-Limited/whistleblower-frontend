import React from 'react'
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import { useContractRead } from 'wagmi';
import { whistleblowerConfig } from '@/blockchain/bsc/web3.config';
import { Spin } from 'antd';

const styles = {
  upVote: {
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    color: "#74ec67",
    fontSize: "18px",
  },
  downVote: {
    display: "flex",
    alignItems: "center",
    color: "#ff0000",
    fontSize: "18px",
  }
};
function VoteCount({ leakCID }) {

  const { data: voteCount, isLoading: isVoteCountLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: 'voteCounts',
    args: [leakCID],
    enabled: !!leakCID,
    watch: true,
  })

  return (
    <div className="card-entire-footer">
      {
        isVoteCountLoading ? (
          <div className="d-flex">
            <Spin size='small' />
          </div>
        ) : (
          <div className="card-footer">
            <div className="card-footer-arrows">
              <div style={styles.upVote}>
                <IconArrowUpSquareFill />
                <span style={{ paddingLeft: "5px" }}>
                  {voteCount && voteCount[1].toString()}
                </span>
              </div>
              <div style={styles.downVote}>
                <IconArrowDownSquareFill />
                <span style={{ paddingLeft: "5px" }}>
                  {voteCount && voteCount[0].toString()}
                </span>
              </div>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default VoteCount