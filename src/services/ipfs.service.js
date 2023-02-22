import axios from 'axios'

export const fetchDataFromIPFSCID = async (cid) => {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${cid}`
    const response = await axios.get(endpoint)
    if (response && response.status === 200) {
      return response.data
    }
    return null
  } catch (error) {
    console.log("ERROR while trying to fetch data from IPFS suing CID ", error)
    return null
  }
}