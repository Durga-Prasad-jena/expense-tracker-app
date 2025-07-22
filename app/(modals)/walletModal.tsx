import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import {
  createOrUpdateWalletData,
  deleteWalletById,
} from "@/services/walletServices";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const WalletModal = () => {
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUserData } = useAuth();
  const router = useRouter();

  const oldWallet: { name: string; id: string; image: string } =
    useLocalSearchParams();
  useEffect(() => {
    if (oldWallet.id) {
      setWallet({
        name: oldWallet?.name,
        image: oldWallet?.image,
      });
    }
  }, []);

  const handleDelete = async () => {
    if (!oldWallet?.id) return;
    setLoading(true)
    const res = await  deleteWalletById(oldWallet?.id);
   setLoading(false)
   if(res.success){
    Alert.alert("")
    router.back()
   }
  };

  const showDeleteAlert = () => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete\n This action will remove all the transction related to this alert",
      [
        {
          text: "Cancel",
          onPress: () => console.log("cancel"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: handleDelete,
          style: "destructive",
        },
      ]
    );
  };

  const handleUpdateWallet = async () => {
    const { name, image } = wallet;
    if (!name) {
      Alert.alert("Wallets", "Plase fill all the fields");
      return;
    }
    const data: WalletType = {
      name,
      image,
      uid: user?.uid,
    };
    if (oldWallet?.id) data.id = oldWallet?.id;
    setLoading(true);
    const res = await createOrUpdateWalletData(data);
    if (res.success) {
      updateUserData(user?.uid as string);
      setLoading(false);
      Alert.alert("Wallet", res.msg || "Wallet added successfully!");
      router.back();
    } else {
      Alert.alert("Update Error", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={oldWallet.id ? "Update Wallet" : "Add wallet"}
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.inputContainer}>
            <Typo>Name</Typo>
            <FormInput
              placeHolder="Name"
              value={wallet.name}
              onChangeText={(value) => setWallet({ ...wallet, name: value })}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo>Wallet Icon</Typo>
            <ImageUpload
              onSelect={(file) => setWallet({ ...wallet, image: file })}
              onClear={() => setWallet({ ...wallet, image: null })}
              file={wallet.image}
              placeHolder="Upload Image"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          {oldWallet?.id && (
            <Button
              onPress={showDeleteAlert}
              style={{
                paddingHorizontal: spacingY._12,
                backgroundColor: colors.rose,
              }}
            >
              <AntDesign name="delete" size={24} color={colors.white} />
            </Button>
          )}
          <Button
            loading={loading}
            onPress={handleUpdateWallet}
            style={{ width: oldWallet.id ? "84%" : "100%" }}
          >
            <Typo color={colors.neutral800} size={18} fontWeight={"700"}>
              {oldWallet.id ? "Update Wallet" : "Add wallet"}
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default WalletModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._10,
  },
  form: {
    marginTop: spacingY._15,
    gap: spacingY._30,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral400,
    height: verticalScale(135),
    width: verticalScale(135),
    borderWidth: 1,
    borderRadius: 200,
    borderColor: colors.neutral500,
  },
  editIcon: {
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    padding: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  inputContainer: {
    gap: spacingY._10,
    marginHorizontal: widthPercentageToDP(5),
  },
  footer: {
    gap: 10,
    display: "flex",
    flexDirection: "row",
    alignSelf: "center",
    bottom: 10,
    marginHorizontal: spacingX._15,
  },
});
