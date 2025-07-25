import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imageService";
import { updateUser } from "@/services/userService";
import { UserDataType } from "@/types";
import { verticalScale } from "@/utils/styling";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const ProfileModal = () => {
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUserData } = useAuth();
  const router = useRouter();


  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    });
  }, [user]);

  const handleUpdateUser = async () => {
    const { name } = userData;
    if (!name) {
      Alert.alert("User", "Plase fill all the fields");
      return;
    }
    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    if (res.success) {
      updateUserData(user?.uid as string);
      setLoading(false);
      Alert.alert("Update", res.msg);
      router.back();
    } else {
      Alert.alert("Update Error", res.msg);
    }
  };

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
      });

      if (!res.canceled) {
        setUserData({ ...userData, image: res.assets[0] });
      }
    } catch (error) {
      alert(error)
    }
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image
              source={getProfileImage(userData?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
              <MaterialIcons
                name="insert-photo"
                size={verticalScale(20)}
                color={colors.neutral500}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo>Name</Typo>
            <FormInput
              placeHolder="Enter your name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button loading={loading} onPress={handleUpdateUser}>
            <Typo color={colors.neutral800} size={18} fontWeight={"700"}>
              Update User
            </Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
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
    marginTop: spacingY._15,
    gap: spacingY._10,
    marginHorizontal: widthPercentageToDP(5),
  },
  footer: {
    position: "absolute",
    width: "88%",
    alignSelf: "center",
    bottom: 10,
    marginHorizontal: spacingX._15,
  },
});
