import React, { useEffect, useState } from "react";
import {
  contractABI1,
  contractAddress1,
  createCampaign,
  getContractGreetingMessage,
  getNumberOfCampaigns,
  getWeb3Provider,
  Greeting,
  setContractGreetingMsg,
} from "@/blockchain/bsc/web3.service";
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useDisconnect,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";

const test = () => {
  const [resData, setResData] = useState("");
  const [writeData, setWriteData] = useState("");
  const [isWritingLoading, setIsWritingLoading] = useState(false)

  const { data, isLoading, refetch } = useContractRead({
    address: contractAddress1,
    abi: contractABI1,
    functionName: "getGreetings",
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress1,
    abi: contractABI1,
    functionName: "setGreeting",
    args: ["BYE BYE Morining 5"],
  });

  useEffect(() => {
    console.log('sm data', data)
  },[data])

  const {
    data: writeDatares,
    isLoading: writeDataIsLoading,
    isSuccess,
    writeAsync
  } = useContractWrite(config);

  const handleWrite = async () => {
    try {
      console.log('hello')
      setIsWritingLoading(true)
      const txRecepit = await writeAsync?.()
      await txRecepit?.wait()
      refetch?.()
      setIsWritingLoading(false)
    } catch (error) {
      setIsWritingLoading(false)
      console.log('error while writing to smart contract', error)
    }
  }

  const handlerCreate = async () => {
    // await createNewCampaign();
  };

  const handlerSetGreeting = async () => {
    // await setContractGreetingMsg(provider.getSigner());
  };

  return (
    <div
      style={{
        color: "red",
      }}
    >
      <button onClick={handlerCreate}>create</button>
      <button onClick={handlerSetGreeting}>Set Greeting</button>
      <button disabled={isWritingLoading} onClick={handleWrite}>
        Feed
      </button>
      <div>{!isLoading && resData}</div>
      {/* <div>{!writeDataIsLoading && writeData}</div> */}
    </div>
  );
};

export default test;
