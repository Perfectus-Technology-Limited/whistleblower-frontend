import { ethers } from "ethers";
import { config } from "./web3.config";

export const getWeb3Provider = () => {
  const providerRPC = {
    bsc: {
      name: "bsc",
      rpc: "https://data-seed-prebsc-2-s2.binance.org:8545",
      chainId: 97,
    },
  };

  const provider = new ethers.providers.StaticJsonRpcProvider(
    providerRPC.bsc.rpc,
    {
      chainId: providerRPC.bsc.chainId,
      name: providerRPC.bsc.name,
    }
  );

  // const provider = new ethers.providers.StaticJsonRpcProvider('https://bsctestapi.terminet.io/rpc', { chainId: 97, name: 'bsc', })

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

export const createCampaign = async () => {
  // const { address, name, title, description, target, deadline, image } = props;
  // console.log(address);
  const address = "0x1dAe7a8F39F831320DC8B6e436dd687f421B8EF0";
  const name = "kiruthi";
  const title = "kiruthi";
  const description = "kiruthi";
  const target = 100;
  const deadline = 2342354563;
  const image = "kiruthi";

  const { contractAddress, contractAbi } = config;
  try {
    const provider = getWeb3Provider();
    const contractAbiJson = JSON.parse(contractAbi);
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbiJson,
      provider
    );
    const contractInstanceWithSigner = contractInstance.connect(
      provider.getSigner()
    );

    const txReceipt = await contractInstanceWithSigner.createCampaign(
      address,
      name,
      title,
      description,
      target,
      deadline,
      //   new Date(deadline).getTime(),
      image
    );
    const result = await txReceipt.wait();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const contractABI1 =
  '[{"inputs":[{"internalType":"string","name":"_greetings","type":"string"}],"name":"setGreeting","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getGreetings","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"greetings","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]';
const contractAddress1 = "0x2dF5D95c191603ADAd09De904d2FD9e29Fed3566";

export const getContractGreetingMessage = async () => {
  try {
    const provider = getWeb3Provider();
    const contractInstance = new ethers.Contract(
      contractAddress1,
      JSON.parse(contractABI1),
      provider
    );
    const greetingMessage = await contractInstance.getGreetings();
    return greetingMessage;
  } catch (error) {
    console.log("ERROR while reading the contract value ", error);
    return "ERROR :(";
  }
};

export const setContractGreetingMsg = async (signer) => {
  try {
    const provider = getWeb3Provider();
    const contractInstance = new ethers.Contract(
      contractAddress1,
      JSON.parse(contractABI1),
      provider
    );
    const contractInstanceWithSigner = contractInstance.connect(
      signer
    );
    const txReceipt = await contractInstanceWithSigner.setGreeting(
      "adeei poda dei"
    );
    const result = await txReceipt.wait();
    return result;
  } catch (error) {
    console.log("ERROR while setting up the contract greeting  ", error);
    return "ERROR :(";
  }
};
