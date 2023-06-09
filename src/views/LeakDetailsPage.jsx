import React, { useEffect, useState } from "react";
import { fetchDataFromIPFSCID } from "@/services/ipfs.service";
import { Col, Row, Spin } from "antd";
import LeakHeader from "@/components/LeaksDetails/LeakHeader";
import LeakDescription from "@/components/LeaksDetails/LeakDescription";
import AuthorDetails from "@/components/LeaksDetails/AuthorDetails";
import LeakFilesSection from "@/components/LeaksDetails/LeakFilesSection";
import Contribute from "@/components/LeaksDetails/Contribute";
import CommentDetails from "@/components/LeaksDetails/CommentDetails";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';

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

function LeakDetailsPage() {
  const router = useRouter();
  const ipfsCID = router?.query.slug
  const [isLeaksDataLoading, setIsLeaksDataLoading] = useState(false);
  const [leakData, setLeakData] = useState(null);

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

      <CommentDetails ipfsCID={ipfsCID} />
    </div>
  );
}

export default dynamic(() => Promise.resolve(LeakDetailsPage), { ssr: false });
