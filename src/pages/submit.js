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
  const [selectedFile, setSelectedFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hashes, setHashes] = useState([]);
  const [fileHashes, setFileHashes] = useState([]);
  const [leakJsonCID, setSetLeakJsonCID] = useState("");
  const [isCreateLeakLoading, setIsCreateLeakLoading] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  const [account, setAccount] = useState("");
  const router = useRouter();

  const { config: createCaseConfig } = usePrepareContractWrite({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "createCase",
    args: [leakJsonCID.toString()],
  });

  const { writeAsync: createCaseWriteAsync, error } =
    useContractWrite(createCaseConfig);

  useEffect(() => {
    if (leakJsonCID) {
      createCaseOnChain();
    }
  }, [leakJsonCID]);

  useEffect(() => {
    setAccount(address);
  }, [address]);

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

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const payload = {
        country: values?.country,
        city: values?.city,
        category: values?.category,
        title: values?.title,
        description: values?.description,
        coverImage: hashes,
        files: fileHashes,
      };
      const CID = await handlerPinningJson(payload);
      if (CID) {
        setSetLeakJsonCID(CID);
        setIsLoading(false);
        message.info(
          "File has been uploaded successfully hold on for on chain confirmation"
        );
      }
    } catch (error) {
      console.log("ERROR while trying to create a case", error);
      message.error("Something went wrong while creating a case");
      setIsLoading(false);
    }
  };

  const props = {
    // maxCount:1,
    name: "file",
    listType: "text",
    onRemove: async (file) => {
      const find = hashes.find((obj) => {
        return obj.uid === file.uid;
      });

      if (find) {
        setIsLoading(true);
        const response = await handlerDropImage(find.cid);
        if (response) {
          setHashes(hashes.filter((obj) => obj.cid !== response));
          message.success("File delted succesfully");
          setIsLoading(false);
        } else {
          setIsLoading(false);
          message.success("File delted failed");
        }
      } else {
        setIsLoading(false);
        console.log("File not found");
      }
    },
    beforeUpload: async (file) => {
      setSelectedFile(file);
    },
    onChange: async (info) => {
      const { status } = info.file;
      if (status === "done") {
        setIsLoading(true);
        const response = await handlerImageUpload(selectedFile);
        setHashes([...hashes, response]);
        if (response) {
          setIsLoading(false);
          message.success("File uploading has been successfully");
        } else {
          setIsLoading(false);
          message.error("File uploading has been failed");
        }
      }
    },
  };

  const [files, setFiles] = useState("");

  const handleFIlepload = async ({ file }) => {
    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

    setFiles((pre) => {
      return { ...pre, [file.uid]: file };
    });

    const getFileObject = (Progress) => {
      return {
        name: file.name,
        uid: file.uid,
        Progress: Progress,
      };
    };

    const formData = new FormData();

    formData.append("file", file);

    const metaData = JSON.stringify({
      name: file?.name,
    });

    formData.append("pinataMetadata", metaData);

    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });

    formData.append("pinataOptions", pinataOptions);

    const options = {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${JWT}`,
      },
      onUploadProgress: (event) => {
        console.log("TT event", event);
        const { loaded, total } = event;
        let percentage = Math.floor((loaded * 100) / total);
        // console.log(`${loaded}kb of ${total}kb | ${percentage}%`);
        setFiles((pre) => {
          return { ...pre, [file.uid]: getFileObject(percentage) };
        });
      },
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      options
    );
    let hash;
    if (res.data.IpfsHash) {
      hash = { uid: file.uid, cid: res.data.IpfsHash, meta: metaData };
      setFileHashes((fileHashes) => [...fileHashes, ...[hash]]);
      message.success(`File upload success ${JSON.parse(metaData).name}`);
    }
  };

  const handlerRemove = async (uid) => {
    const find = fileHashes.find((obj) => {
      return obj.uid === uid;
    });
    console.log(find);
    if (find) {
      setIsLoading(true);
      const response = await handlerDropImage(find.cid);
      if (response) {
        setFiles(Object.values(files).filter((obj) => obj.uid !== uid));
        setFileHashes(fileHashes.filter((obj) => obj.cid !== response));
        setIsLoading(false);
        message.success("File delted succesfully");
      } else {
        setIsLoading(false);
        message.success("File delted failed");
      }
    } else {
      console.log("file not available");
    }
  };

  useEffect(() => {
    console.log("TT fileHashes", fileHashes);
  }, [fileHashes]);

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
