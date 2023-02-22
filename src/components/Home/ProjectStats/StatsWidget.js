import React from 'react'
import Lottie from 'react-lottie';

const styles = {
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    // border: '1px solid red',
    backgroundColor: '#000000e0',
    borderRadius: '10px',
    color: '#ffffff',
    height: '130px'
  },
  title: {
    paddingRight: '40px'
  }
}

const defaultOptions = {
  loop: true,
  autoplay: true,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

function StatsWidget({ title, animation }) {
  return (
    <div className='stats-widget' style={styles.cardContainer}>
      <div className='animation'>
        <Lottie options={{ ...defaultOptions, animationData: animation }} height={100} width={100} />
      </div>
      <div className='title' style={styles.title}>
        {title}
      </div>
    </div>
  )
}

export default StatsWidget
