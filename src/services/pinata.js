import { message } from "antd";
import axios from "axios";

// handler image upload to pinata
export const handlerImageUpload = async (
  selectedFile,
  hashes,
  setHashes,
  setIsLoading,
  setPercent
) => {
  try {
    setIsLoading(true);
    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
    const uId = selectedFile.uid;
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
      setTimeout(() => {
        setPercent(0);
        setIsLoading(false);
      }, 4000);
    }

    setHashes([
      ...hashes,
      { uid: uId, cid: res.data.IpfsHash, meta: metaData },
    ]);

    console.log("hashes", hashes);
  } catch (error) {
    setIsLoading(false);
    console.log("while file uploading error" + error);
  }
};

// handler image drop from pinata
export const handlerDropImage = async (
  uId,
  hashes,
  setHashes,
  setIsLoading
) => {
  setIsLoading(true);
  const find = hashes.find((obj) => {
    return obj.uid === uId;
  });
  console.log("UID", uId);
  console.log("find", find);
  console.log("hases", hashes);

  const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (find) {
    const formData = new FormData();

    const res = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${find.cid}`,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    if (res.data == "OK") {
      console.log(hashes.filter((obj) => obj.cid == find.cid));
      setHashes(hashes.filter((obj) => obj.cid !== find.cid));
      setIsLoading(false);
      message.success(`file deleted successfully.`);
      console.log(res);
    }
  } else {
    setIsLoading(false);
    console.log("this file not available");
  }
};

export const handlerPinningJson = async (values, setIsLoading, setPercent) => {
  try {
    console.log("values", values);
    setIsLoading(true);
    const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

    const data = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: "testing",
        keyvalues: {
          customKey: "customValue",
          customKey2: "customValue2",
        },
      },
      pinataContent: values,
    };

    const options = {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": "application/json",
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
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      options
    );

    if (res.data.IpfsHash) {
      message.success("Json uploaded successfully : " + res.data.IpfsHash);
      setTimeout(() => {
        setPercent(0);
        setIsLoading(false);
      }, 4000);
    }
    return res.data.IpfsHash;
  } catch (error) {
    setIsLoading(false);
    console.log(error);
  }
};
