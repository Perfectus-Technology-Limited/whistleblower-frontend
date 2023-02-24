import React, { useEffect, useState } from 'react'
import PlaceHolderImage from "@/images/placeholder.png"
import { DateTime } from 'luxon'

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
  postImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center'
  },
}

function LeakHeader({ title, date, coverImageCID }) {

  const [coverImageURL, setCoverImageURL] = useState('')

  useEffect(() => {
    if (coverImageCID) {
      const URI = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${coverImageCID}`
      setCoverImageURL(URI)
    } else {
      setCoverImageURL(PlaceHolderImage?.src)
    }
  }, [coverImageCID])


  return (
    <div className='post-header' style={{ position: 'relative', height: '400px' }}>
      <div className='post-title' style={styles.postTitle}>
        {title}
        <div className='post-date' style={styles.postDate}>
          {date && DateTime.fromISO(date).toFormat('yyyy/LL/dd')}
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
  )
}

export default LeakHeader
