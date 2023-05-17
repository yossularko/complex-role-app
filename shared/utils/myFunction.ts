import { Buffer } from "buffer";
import CryptoJS from "crypto-js";

const secretKey = process.env.app_secret as string;

const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString("base64");
};
const decodeBase64 = (data: string) => {
  return Buffer.from(data, "base64").toString("ascii");
};

const encryptString = (message: string) => {
  try {
    const encJson = CryptoJS.AES.encrypt(message, secretKey).toString();
    const encData = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encJson)
    );
    return encData;
  } catch (error) {
    console.log("error encrypt: ", error);
    return "";
  }
};

const decryptString = (ciphertext: string) => {
  try {
    const decData = CryptoJS.enc.Base64.parse(ciphertext).toString(
      CryptoJS.enc.Utf8
    );
    const bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    return bytes;
  } catch (error) {
    console.log("error decrypt: ", error);
    return "";
  }
};

const encryptJson = (jsonData: any) => {
  try {
    const encJson = CryptoJS.AES.encrypt(
      JSON.stringify(jsonData),
      secretKey
    ).toString();
    const encData = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encJson)
    );
    return encData;
  } catch (error) {
    console.log("error encrypt: ", error);
    return "";
  }
};

const decryptJson = (ciphertext: string) => {
  try {
    const decData = CryptoJS.enc.Base64.parse(ciphertext).toString(
      CryptoJS.enc.Utf8
    );
    const bytes = CryptoJS.AES.decrypt(decData, secretKey).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(bytes);
  } catch (error) {
    console.log("error decrypt: ", error);
    return null;
  }
};

const downloadFile = (data: Blob, filename: string) => {
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.download = filename;
  document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
  a.click();

  // cleane up
  // window.URL.revokeObjectURL(url);
  // document.removeChild(a);

  // or another clean up
  a.remove(); //afterwards we remove the element again
};

export {
  encodeBase64,
  decodeBase64,
  encryptString,
  decryptString,
  encryptJson,
  decryptJson,
  downloadFile,
};
