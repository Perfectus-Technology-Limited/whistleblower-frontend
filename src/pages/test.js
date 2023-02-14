import React, { useEffect, useState } from "react";
import {
  createCampaign,
  getNumberOfCampaigns,
} from "@/blockchain/bsc/web3.service";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const test = () => {
  const { address } = useAccount();
  const [numberOfCampaigns, setNumberOfCampaigns] = useState(0);

  const getNumberOfCampaign = async () => {
    const response = await getNumberOfCampaigns();
    setNumberOfCampaigns(response);
    console.log(response);
  };

  const createNewCampaign = async () => {
    address;
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

  useEffect(() => {
    getNumberOfCampaign();
  }, []);

  const handlerCreate = async () => {
    createNewCampaign();
  };

  return (
    <div
      style={{
        color: "red",
      }}
    >
      <button onClick={handlerCreate}>create</button>
    </div>
  );
};

export default test;
