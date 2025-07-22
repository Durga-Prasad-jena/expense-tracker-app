import { firestore } from "@/config/firebase";
import { responseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { uploadFileToCloudnary } from "./imageService";

export const createOrUpdateWalletData = async (
  walletData: Partial<WalletType>
): Promise<responseType> => {
  try {
    let walletToSave = { ...walletData };
    if (walletData.image) {
      const imageUploadRes = await uploadFileToCloudnary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }
    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.totalIncome = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export const deleteWalletById = async (
  walletId: string
): Promise<responseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteDoc(walletRef);
    return { success: true, msg: "Wallet Deleted Successfully" };
  } catch (error: any) {
    return { success: false, msg: error?.message };
  }
};
