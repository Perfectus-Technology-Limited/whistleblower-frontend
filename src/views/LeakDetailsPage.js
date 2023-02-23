import React, { useEffect, useState } from 'react'
import { fetchDataFromIPFSCID } from '@/services/ipfs.service'
import { Col, Row, Avatar, Spin } from 'antd'
import { DateTime } from 'luxon'
import IconBxUserCircle from '@/utils/IconBxUserCircle'
import FileList from '@/components/FileList'
import PlaceHolderImage from "@/images/placeholder.png"

const styles = {
  pageContainer: {
    marginTop: '50px'
  },
  postTitle: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: '1',
    fontSize: '25px',
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center'
  },
  postDate: {
    zIndex: '1',
    fontSize: '15px',
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: '5px'
  },
  postDescription: {
    fontSize: '15px',
    color: '#ffffff',
    marginTop: '20px',
    whiteSpace: 'pre-line',

  },
  postImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  },
  submitBy: {
    padding: '10px 20px',
    fontSize: '15px',
    fontWeight: '800',
    color: '#ffffff',
  }
}
function LeakDetailsPage({ ipfsCID }) {

  const [isLeaksDataLoading, setIsLeaksDataLoading] = useState(false)
  const [leakData, setLeakData] = useState(null)
  const [coverImageURL, setCoverImageURL] = useState('')

  console.log(leakData)
  useEffect(() => {
    if (ipfsCID) {
      fetchDataFromIPFS()
    }
  }, [ipfsCID])

  useEffect(() => {
    if (leakData && leakData?.coverImage) {
      const URI = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${leakData?.coverImage}`
      setCoverImageURL(URI)
    } else {
      setCoverImageURL(PlaceHolderImage?.src)
    }
  }, [leakData])

  const fetchDataFromIPFS = async () => {
    setIsLeaksDataLoading(true)
    const dataResponse = await fetchDataFromIPFSCID(ipfsCID)
    setLeakData(dataResponse)
    setIsLeaksDataLoading(false)
  }

  return (
    <div className='leak-details-container' style={styles.pageContainer}>
      <Row gutter={16}>

        {
          isLeaksDataLoading ? (
            <div className='d-flex justify-content center'>
              <Spin size='large' />
            </div>
          ) : (
            <>
              <Col sx={24} md={24} lg={16}>
                <div className='post-header' style={{ position: 'relative', height: '400px' }}>
                  <div className='post-title' style={styles.postTitle}>
                    {leakData?.title}
                    <div className='post-date' style={styles.postDate}>
                      {leakData && DateTime.fromISO(leakData?.date).toFormat('yyyy/LL/dd')}
                    </div>
                  </div>


                  <div className="image-container" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.6)), url(${coverImageURL})`
                  }}></div>
                </div>

                <div className='leak-content' style={styles.postDescription}>
                  {leakData?.description}
                </div>
              </Col>

              <Col sx={24} md={24} lg={8}>
                <div className='author-details'>
                  <div className='submitted-by' style={styles.submitBy}>
                    Submitted By
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      paddingTop: "40px",
                    }}
                  >
                    <div>
                      <Avatar size={72} icon={<IconBxUserCircle />} />
                    </div>
                    <div style={{ color: "#ffffff" }}>
                      <p
                        style={{
                          width: "300px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        0x5b9141b2258A45B133b61D32112fC9369D95Af24
                      </p>
                      <p>09/02/2023</p>
                    </div>
                  </div>
                </div>

                <div className='voting-container'>

                </div>

                <div className='file-list-container'>
                  <div className='leaks-doc-title'>
                    Report Documents
                  </div>

                  <div className='files-list'>
                    <FileList list={leakData?.uploadedFiles} />
                  </div>
                </div>
              </Col>
            </>
          )
        }
      </Row>
    </div>
  )
}

export default LeakDetailsPage
