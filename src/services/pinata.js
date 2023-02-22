import axios from "axios";
import { DateTime } from "luxon";

const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

// handler image upload to pinata
export const handlerImageUpload = async (selectedFile) => {
  try {
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
        console.log(`${loaded}kb of ${total}kb | ${percentage}%`);
      },
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      options
    );

    let hash;
    if (res.data.IpfsHash) {
      hash = { uid: uId, cid: res.data.IpfsHash, meta: metaData };
      return hash;
    }

    return false;
  } catch (error) {
    setIsLoading(false);
    console.log("while file uploading error" + error);
  }
};

// handler image drop from pinata
export const handlerDropImage = async (cid) => {
  if (cid) {
    const res = await axios.delete(
      `https://api.pinata.cloud/pinning/unpin/${cid}`,
      {
        maxBodyLength: "Infinity",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );

    if (res.data == "OK") {
      return cid;
    }
    return false;
  } else {
    console.log("this file not available");
  }
};

export const handlerPinningJson = async (payload) => {
  try {
    const fileName = `leaks-${DateTime.now().valueOf()}`;
    const data = {
      pinataOptions: {
        cidVersion: 1,
      },
      pinataMetadata: {
        name: fileName,
      },
      pinataContent: payload,
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
        console.log(`${loaded}kb of ${total}kb | ${percentage}%`);
      },
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      options
    );

    if (res && res.status === 200) {
      return res?.data?.IpfsHash;
    } else {
      return null;
    }
  } catch (error) {
    console.log(
      "ERROR something went wrong while uploading the file to IPFS",
      error
    );
    return null;
  }
};
