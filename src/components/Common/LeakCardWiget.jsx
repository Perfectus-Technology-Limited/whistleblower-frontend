import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { truncateText } from "@/utils/helpers";
import { DateTime } from "luxon";
import PlaceHolderImage from "@/images/placeholder.png";
import Link from "next/link";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import { jsNumberForAddress } from "react-jazzicon";
import SignersCount from "./SignersCount";
const { Meta } = Card;

const styles = {
  LeakCardWidgetContainer: {
    border: "1px solid #red !important",
    backgroundColor: "#151617 !important",
    display: "flex",
    justifyContent: "center",
  },
  LeakCardWidget: {
    width: 300,
    minHeight: "500px",
    mexHeight: "500px",
    cursor: "pointer",
    background: "#141415b8",
  },
  avatarSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10px',
  }
};

function LeakCardWidget({ index, data }) {
  const [coverImageCID, setCoverImageCID] = useState("");
  const [coverImageURL, setCoverImageURL] = useState("");


  useEffect(() => {
    if (data) {
      const jsonResponse = JSON.parse(data?.ipfsContent);
      setCoverImageCID(jsonResponse?.coverImage);
    }
  }, [data]);

  useEffect(() => {
    if (coverImageCID) {
      const URI = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${coverImageCID}`;
      setCoverImageURL(URI);
    } else {
      setCoverImageURL(PlaceHolderImage?.src);
    }
  }, [coverImageCID]);

  return (
    <div className="leak-widget" style={styles.LeakCardWidgetContainer}>
      <Link href={`/leaks/${data?.ipfsCID}`}>
        <Card
          className="leak-card"
          style={styles.LeakCardWidget}
          cover={
            <img
              alt="example"
              height="200px"
              style={{ objectFit: "cover" }}
              src={coverImageURL}
            />
          }
        >
          <div className="avatar-div" style={styles.avatarSection}>
            <Meta
              avatar={
                <Jazzicon
                  diameter={35}
                  seed={jsNumberForAddress(
                    data?.walletAddress ? data?.walletAddress.toString() : ""
                  )}
                />
              }
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#ffffff",
              }}
            >
              <span className="publisher-wallet-address">
                {data?.walletAddress}
              </span>
              <span className="published-date">
                {DateTime.fromISO(data?.createdAt).toFormat("yyyy/LL/dd")}
              </span>
            </div>
          </div>
          <Meta
            className="meta-leak-carted-header"
            title={truncateText(data?.title)}
            description={truncateText(data?.description, 150)}
          />
          <SignersCount leakCID={data?.ipfsCID} />
        </Card>
      </Link>
    </div>
  );
}

export default LeakCardWidget;
