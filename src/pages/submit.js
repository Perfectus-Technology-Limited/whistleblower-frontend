import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { Button, Form, Input, Select, Upload, message } from "antd";
import { countryList } from "@/constants";
import { categories } from "@/constants";
import { InboxOutlined } from "@ant-design/icons";
import {
  handlerDropImage,
  handlerImageUpload,
  handlerPinningJson,
} from "@/services/pinata";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
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
  const [percent, setPercent] = useState(0);
  const [leakJsonCID, setSetLeakJsonCID] = useState('');
  const [isCreateLeakLoading, setIsCreateLeakLoading] = useState(false);
  const { config: createCaseConfig } = usePrepareContractWrite({
    address: whistleblowerConfig?.contractAddress,
    abi: whistleblowerConfig?.contractAbi,
    functionName: "createCase",
    args: [leakJsonCID?.toString()],
  });

  const { writeAsync: createCaseWriteAsync, error } = useContractWrite(createCaseConfig);


  useEffect(() => {
    if (leakJsonCID) {
      // createCaseOnChain()
      // (async () => {

      //   const createCaseReceipt = await createCaseWriteAsync?.();
      //   await createCaseReceipt?.wait();

      // })

      // createCaseOnChain()
    }

  }, [leakJsonCID])

  //bafkreifexthlhwj5tpbqd6oclt5humysetfpamyirdclrc2df35ihl3ueu

  const createCaseOnChain = async () => {
    try {
      setIsCreateLeakLoading(true);
      const createCaseReceipt = await createCaseWriteAsync?.();
      await createCaseReceipt?.wait();
      setIsCreateLeakLoading(true)
      message.success('Case has been created successfully')
    } catch (error) {
      setIsCreateLeakLoading(false)
      console.log("ERROR while trying to create a case in on chain", error);
    }
  };

  const onFinish = async (values) => {
    try {
      setIsLoading(true)
      const payload = {
        country: values?.country,
        city: values?.city,
        category: values?.category,
        title: values?.title,
        description: values?.description,
        uploadedFiles: hashes,
      }
      const CID = await handlerPinningJson(payload, setPercent)
      setSetLeakJsonCID(CID)
      message.info('File has been uploaded successfully hold on for on chain confirmation');
    } catch (error) {
      console.log("ERROR while trying to create a case", error)
      message.error('Something went wrong while creating a case')
      setIsLoading(false)
    }

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
              name="basic"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                country: null,
                category: null,
                city: '',
                description: '',
                title: ''
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
                rules={[{ required: true, message: 'Please select the country!' }]}
              >
                <Select
                  placeholder="Select Country"
                  showSearch>
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
                rules={[{ required: true, message: 'Please enter the city!' }]}
              >
                <Input placeholder="city" />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                required={[
                  { required: true, message: "Please Select the category!" },
                ]}
                rules={[{ required: true, message: 'Please select the category!' }]}
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
                rules={[{ required: true, message: 'Please enter the title!' }]}
              >
                <Input placeholder="Add a title" />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                required={[
                  { required: true, message: "Please Enter the description!" },
                ]}
                rules={[{ required: true, message: 'Please enter the description' }]}
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
