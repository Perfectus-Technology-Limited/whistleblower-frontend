import React, { useState } from 'react'
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons'
import { useContractRead } from 'wagmi'
import { whistleblowerConfig } from '@/blockchain/bsc/web3.config'
import { message, Spin } from 'antd'
import { prepareWriteContract, writeContract } from '@wagmi/core'

const styles = {
  voteContainer: {
    margin: '40px 0'
  },
  voteCastTitle: {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '800',
  },
  voteCasting: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  upvote: {
    cursor: 'pointer',
    display: 'flex',
    width: '100px',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #940000',
    borderRadius: '5px',
    marginTop: '30px',
    marginRight: '20px'
  },
  upvoteIcon: {
    fontSize: '50px',
    margin: '5px',
    color: '#ffffff',
  },
  upvoteCount: {
    fontSize: '30px',
    margin: '5px',
    color: '#ffffff',
  },
  downvote: {
    cursor: 'pointer',
    display: 'flex',
    width: '100px',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #940000',
    borderRadius: '5px',
    marginTop: '30px'
  },
  downvoteIcon: {
    fontSize: '50px',
    margin: '5px',
    color: '#ffffff',
  },
  downvoteCount: {
    fontSize: '30px',
    margin: '5px',
    color: '#ffffff',
  }
}
function VoteCastWidget({ leakCID }) {

  const [isUpVotingLoading, setUpIsVotingLoading] = useState(false)
  const [isDownVotingLoading, setDownIsVotingLoading] = useState(false)
  const { data: voteCount, isLoading: isVoteCountLoading } = useContractRead({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: 'voteCounts',
    args: [leakCID],
    enabled: !!leakCID
  })

  const handleUpVote = async () => {
    try {
      setUpIsVotingLoading(true)
      const config = await prepareWriteContract({
        address: whistleblowerConfig?.contractAddress,
        abi: whistleblowerConfig?.contractAbi,
        functionName: 'vote',
        args: [leakCID, 1],
      })
      const txReceipt = await writeContract(config)
      const result = await txReceipt.wait()
      console.log('upvote result', result)
      setUpIsVotingLoading(false)
      message.success('Your vote has been casted')
    } catch (error) {
      message.error(error?.message || 'Something went wrong')
      console.log("ERROR while trying to upvote", error)
      setUpIsVotingLoading(false)
    }
  }

  const handleDownVote = async () => {
    try {
      setDownIsVotingLoading(true)
      const config = await prepareWriteContract({
        address: whistleblowerConfig?.contractAddress,
        abi: whistleblowerConfig?.contractAbi,
        functionName: 'vote',
        args: [leakCID, 0],
      })
      const tx = await writeContract(config)
      console.log('downvote tx', tx)
      setDownIsVotingLoading(false)
      message.success('Your vote has been casted')
    } catch (error) {
      message.error(error?.message || 'Something went wrong')
      console.log("ERROR while trying to downvote", error)
      setDownIsVotingLoading(false)
    }
  }

  return (
    <div className="vote-cast-container" style={styles.voteContainer}>
      <div className='vote-cast-title' style={styles.voteCastTitle}>
        Cast your vote save the society:
      </div>

      {
        isVoteCountLoading ? (
          <div className='d-flex'>
            <Spin />
          </div>
        ) : (
          <div className='vote-casting' style={styles.voteCasting}>
            <div className='vote-trust-meter'></div>

            {
              isUpVotingLoading ? (
                <div style={styles.upvote}>
                  <div className='voting-loading' style={{ margin: '20px' }}>
                    <Spin />
                  </div>
                </div>
              ) : (
                <div className='vote-upvote' style={styles.upvote} onClick={handleUpVote}>
                  <div className='upvote-icon' style={styles.upvoteIcon}>
                    <LikeOutlined />
                  </div>
                  <div className='upvote-count' style={styles.upvoteCount}>
                    {voteCount && voteCount[1].toString()}
                  </div>
                </div>
              )
            }

            {
              isDownVotingLoading ? (
                <div style={styles.downvote}>
                  <div className='voting-loading' style={{ margin: '20px' }}>
                    <Spin />
                  </div>
                </div>
              ) : (
                <div className='vote-downvote' style={styles.downvote} onClick={handleDownVote}>
                  <div className='downvote-icon' style={styles.downvoteIcon}>
                    <DislikeOutlined />
                  </div>
                  <div className='downvote-count' style={styles.downvoteCount}>
                    {voteCount && voteCount[0].toString()}
                  </div>
                </div>
              )
            }

          </div>
        )
      }

    </div>
  )
}

export default VoteCastWidget