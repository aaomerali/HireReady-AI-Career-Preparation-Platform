import { storage } from "./config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (path: string) => {
  const storageRef = ref(storage, path);
  return await deleteObject(storageRef);
};
