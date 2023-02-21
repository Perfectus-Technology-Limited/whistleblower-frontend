import { InboxOutlined } from "@ant-design/icons";
import { Button, Form, message, Progress, Space, Upload } from "antd";
import axios from "axios";
import React, { useState } from "react";

export default function upload() {
  const { Dragger } = Upload;
  const [selectedFile, setSelectedFile] = useState();
  const [percent, setPercent] = useState(0);
  const [hashes, setHashes] = useState([]);

  const handlerImageUpload = async () => {
    try {
      var uId = selectedFile.uid;
      const JWT =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYTg0ZjVkOC1mZDM3LTQxODEtODMwZS03MDM4ODI4ZWU4MWEiLCJlbWFpbCI6ImluZm9AcGVyZmVjdHVzdGVjLmNvLnVrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImMyMmFjYzM5OTRjNTkzNWY5Mjk2Iiwic2NvcGVkS2V5U2VjcmV0IjoiODdkYjk1ZjE3OTQ2MDlkOGJhZDJjNTA5NjY2ZmE5YjQ1OWQwYTMzMzI5YzI4NjQwZjVhYzZkNDViZmRjNThkMyIsImlhdCI6MTY3NjQ0MTEzNn0.M8LCPDFN1BgtS1VuTnObL5aKcwlhLMjcOdF2onmK2As";

      const formData = new FormData();

      formData.append("file", selectedFile);

      const metaData = JSON.stringify({
        name: selectedFile?.name,
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
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percentage = Math.floor((loaded * 100) / total);
          setPercent(() => {
            const newPercent = percentage;
            if (newPercent > 100) {
              return 100;
            }
            return newPercent;
          });
          console.log(`${loaded}kb of ${total}kb | ${percentage}%`);
        },
      };

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        options
      );

      if (res.data.IpfsHash) {
        message.success(`${selectedFile?.name} file uploaded successfully.`);
      } else {
        console.log("velaikku oodiddan");
      }

      setHashes([...hashes, { uid: uId, hash: res.data.IpfsHash }]);
    } catch (error) {
      console.log("while file uploading error" + error);
    }
  };

  const handlerDropImage = async (uId) => {
    const find = hashes.find((obj) => {
      return obj.uid === uId;
    });

    const JWT =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmYTg0ZjVkOC1mZDM3LTQxODEtODMwZS03MDM4ODI4ZWU4MWEiLCJlbWFpbCI6ImluZm9AcGVyZmVjdHVzdGVjLmNvLnVrIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImMyMmFjYzM5OTRjNTkzNWY5Mjk2Iiwic2NvcGVkS2V5U2VjcmV0IjoiODdkYjk1ZjE3OTQ2MDlkOGJhZDJjNTA5NjY2ZmE5YjQ1OWQwYTMzMzI5YzI4NjQwZjVhYzZkNDViZmRjNThkMyIsImlhdCI6MTY3NjQ0MTEzNn0.M8LCPDFN1BgtS1VuTnObL5aKcwlhLMjcOdF2onmK2As";

    if (find) {
      const formData = new FormData();

      const res = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${find.hash}`,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${JWT}`,
          },
        }
      );

      if (res.data == "OK") {
        setHashes(hashes.filter((obj) => obj.hash !== find.hash));
        message.success(`file deleted successfully.`);
        console.log(res);
      }

      // console.log(res);
    } else {
      console.log("this file not available");
    }
  };

  const props = {
    name: "file",
    multiple: true,
    listType: "text",
    beforeUpload: (file) => {
      setSelectedFile(file);
    },
    onChange(info) {
      const { status } = info.file;
      // info.event? info.event.percent= 60:"";

      if (status == "uploading") {
        // console.log(info);
      }

      if (status === "done") {
        handlerImageUpload();
        setTimeout(() => {
          setPercent(0);
        }, 7000);
        // message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    selectedFile,
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e.file.status == "removed") {
      // console.log("Remove event:", e);
      // handlerDropImage(e.file.uid);
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="submit-page-form"
      >
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
        {percent > 0 ? (
          <Progress
            type="line"
            percent={percent}
            strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
          />
        ) : (
          ""
        )}
        {/* <Form.Item className="form-submit-btn-item">
          <Button className="form-submit-btn" type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item> */}
      </Form>
    </div>
  );
}
