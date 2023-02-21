import React, { useEffect, useState } from "react";
import { Alert, Col, Row } from "antd";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { countryList } from "@/constants";
import { categories } from "@/constants";
import { InboxOutlined } from "@ant-design/icons";
import {
  handlerDropImage,
  handlerImageUpload,
  handlerPinningJson,
} from "@/services/pinata";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
const { Dragger } = Upload;
const { TextArea } = Input;

const normFile = (e) => {
  console.log("Upload event:", e);
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
  const [hashes, setHashes] = useState([]);
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
        uploadedFiles: hashes,
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
          console.log(hashes);
          setIsLoading(false);
          message.success("File uploading has been successfully");
        } else {
          setIsLoading(false);
          message.error("File uploading has been failed");
        }
      }
    },
  };

  return (
    <div className="submit-page-main-div">
      <Loader isLoading={isLoading} />
      <Loader isLoading={isCreateLeakLoading} />

      <Row>
        <Col xl={6} lg={2} md={1}></Col>
        <Col xl={12} lg={20} md={22}>
          <div className="submit-page-form-main-div">
            <Form
              layout="vertical"
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                country: null,
                category: null,
                city: "",
                description: "",
                title: "",
              }}
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              size="large"
              className="submit-page-form"
            >
              <Form.Item
                label="country"
                name="country"
                required={[
                  { required: true, message: "Please Select Your Country!" },
                ]}
                rules={[
                  { required: true, message: "Please select the country!" },
                ]}
              >
                <Select placeholder="Select Country" showSearch>
                  {countryList.map((country, index) => {
                    return (
                      <Select.Option key={index} value={country}>
                        {country}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                label="city"
                name="city"
                required={[
                  {
                    required: true,
                    message: "Please Select Your city!",
                  },
                ]}
                rules={[{ required: true, message: "Please enter the city!" }]}
              >
                <Input placeholder="city" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                required={[
                  { required: true, message: "Please Select the category!" },
                ]}
                rules={[
                  { required: true, message: "Please select the category!" },
                ]}
              >
                <Select placeholder="Select Category">
                  {categories.map((category, index) => {
                    return (
                      <Select.Option key={index} value={category}>
                        {category}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                required={[
                  { required: true, message: "Please Enter the Title!" },
                ]}
                rules={[{ required: true, message: "Please enter the title!" }]}
              >
                <Input placeholder="Add a title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                required={[
                  { required: true, message: "Please Enter the description!" },
                ]}
                rules={[
                  { required: true, message: "Please enter the description" },
                ]}
              >
                <TextArea
                  rows={10}
                  placeholder="Full description of the issue"
                />
              </Form.Item>
              <Form.Item
                label="Upload Files"
                name="uploadFiles"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Dragger {...props}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{ color: "#64ec67" }} />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    files, images and screenshots, audio files, video
                  </p>
                </Dragger>
              </Form.Item>
              <Row className="submit">
                <Col xl={24} lg={24} md={24} sm={24}>
                  {account ? (
                    <Form.Item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        className="form-submit-btn"
                        type="primary"
                        htmlType="submit"
                      >
                        submit
                      </Button>
                    </Form.Item>
                  ) : (
                    <Alert
                      message="Please connect the wallet then submit"
                      type="warning"
                      showIcon
                    />
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
        <Col xl={6} lg={2} md={1}></Col>
      </Row>
    </div>
  );
}

export default Submit;
