import React, { useState } from "react";
import { LikeFilled, DislikeFilled } from "@ant-design/icons";
import { useContractRead } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { message, Spin } from "antd";
import { prepareWriteContract, writeContract } from "@wagmi/core";

const styles = {
  voteContainer: {
    margin: "40px 0",
  },
  voteCastTitle: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "800",
  },
  voteCasting: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  upvote: {
    cursor: "pointer",
    display: "flex",
    width: "100px",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #940000",
    borderRadius: "5px",
    marginTop: "30px",
    marginRight: "20px",
    background: "none",
  },
  upvoteIcon: {
    fontSize: "50px",
    margin: "5px",
    color: "#74ec67",
  },
  upvoteCount: {
    fontSize: "30px",
    margin: "5px",
    color: "#ffffff",
  },
  downvote: {
    cursor: "pointer",
    display: "flex",
    width: "100px",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #940000",
    borderRadius: "5px",
    marginTop: "30px",
    background:"none"
  },
  downvoteIcon: {
    fontSize: "50px",
    margin: "5px",
    color: "#c7143b",
  },
  downvoteCount: {
    fontSize: "30px",
    margin: "5px",
    color: "#ffffff",
  },
};

function VoteCastWidget({ leakCID }) {
  const [isUpVotingLoading, setUpIsVotingLoading] = useState(false);
  const [isDownVotingLoading, setDownIsVotingLoading] = useState(false);
  const { data: voteCount, isLoading: isVoteCountLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "voteCounts",
    args: [leakCID],
    enabled: !!leakCID,
    watch: true,
  });

  const handleUpVote = async () => {
    try {
      setUpIsVotingLoading(true);
      const config = await prepareWriteContract({
        address: whistleblowerConfig?.contractAddress,
        abi: whistleblowerConfig?.contractAbi,
        functionName: "vote",
        args: [leakCID, 1],
      });
      const txReceipt = await writeContract(config);
      await txReceipt.wait();
      setUpIsVotingLoading(false);
      message.success("Your vote has been casted");
    } catch (error) {
      let errorMessage = "Something went wrong while trying to cast your vote";
      if (error && error.message) {
        errorMessage = error.message;
      }
      if (error && error.reason && error.reason !== "") {
        errorMessage = error.reason;
      }
      message.error(errorMessage);
      console.log("ERROR while trying to upvote", error);
      setUpIsVotingLoading(false);
    }
  };

  const handleDownVote = async () => {
    try {
      setDownIsVotingLoading(true);
      const config = await prepareWriteContract({
        address: whistleblowerConfig?.contractAddress,
        abi: whistleblowerConfig?.contractAbi,
        functionName: "vote",
        args: [leakCID, 0],
      });
      const txReceipt = await writeContract(config);
      await txReceipt.wait();
      setDownIsVotingLoading(false);
      message.success("Your vote has been casted");
    } catch (error) {
      let errorMessage = "Something went wrong while trying to cast your vote";
      if (error && error.message) {
        errorMessage = error.message;
      }
      if (error && error.reason && error.reason !== "") {
        errorMessage = error.reason;
      }
      message.error(errorMessage);
      console.log("ERROR while trying to downvote", error);
      setDownIsVotingLoading(false);
    }
  };

  return (
    <div className="vote-cast-container" style={styles.voteContainer}>
      <div className="vote-cast-title" style={styles.voteCastTitle}>
        Cast your vote save the society:
      </div>

      {isVoteCountLoading ? (
        <div className="d-flex">
          <Spin />
        </div>
      ) : (
        <div className="vote-casting" style={styles.voteCasting}>
          <div className="vote-trust-meter"></div>

          {/* {isUpVotingLoading ? (
            <div style={styles.upvote}>
              <div className="voting-loading" style={{ margin: "20px" }}>
                <Spin />
              </div>
            </div>
          ) : ( */}
          <button
            disabled={isUpVotingLoading || isDownVotingLoading}
            className="vote-upvote"
            style={styles.upvote}
            onClick={handleUpVote}
          >
            {isUpVotingLoading ? (
              // <div style={styles.upvote}>
              <div className="voting-loading" style={{ margin: "25px" }}>
                <Spin />
              </div>
            ) : (
              // </div>
              <div className="upvote-icon" style={styles.upvoteIcon}>
                <LikeFilled />
              </div>
            )}
            <div className="upvote-count" style={styles.upvoteCount}>
              {voteCount && voteCount[0].toString()}
            </div>
          </button>
          {/* )} */}

          {/* {isDownVotingLoading ? (
            <div style={styles.downvote}>
              <div className="voting-loading" style={{ margin: "20px" }}>
                <Spin />
              </div>
            </div>
          ) : ( */}
          <button
            disabled={isUpVotingLoading || isDownVotingLoading}
            className="vote-downvote"
            style={styles.downvote}
            onClick={handleDownVote}
          >
            {isDownVotingLoading ? (
              <div className="voting-loading" style={{ margin: "25px" }}>
                <Spin />
              </div>
            ) : (
              <div className="downvote-icon" style={styles.downvoteIcon}>
                <DislikeFilled />
              </div>
            )}
            <div className="downvote-count" style={styles.downvoteCount}>
              {voteCount && voteCount[1].toString()}
            </div>
          </button>
          {/* )} */}
        </div>
      )}
    </div>
  );
}

export default VoteCastWidget;
