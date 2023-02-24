import React from 'react'

const styles = {
  postDescription: {
    fontSize: '15px',
    color: '#ffffff',
    marginTop: '20px',
    whiteSpace: 'pre-line',
  }
}

function LeakDescription({ description }) {
  return (
    <div className='leak-content' style={styles.postDescription}>
      {description}
    </div>
  )
}

export default LeakDescription