import { firestore } from "@/config/firebase";
import { responseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudnary } from "./imageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<responseType> => {
  try {
    if (updatedData.image && updatedData?.image?.uri) {
      const imageUploadRes = await uploadFileToCloudnary(
        updatedData.image,
        "users"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload image",
        };
      }
      updatedData.image = imageUploadRes.data;
    }
    const useRef = doc(firestore, "users", uid);
    await updateDoc(useRef, updatedData);
    return { success: true, msg: "User Updated Successfully!" };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};
