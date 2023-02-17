import React, { useEffect, useState } from "react";
import {
  createCampaign,
  getContractGreetingMessage,
  getNumberOfCampaigns,
  getWeb3Provider,
  setContractGreetingMsg,
} from "@/blockchain/bsc/web3.service";
import { useAccount, useConnect, useDisconnect, useSigner } from "wagmi";

const test = () => {
  const { data: signerData } = useSigner();

  const { address } = useAccount();
  const [numberOfCampaigns, setNumberOfCampaigns] = useState(0);
  const [greetingMessage, setGreetingMessage] = useState("");
  const getNumberOfCampaign = async () => {
    const response = await getNumberOfCampaigns();
    setNumberOfCampaigns(response);
    console.log(response);
  };

  const createNewCampaign = async () => {
    console.log("address : ", address);
    const name = "kiruthi";
    const title = "kiruthi";
    const description = "kiruthi";
    const target = 100;
    const deadline = 2342354563;
    const image = "kiruthi";
    const transaction = await createCampaign(
      address,
      name,
      title,
      description,
      target,
      deadline,
      image
    );
    return transaction;
  };
  const provider=getWeb3Provider()
  const fetchGreeting = async () => {
    const response = await getContractGreetingMessage();
    setGreetingMessage(response);
  };

  useEffect(() => {
    getNumberOfCampaign();
    fetchGreeting();
  }, []);

  const handlerCreate = async () => {
    await createNewCampaign();
  };

  const handlerSetGreeting = async () => {
    await setContractGreetingMsg(provider.getSigner());
  };

  return (
    <div
      style={{
        color: "red",
      }}
    >
      <button onClick={handlerCreate}>create</button>
      <button onClick={handlerSetGreeting}>Set Greeting</button>
      {greetingMessage}
    </div>
  );
};

export default test;
