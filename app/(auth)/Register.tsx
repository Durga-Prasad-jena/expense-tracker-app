import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");

  const { register: registerUser } = useAuth();

  const handleLogin = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("login", "Please fill all fields");
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    if (!res.success) {
      Alert.alert("Signup", res.msg);
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconsize={28} />
        <View style={styles.textWrapper}>
          <Typo size={30} fontWeight={"800"}>
            {" "}
            Lets
          </Typo>
          <Typo size={28} fontWeight={"800"}>
            {" "}
            Get started
          </Typo>
        </View>
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Register now to track all your expenses
          </Typo>
          <View style={{ marginTop: wp(5), gap: widthPercentageToDP(5) }}>
            <FormInput
              onChangeText={(value) => (nameRef.current = value)}
              placeHolder="Enter your name"
              icon={
                <AntDesign name="user" size={20} color={colors.neutral300} />
              }
            />
            <FormInput
              onChangeText={(value) => (emailRef.current = value)}
              placeHolder="Enter your email"
              icon={
                <MaterialCommunityIcons
                  name="email-lock"
                  size={20}
                  color={colors.neutral300}
                />
              }
            />
            <FormInput
              onChangeText={(value) => (passwordRef.current = value)}
              placeHolder="Enter your password"
              secureTextEntry={true}
              icon={
                <MaterialCommunityIcons
                  name="onepassword"
                  size={20}
                  color={colors.neutral300}
                />
              }
            />

            <Button loading={isLoading} onPress={handleLogin}>
              <Typo color={colors.neutral700} fontWeight={"900"} size={20}>
                Register
              </Typo>
            </Button>
          </View>
          <View style={styles.footer}>
            <Typo size={16}>Already have an account?</Typo>
            <Pressable onPress={() => router.push("/(auth)/Login")}>
              <Typo fontWeight={"700"} color={colors.primary} size={17}>
                login
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(4),
    marginTop: wp(3),
  },
  textWrapper: {
    marginTop: wp(35),
    gap: wp(1),
  },
  form: {
    marginTop: wp(5),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp(4),
  },
});
