import { colors, spacingY } from "@/constants/theme";
import { modalWrapperProps } from "@/types";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const isIos = Platform.OS === "ios";
const ModalWrapper = ({ children, bg = colors.neutral800, style }: modalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style && style]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
     flex:1,
     paddingTop:isIos ? spacingY._15 : 50,
     paddingBottom: isIos ? spacingY._20 : spacingY._10
  },
});
