import React, { useEffect, useState } from "react";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { Button, Input, message, Modal, Spin } from "antd";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import { useAccount, useContractRead } from "wagmi";
import axios from "axios";
const { TextArea } = Input;

const styles = {
  contributeContainer: {
    margin: "40px 0",
  },
  contribute: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "800",
  },
  signHere: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  signHereBtn: {
    cursor: "pointer",
    justifyContent: "center",
    display: "flex",
    // width: "150px",
    color: "#00A771",
    fontWeight: "600px",
    fontSize: "20px",
    alignItems: "center",
    border: "1px solid #00A771",
    borderRadius: "5px",
    padding: "5px 10px",
    marginTop: "30px",
    marginRight: "20px",
    background: "none",
  },
};

function Contribute({ leakCID }) {
  const [commentLoading, setCommentLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const { address } = useAccount();

  const { data: commentedUsers, isLoading: commentedUserLoading } =
    useContractRead({
      address: whistleblowerConfig?.contractAddress,
      abi: whistleblowerConfig?.contractAbi,
      functionName: "getAllCommentedUsers",
      args: [leakCID],
      // enabled: !!ipfsCID,
      watch: true,
    });

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      setCommentLoading(true);
      const config = await prepareWriteContract({
        address: whistleblowerConfig?.contractAddress,
        abi: whistleblowerConfig?.contractAbi,
        functionName: "comment",
        args: [leakCID, comment],
      });

      const txReceipt = await writeContract(config);
      const response=await txReceipt.wait();

      if (response) {
        const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/update-signers-count/${leakCID}`;
        var apiConfig = {
          method: "patch",
          maxBodyLength: Infinity,
          url: endpoint,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const updateSignerResponse = await axios(apiConfig);
        if (updateSignerResponse && updateSignerResponse.status === 200) {
          message.success("Your comment has been recorded");
        }
      }

      setCommentLoading(false);
      setOpen(false);
      setComment("");
    } catch (error) {
      let errorMessage = "Something went wrong while trying to your comment";

      if (error && error.message) {
        errorMessage = error.message;
      }

      if (error && error.reason && error.reason !== "") {
        errorMessage = error.reason;
      }

      message.error(errorMessage);
      console.log("ERROR while trying to comment", error);
      setCommentLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {}, [address]);

  return (
    <div className="vote-cast-container" style={styles.contributeContainer}>
      <div className="vote-cast-title" style={styles.contribute}>
        Contribute :
      </div>
      <span style={{ color: "white", fontSize: "13px" }}>
        {commentedUsers?.length} have signed
      </span>

      <div className="sign-here" style={styles.signHere}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            className="sign-here-btn"
            style={styles.signHereBtn}
            onClick={showModal}
            disabled={commentedUsers?.some((account) => account === address)}
          >
            {commentedUsers?.some((account) => account === address)
              ? " Already signed"
              : " Sign Here"}
          </button>
        </div>

        <Modal
          maskStyle={{ background: "#101420", opacity: "0.9" }}
          onCancel={handleCancel}
          open={open}
          title="Signing Here"
          footer={[
            <Button
              style={{ color: "white", background: "#00A771" }}
              key="submit"
              type="primary"
              loading={commentLoading}
              onClick={handleOk}
            >
              Sign
            </Button>,
          ]}
        >
          <div style={{ marginBottom: "30px" }}>
            <TextArea
              showCount
              maxLength={140}
              style={{
                height: 100,
                resize: "none",
              }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comment here ."
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Contribute;
