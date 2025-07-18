import { colors } from "@/constants/theme";
import { screenWrapperProps } from "@/types";
import React from "react";
import { Dimensions, Platform, StatusBar, View } from "react-native";

const { height } = Dimensions.get("window");

const ScreenWrapper = ({ style, children }: screenWrapperProps) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 10;
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.neutral900,
          paddingTop,
        },
        style,
      ]}
    >
      {children}
      <StatusBar barStyle={"light-content"}/>
    </View>
  );
};

export default ScreenWrapper;
