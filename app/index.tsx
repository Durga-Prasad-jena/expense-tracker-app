import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

const Index = () => {
  const router = useRouter();


  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/money-bag.png")}
        resizeMode="contain"
        style={styles.logo}
      />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
    width: 50,
  },
});
