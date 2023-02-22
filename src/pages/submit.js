import React, { useEffect, useState } from "react";
import { Alert, Col, Progress, Row, Space, Typography } from "antd";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { countryList } from "@/constants";
import { categories } from "@/constants";
import {
  DeleteColumnOutlined,
  DeleteFilled,
  DeleteOutlined,
  DeleteRowOutlined,
  FileOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  handlerDropImage,
  handlerImageUpload,
  handlerPinningJson,
} from "@/services/pinata";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import axios from "axios";
import PageLoader from "@/components/Loader";
import SubmitPage from "@/views/SubmitPage";
const { Dragger } = Upload;
const { TextArea } = Input;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Submit() {


  const [isPageLoading, setIsPageLoading] = useState(true);

  const [leakJsonCID, setSetLeakJsonCID] = useState("");
  const [isCreateLeakLoading, setIsCreateLeakLoading] = useState(false);

  const router = useRouter();

  const { config: createCaseConfig } = usePrepareContractWrite({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "createCase",
    args: [leakJsonCID.toString()],
  });

  const { writeAsync: createCaseWriteAsync, error } =
    useContractWrite(createCaseConfig);

  const createCaseOnChain = async () => {
    try {
      console.log(leakJsonCID);
      setIsCreateLeakLoading(true);
      const createCaseReceipt = await createCaseWriteAsync?.();
      await createCaseReceipt?.wait();
      setIsCreateLeakLoading(false);
      if (createCaseReceipt) {
        router.push("/leaks");
        message.success("Case has been created successfully");
      }
    } catch (error) {
      setIsCreateLeakLoading(false);
      console.log("ERROR while trying to create a case in on chain", error);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      setIsPageLoading(false);
    }
  }, [router]);

  if (isPageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="submit-page-main-div container">
      <SubmitPage />
    </div>
  );
}

export default Submit;
