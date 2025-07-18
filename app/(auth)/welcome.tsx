import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const Welcome = () => {
     const router = useRouter()
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button and welcome image  */}
        <View>
          <TouchableOpacity onPress={()=>router.push("/(auth)/Login")} style={styles.signUpBtn}>
            <Typo fontWeight={"500"}>signin</Typo>
          </TouchableOpacity>
          <View style={{ alignSelf: "center" }}>
            <Animated.Image
              entering={FadeIn.duration(1000)}
              style={styles.image}
              source={require("../../assets/images/money-bag.png")}
              resizeMode="contain"
            />
          </View>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.duration(1000)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              Finances must be arranged to set a better
            </Typo>
            <Typo size={17} color={colors.textLight}>
              Life style in future
            </Typo>
          </Animated.View>
        </View>

        {/* button section */}
        <Animated.View
            entering={FadeInDown.duration(1000)
              .springify()
              .damping(12)}
           style={styles.buttonContainer}>
          <Button 
          onPress={()=>router.push("/(auth)/Register")}
          >
            <Typo fontWeight={"900"} color={colors.neutral900} size={22}>
              Get started
            </Typo>
          </Button>
      </Animated.View>
        </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:wp(5)
  },
  signUpBtn: {
    alignItems: "flex-end",
  },
  image: {
    width: wp(100),
    height: hp(60),
  },
  footer: {
     marginTop:wp(10),
  },
  buttonContainer: {},
});
