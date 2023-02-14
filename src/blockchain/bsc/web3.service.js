import { ethers } from "ethers";
import { config } from "./web3.config";

const getWeb3Provider = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s2.binance.org:8545"
  );
  return provider;
};

// contarct instance
const getContractInstance = async () => {
  const { contractAddress, contractAbi } = config;
  try {
    const provider = getWeb3Provider();
    const contractAbiJson = JSON.parse(contractAbi);
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbiJson,
      provider
    );
    return contractInstance;
  } catch (error) {
    console.log("Error while reading contract - " + error);
  }
};

export const getNumberOfCampaigns = async () => {
  try {
    const contractInstance = await getContractInstance();
    const response = await contractInstance.numberOfCampaigns();
    return parseInt(response);
  } catch (error) {
    console.log("Error while getNumberOfCampaigns - " + error);
  }
};

export const createCampaign = async (props) => {
  const { address, name, title, description, target, deadline, image } = props;
  try {
    const provider = getWeb3Provider();
    const contractInstance = await getContractInstance();
    const contractInstanceWithSigner = contractInstance.connect(
      provider.getSigner()
    );
    const txReceipt = await contractInstanceWithSigner.createCampaign([
      address,
      name,
      title,
      description,
      target,
      deadline,
      //   new Date(deadline).getTime(),
      image,
    ]);
    const result = await txReceipt.wait();
    return result;
  } catch (error) {
    console.log(error);
  }
};
