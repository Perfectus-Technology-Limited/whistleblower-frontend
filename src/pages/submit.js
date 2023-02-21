import React, { useState } from "react";
import { Col, Row } from "antd";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { countryList } from "@/constants";
import { catogories } from "@/constants";
import { InboxOutlined } from "@ant-design/icons";
import {
  handlerDropImage,
  handlerImageUpload,
  handlerPinningJson,
} from "@/services/pinata";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { WhistlBlowerConfig } from "@/blockchain/bsc/web3.config";
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
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [hashes, setHashes] = useState([]);
  const [percent, setPercent] = useState(0);
  const [uri, setUri] = useState("");

  const { config } = usePrepareContractWrite({
    address: WhistlBlowerConfig.contractAddress,
    abi: WhistlBlowerConfig.contractAbi,
    functionName: "createCase",
    args: [uri],
  });

  const {
    data,
    isLoading: writeContractLoading,
    isSuccess,
    write,
  } = useContractWrite(config);

  const handleCreateUri = async () => {
    try {
      // setIsWritingLoading(true);
      const txRecepit = await write?.();
      await txRecepit?.wait();
      // setIsWritingLoading(false);

      console.log(data && data);
    } catch (error) {
      // setIsWritingLoading(false);
      console.log("error while writing to smart contract", error);
    }
  };

  const onFinish = async (values) => {
    setFormData({
      country: values.country,
      city: values.city,
      category: values.category,
      title: values.title,
      description: values.description,
      uploadfiles: hashes,
    });

    setTimeout(async () => {
      console.log(formData);
      let ipfshHash = await handlerPinningJson(
        formData,
        setIsLoading,
        setPercent
      );
      let url = `https://gateway.pinata.cloud/ipfs/${ipfshHash}`;
      setUri(url);
    }, 4000);

    // await handleCreateUri();
  };

  const props = {
    name: "file",
    listType: "text",
    onRemove: (file) => {
      handlerDropImage(file.uid, hashes, setHashes, setIsLoading);
    },
    beforeUpload: async (file) => {
      setSelectedFile(file);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        handlerImageUpload(
          selectedFile,
          hashes,
          setHashes,
          setIsLoading,
          setPercent
        );
      }
    },
  };

  return (
    <div className="submit-page-main-div">
      <Row>
        <Col xl={6} lg={2} md={1}></Col>
        <Col xl={12} lg={20} md={22}>
          <div className="submit-page-form-main-div">
            <Form
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                country: countryList[0],
                category: catogories[0],
              }}
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
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
              >
                <Select showSearch>
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
              >
                <Input placeholder="city" />
              </Form.Item>
              <Form.Item
                label="Category"
                name="category"
                required={[
                  { required: true, message: "Please Select the category!" },
                ]}
              >
                <Select>
                  {catogories.map((catogory, index) => {
                    return (
                      <Select.Option key={index} value={catogory}>
                        {catogory}
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
              >
                <Input placeholder="Add a title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                required={[
                  { required: true, message: "Please Enter the description!" },
                ]}
              >
                <TextArea
                  rows={10}
                  placeholder="Full description of the issue"
                />
              </Form.Item>
              <Form.Item
                label="Upload Files"
                name="uploadfiles"
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
              <Row>
                <Col xl={6} lg={6} md={6} sm={6} xs={8}></Col>
                <Col xl={18} lg={18} md={18} sm={18}>
                  <Form.Item className="form-submit-btn-item">
                    <Button
                      className="form-submit-btn"
                      type="primary"
                      htmlType="submit"
                    >
                      submit
                    </Button>
                  </Form.Item>
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
