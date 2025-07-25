import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import FormInput from "@/components/FormInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import {
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const { login: loginUser } = useAuth();
  const router = useRouter()

  const handleLogin = async () => {
    try {
      if (!emailRef.current || !passwordRef.current) {
        Alert.alert("login", "Please fill all fields");
        return;
      }
      setIsLoading(true)
      const res = await loginUser(emailRef.current, passwordRef.current);
      setIsLoading(false)
      if (!res.success) {
        Alert.alert("Login", res.msg);
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      alert(error)
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconsize={28} />
        <View style={styles.textWrapper}>
          <Typo size={30} fontWeight={"800"}>
            {" "}
            Hey!
          </Typo>
          <Typo size={28} fontWeight={"800"}>
            {" "}
            Welcome back
          </Typo>
        </View>
        <View style={styles.form}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <View style={{ marginTop: wp(5), gap: widthPercentageToDP(5) }}>
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
            <Typo
              size={14}
              color={colors.text}
              style={{ alignSelf: "flex-end" }}
            >
              Forgot password?
            </Typo>
            <Button loading={isLoading} onPress={handleLogin}>
              <Typo color={colors.neutral700} fontWeight={"900"} size={20}>
                Login
              </Typo>
            </Button>
          </View>
          <View style={styles.footer}>
            <Typo size={16}>Dont have an account?</Typo>
            <Pressable onPress={() => router.push("/(auth)/Register")}>
              <Typo fontWeight={"700"} color={colors.primary} size={17}>
                signup
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: spacingX._15,
  },
  textWrapper: {
    marginTop:spacingY._60,
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
