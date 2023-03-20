import {
  Row,
  Col,
  Form,
  Select,
  Input,
  Upload,
  Alert,
  Space,
  Typography,
  Progress,
  message,
  Button,
} from "antd";
import React, { useState, useEffect } from "react";
import { countryList, categories, getCountryWithDetails } from "@/constants";
import { DeleteOutlined, FileOutlined, InboxOutlined } from "@ant-design/icons";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import axios from "axios";
import { useRouter } from "next/router";
import { whistleblowerConfig } from "@/blockchain/bsc/web3.config";
import { handlerDropImage, handlerPinningJson } from "@/services/pinata";

const { Dragger } = Upload;
const { TextArea } = Input;

const styles = {
  tagline: {
    color: "#00A771",
    fontSize: "20px",
    marginTop: "50px",
    marginBottom: "50px",
    textAlign: "center",
  },
  formUploadContainer: {
    padding: "40px 30px",
    border: "1px solid #373737",
    borderRadius: "10px",
  },
};

function SubmitPage() {
  const [files, setFiles] = useState([]);
  const [coverImage, setCoverImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCaseCreationLoading, setIsCaseCreationLoading] = useState(false);
  const [hashes, setHashes] = useState([]);
  const [fileHashes, setFileHashes] = useState([]);
  let countryLocation;

  const { address } = useAccount();
  const router = useRouter();

  const { error: caseCreateOnChainError, writeAsync: caseCreateOnChainWrite } =
    useContractWrite({
      mode: "recklesslyUnprepared",
      address: whistleblowerConfig.contractAddress,
      abi: JSON.parse(whistleblowerConfig.contractAbi),
      functionName: "createCase(string)",
      args: [],
    });

  useEffect(() => {
    if (caseCreateOnChainError) {
      message.error(caseCreateOnChainError?.message);
    }
  }, [caseCreateOnChainError]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    console.log("TT Values ", values);
    try {
      setIsCaseCreationLoading(true);
      let uploaded = [];
      {
        fileHashes.map((hash) => {
          hash = {
            name: hash.name,
            cid: hash.cid,
            sizeInKb: hash.sizeInKb,
            type: hash.type,
            description: hash.description,
          };
          uploaded.push(hash);
        });
      }
      const payload = {
        title: values?.title,
        description: values?.description,
        country: values?.country,
        city: values?.city,
        category: values?.category,
        date: new Date().toISOString(),
        account: address,
        coverImage: hashes[0]?.cid,
        uploadedFiles: uploaded,
      };

      const CID = await handlerPinningJson(payload);
      if (CID) {
        const txReceipt = await caseCreateOnChainWrite?.({
          recklesslySetUnpreparedArgs: [CID],
        });
        const response = await txReceipt?.wait();


        const counrydetails = getCountryWithDetails;
        const find = counrydetails.find((detail) => detail.country == values?.country);

        if (response) {
          //upload rest of the data into the database
          const offChainPayload = {
            blockHash: response?.blockHash,
            blockNumber: response?.blockNumber,
            transactionHash: response?.transactionHash,
            ipfsCID: CID,
            ipfsContent: JSON.stringify(payload),
            title: values?.title,
            description: values?.description,
            country: values?.country,
            category: values?.category,
            walletAddress: address,
            country_latitude: find.latitude,
            country_longitude: find.longitude,
          };
          console.log("offChainPay", offChainPayload);
          const endpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/leaks/create`;
          var data = JSON.stringify(offChainPayload);
          var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: endpoint,
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
          };

          const offChainResponse = await axios(config);
          if (offChainResponse && offChainResponse.status === 200) {
            message.success(
              "Your case has been uploaded successfully thank you for being brave"
            );
          }
        }
        form.resetFields();
        setCoverImage([]);
        setFiles([]);
        // router.push("/leaks");

        setIsCaseCreationLoading(false);
      }
    } catch (error) {
      console.log("ERROR while trying to create a case", error);
      // message.error("Something went wrong while creating a case");
      setIsCaseCreationLoading(false);
    }
  };

  const handleFUpload = async ({ file }, from) => {
    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    try {
      setIsLoading(true);

      if (file) {
        let find;
        if (!find) {
          find = hashes.find((obj) => {
            return obj.name === file.name;
          });
        }
        if (!find) {
          find = fileHashes.find((obj) => {
            return obj.name === file.name;
          });
        }
        if (find) {
          message.error(`This file already uploaded ${file?.name}`);
          setIsLoading(false);
          return "";
        }
      }

      if (from === "cover") {
        const response = await handlerDropImage(hashes[0]?.cid);
        setCoverImage([]);
        setHashes([]);
        setCoverImage((pre) => {
          return { ...pre, [file.uid]: file };
        });
      }

      if (from === "files") {
        setFiles((pre) => {
          return { ...pre, [file.uid]: file };
        });
      }

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

          if (from === "cover") {
            setCoverImage((pre) => {
              return { ...pre, [file.uid]: getFileObject(percentage) };
            });
          }

          if (from === "files") {
            setFiles((pre) => {
              return { ...pre, [file.uid]: getFileObject(percentage) };
            });
          }
        },
      };

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        options
      );
      let hash;
      if (res.data.IpfsHash) {
        // hash = { uid: file.uid, cid: res.data.IpfsHash, meta: metaData };
        hash = {
          uid: file.uid,
          name: file?.name,
          cid: res.data.IpfsHash,
          sizeInKb: file.size / 1024,
          type: file.type,
          meta: metaData,
          description: "description",
        };
        if (from == "cover") {
          setHashes((hashes) => [...hashes, ...[hash]]);
        }

        if (from == "files") {
          setFileHashes((fileHashes) => [...fileHashes, ...[hash]]);
        }
        setIsLoading(false);
        message.success(`File upload success ${JSON.parse(metaData).name}`);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handlerRemove = async (uid, from) => {
    try {
      let find;
      if (from == "cover") {
        find = hashes.find((obj) => {
          return obj.uid === uid;
        });
      }
      if (from == "files") {
        find = fileHashes.find((obj) => {
          return obj.uid === uid;
        });
      }
      if (find) {
        setIsLoading(true);
        const response = await handlerDropImage(find.cid);
        if (response) {
          if (from == "cover") {
            setCoverImage(
              Object.values(coverImage).filter((obj) => obj.uid !== uid)
            );
            // setFileHashes(hashes.filter((obj) => obj.cid !== response));
            setHashes([]);
          }
          if (from == "files") {
            setFiles(Object.values(files).filter((obj) => obj.uid !== uid));
            setFileHashes(fileHashes.filter((obj) => obj.cid !== response));
          }
          setIsLoading(false);
          message.success("File delted succesfully");
        } else {
          setIsLoading(false);
          message.success("File delted failed");
        }
      } else {
        console.log("file not available");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const [form] = Form.useForm();

  return (
    <div>
      <Row gutter={20} style={{ marginTop: "50px" }}>
        <Col xs={24}>
          <div className="form-tagline" style={styles.tagline}>
            Exposing corruption starts with you. Be a hero.
          </div>
        </Col>
      </Row>

      <Row gutter={48}>
        {/* main form section start */}
        <Col lg={12} md={12} xs={24} style={styles.formUploadContainer}>
          <Form
            form={form}
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
            span={24}
          >
            <Form.Item
              label="country"
              name="country"
              required={[
                {
                  required: true,
                  message: "Please Select Your Country!",
                },
              ]}
              rules={[
                { required: true, message: "Please select the country!" },
              ]}
            >
              <Select
                placeholder="Select Country"
                showSearch
              >
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
              <Input placeholder="city" autoComplete={"off"} />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              required={[
                {
                  required: true,
                  message: "Please Select the category!",
                },
              ]}
              rules={[
                {
                  required: true,
                  message: "Please select the category!",
                },
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
              <Input placeholder="Add a title" autoComplete={"off"} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              required={[
                {
                  required: true,
                  message: "Please Enter the description!",
                },
              ]}
              rules={[
                {
                  required: true,
                  message: "Please enter the description",
                },
              ]}
            >
              <TextArea rows={10} placeholder="Full description of the issue" />
            </Form.Item>

            <Form.Item label="Upload Cover Image" valuePropName="fileList">
              <Dragger
                customRequest={(file) => handleFUpload(file, "cover")}
                showUploadList={false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: "#00A771" }} />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">For cover image</p>
              </Dragger>

              <div className="file-uploaded-section">
                {Object.values(coverImage)?.map((file, i) => {
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "5px 5px 0 5px",
                        width: "100%",
                        margin: "10px 0",
                      }}
                    >
                      <Space
                        direction="horizontal"
                        key={i}
                        className="main-space"
                      >
                        <FileOutlined className="file-icon" />
                        <Typography className="filename">
                          <div>{file.name}</div>
                        </Typography>
                        {file.Progress == 100 && !isLoading && (
                          <DeleteOutlined
                            style={{ color: "#fff" }}
                            onClick={() => handlerRemove(file.uid, "cover")}
                          />
                        )}
                      </Space>
                      <Progress
                        className="progress"
                        percent={file.Progress}
                        strokeWidth={1}
                        strokeColor={"#00A771"}
                      />
                    </div>
                  );
                })}
              </div>
            </Form.Item>

            <div className="submit-button">
              {address ? (
                <Form.Item
                  name="submit-button"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    className="form-submit-btn"
                    type="primary"
                    htmlType="submit"
                    loading={isCaseCreationLoading}
                    disabled={isLoading}
                  >
                    submit
                  </Button>
                </Form.Item>
              ) : (
                <Alert
                  message="Please connect the wallet to proceed"
                  type="warning"
                  showIcon
                />
              )}
            </div>
          </Form>
        </Col>
        {/* main form section end */}

        {/* file upload section start */}
        <Col lg={12} md={12} xs={24} style={styles.formUploadContainer}>
          <div className="file-upload-container">
            <Dragger
              multiple
              customRequest={(file) => handleFUpload(file, "files")}
              showUploadList={false}
              style={{ height: "200px" }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#00A771" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                files, images and screenshots, audio files, video
              </p>
            </Dragger>
          </div>

          <div className="file-uploaded-section">
            {Object.values(files)?.map((file, i) => {
              return (
                <div
                  key={i}
                  style={{
                    padding: "5px 5px 0 5px",
                    width: "100%",
                    margin: "10px 0",
                  }}
                >
                  <Space direction="horizontal" key={i} className="main-space">
                    <FileOutlined className="file-icon" />
                    <Typography className="filename">
                      <div>{file.name}</div>
                    </Typography>
                    {file.Progress == 100 && !isLoading && (
                      <DeleteOutlined
                        style={{ color: "#fff" }}
                        onClick={() => handlerRemove(file.uid, "files")}
                      />
                    )}
                  </Space>
                  <Progress
                    className="progress"
                    percent={file.Progress}
                    strokeWidth={1}
                    strokeColor={"#00A771"}
                  />
                </div>
              );
            })}
          </div>
        </Col>
        {/* file upload section end */}
      </Row>
    </div>
  );
}

export default SubmitPage;
