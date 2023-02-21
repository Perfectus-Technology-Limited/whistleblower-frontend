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
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
const test = () => {
  const [resData, setResData] = useState("");
  const [writeData, setWriteData] = useState("");
  const [isWritingLoading, setIsWritingLoading] = useState(false)


  const { config: createCaseConfig } = usePrepareContractWrite({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "createCase",
    args: ['bafkreifexthlhwj5tpbqd6oclt5humysetfpamyirdclrc2df35ihl3ueu'],
  });

  const { writeAsync: createCaseWriteAsync, error } = useContractWrite(createCaseConfig);

  const handleWrite = async () => {
    const test = await createCaseWriteAsync?.();
    const result = await test?.wait();
    console.log(result)
  }
  return (
    <div
      style={{
        color: "red",
      }}
    >
      {/* <button onClick={handlerCreate}>create</button>
      <button onClick={handlerSetGreeting}>Set Greeting</button> */}
      <button onClick={handleWrite}>
        Feed
      </button>
      {/* <div>{!isLoading && resData}</div> */}
      {/* <div>{!writeDataIsLoading && writeData}</div> */}
    </div>
  );
};

export default test;
