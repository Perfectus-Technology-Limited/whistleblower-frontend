import React, { useEffect, useState } from "react";
import { Avatar, Card } from "antd";
import IconArrowUpSquareFill from "@/utils/IconArrowUpSquareFill";
import IconArrowDownSquareFill from "@/utils/IconArrowDownSquareFill";
import HeroAvatar from "@/images/hero-unknown.png"
import { truncateText } from "@/utils/helpers";
import { DateTime } from "luxon";
import PlaceHolderImage from "@/images/placeholder.png"
import Link from "next/link";
const { Meta } = Card;

const styles = {
  LeakCardWidgetContainer: {
    border: '1px solid #red !important',
    backgroundColor: '#000000 !important',
    display: 'flex',
    justifyContent: 'space-between',
  },
  LeakCardWidget: {
    width: 300,
    minHeight: '500px',
    mexHeight: '500px',
    cursor: "pointer",
    background: '#141415b8',
  },
  upVote: {
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    color: "#74ec67",
    fontSize: '18px'
  },
  downVote: {
    display: "flex",
    alignItems: "center",
    color: "#ff0000",
    fontSize: '18px'
  },
  avatar: {
    width: '2.5em',
    height: '2.5em'
  }
}

function LeakCardWidget({ index, data }) {

  const [coverImageCID, setCoverImageCID] = useState('')
  const [coverImageURL, setCoverImageURL] = useState('')

  useEffect(() => {
    if (data) {
      const jsonResponse = JSON.parse(data?.ipfsContent)
      setCoverImageCID(jsonResponse?.coverImage)
    }
  }, [data])

  useEffect(() => {
    if (coverImageCID) {
      const URI = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${coverImageCID}`
      setCoverImageURL(URI)
    } else {
      setCoverImageURL(PlaceHolderImage?.src)
    }
  }, [coverImageCID])


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
              style={{ objectFit: 'cover' }}
              src={coverImageURL}
            />
          }
        >
          <div className="avatar-div">
            <Meta
              avatar={
                <Avatar
                  style={styles.avatar}
                  src={HeroAvatar.src}
                />
              }
            />
            <div style={{ display: "flex", flexDirection: "column", color: "#ffffff" }}>
              <span className="publisher-wallet-address">
                {data?.walletAddress}
              </span>
              <span className="published-date">
                {DateTime.fromISO(data?.createdAt).toFormat('yyyy/LL/dd')}
              </span>
            </div>
          </div>
          <Meta
            className="meta-leak-carted-header"
            title={truncateText(data?.title)}
            description={truncateText(data?.description, 150)}
          />
          <div className="card-entire-footer">
            <div className="card-footer">
              <div className="card-footer-arrows">
                <div
                  style={styles.upVote}
                >
                  <IconArrowUpSquareFill />
                  <span style={{ paddingLeft: "5px" }}>55</span>
                </div>
                <div style={styles.downVote}>
                  <IconArrowDownSquareFill />
                  <span style={{ paddingLeft: "5px" }}>45</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default LeakCardWidget;
