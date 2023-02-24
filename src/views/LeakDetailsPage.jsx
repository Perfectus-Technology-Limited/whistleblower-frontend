import React, { useEffect, useState } from 'react'
import { fetchDataFromIPFSCID } from '@/services/ipfs.service'
import { Col, Row, Avatar, Spin } from 'antd'
import IconBxUserCircle from '@/utils/IconBxUserCircle'
import FileList from '@/components/FileList'
import LeakHeader from '@/components/LeaksDetails/LeakHeader'
import LeakDescription from '@/components/LeaksDetails/LeakDescription'
import AuthorDetails from '@/components/LeaksDetails/AuthorDetails'
import LeakFilesSection from '@/components/LeaksDetails/LeakFilesSection'

const styles = {
  pageContainer: {
    marginTop: '50px'
  },
  postDescription: {
    fontSize: '15px',
    color: '#ffffff',
    marginTop: '20px',
    whiteSpace: 'pre-line',
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

  console.log(leakData)
  useEffect(() => {
    if (ipfsCID) {
      fetchDataFromIPFS()
    }
  }, [ipfsCID])



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

                <LeakHeader
                  title={leakData?.title}
                  date={leakData?.date}
                  coverImageCID={leakData?.coverImage}
                />

                <LeakDescription description={leakData?.description} />

                {/* TODO: we might meed to add like latest votes address and status or comments */}

              </Col>

              <Col sx={24} md={24} lg={8}>
                <AuthorDetails address={leakData?.account} date={leakData?.date} />

                <div className='voting-container'>

                </div>

                <LeakFilesSection files={leakData?.uploadedFiles} />
              </Col>
            </>
          )
        }
      </Row>
    </div>
  )
}

export default LeakDetailsPage
