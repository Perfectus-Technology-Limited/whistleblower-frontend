import React, { useState } from "react";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { Button, Input, message, Modal, Spin } from "antd";
import { prepareWriteContract, writeContract } from "@wagmi/core";
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
    justifyContent: "center",
    display: "flex",
    width: "150px",
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
      await txReceipt.wait();

      setCommentLoading(false);
      setOpen(false);
      setComment("");

      message.success("Your comment has been recorded");
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

  return (
    <div className="vote-cast-container" style={styles.contributeContainer}>
      <div className="vote-cast-title" style={styles.contribute}>
        Contribute :
      </div>

      <div className="sign-here" style={styles.signHere}>
        <div className="comment-count"></div>

        <button style={styles.signHereBtn} onClick={showModal}>
          Sign Here
        </button>

        <Modal
          maskStyle={{ background: "#101420", opacity: "0.9" }}
          onCancel={handleCancel}
          open={open}
          title="Comment Here"
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={commentLoading}
              onClick={handleOk}
            >
              Submit
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
