import { Buffer } from "buffer";
import CryptoJS from "crypto-js";
import { MenuAction } from "../types";
import { AccessMenu } from "../types/login";

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

const createMenuSingle = (
  treeData: AccessMenu[],
  addIsLeaf?: boolean
): AccessMenu[] => {
  return treeData.reduce<AccessMenu[]>((acc, curr) => {
    const { children, ...rest } = curr;
    if (children) {
      const next = createMenuSingle(children, addIsLeaf);
      acc.push(rest, ...next);
    } else {
      if (addIsLeaf) {
        acc.push({ ...rest, isLeaf: true });
      } else {
        acc.push(rest);
      }
    }

    return acc;
  }, []);
};

const getMenuLeaf = (treeData: AccessMenu[]) => {
  const lists = createMenuSingle(treeData, true);
  return lists.filter((list) => list.isLeaf === true);
};

const getMenuAction = (
  pathname: string,
  treeData: AccessMenu[]
): MenuAction => {
  const initialVal = {
    slug: "",
    actions: {
      isRead: false,
      isCreate: false,
      isUpdate: false,
      isDelete: false,
    },
  };

  const dashboardVal = {
    slug: "dashboard",
    actions: {
      isRead: true,
      isCreate: true,
      isUpdate: true,
      isDelete: true,
    },
  };

  if (!pathname || !treeData) {
    return initialVal;
  }

  if (pathname === "/dashboard") {
    return dashboardVal;
  }

  if (treeData.length === 0) {
    return initialVal;
  }

  const menuList = createMenuSingle(treeData);
  const splited = pathname.split("/");
  const currentSlug = splited[splited.length - 1];
  const idx = menuList.findIndex((val) => val.slug === currentSlug);

  if (idx === -1) {
    return initialVal;
  }

  const currentMenu = menuList[idx];

  const actions = {
    isRead: currentMenu.actions.some((item) => item === "read"),
    isCreate: currentMenu.actions.some((item) => item === "create"),
    isUpdate: currentMenu.actions.some((item) => item === "update"),
    isDelete: currentMenu.actions.some((item) => item === "delete"),
  };

  return { slug: currentMenu.slug, actions };
};

export {
  encodeBase64,
  decodeBase64,
  encryptString,
  decryptString,
  encryptJson,
  decryptJson,
  downloadFile,
  createMenuSingle,
  getMenuLeaf,
  getMenuAction,
};
