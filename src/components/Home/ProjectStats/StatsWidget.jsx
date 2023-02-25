import React from 'react'

const styles = {
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // border: '1px solid red',
    backgroundColor: '#151617',
    borderRadius: '10px',
    color: '#ffffff',
    height: '130px'
  },
  title: {

  },
  statValue: {
    fontSize: '35px',
    fontWeight: '800',
    color: '#910000',
  }
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

function StatsWidget({ title, value }) {
  return (
    <div className='stats-widget' style={styles.cardContainer}>
      <div className='animation stat-value' style={styles.statValue}>
        {value}
      </div>
      <div className='title' style={styles.title}>
        {title}
      </div>
    </div>
  )
}

export default StatsWidget
