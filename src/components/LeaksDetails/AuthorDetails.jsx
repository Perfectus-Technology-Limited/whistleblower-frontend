import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { DateTime } from 'luxon'
import { shortenEthAddress } from '@/utils/helpers'

const styles = {
  authorAvatar: {
    paddingRight: '10px',
  },
  authorAddress: {
    color: '#ffffff',
  },
  authorDetails: {
    display: 'flex',
    alignItems: 'center',
  },
  date: {
    color: '#ffffff',
  },
  submitMetadata: {
    display: 'flex',
    flexDirection: 'column',
  },
  submitBy: {
    marginBottom: '20px',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '800',
  }
}
function AuthorDetails({ address, date }) {

  return (
    <div className='author-container'>
      <div className='submit-by' style={styles.submitBy}>
        Submitted by :
      </div>
      <div className='author-details' style={styles.authorDetails}>
        <div className='author-avatar' style={styles.authorAvatar}>
          <Jazzicon
            diameter={50}
            seed={jsNumberForAddress(address ? address.toString() : '')} />
        </div>
        <div className='submit-metadata' style={styles.authorAddress}>
          <div className='author-address' style={styles.submitMetadata}>
            {address && shortenEthAddress(address, 12)}
          </div>
          <div className='submitted-date' style={styles.date}>
            {date && DateTime.fromISO(date).toFormat('yyyy/LL/dd')}
          </div>
        </div>

      </div>


    </div>
  )
}

export default AuthorDetails