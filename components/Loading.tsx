import { colors } from "@/constants/theme";
import { activityIndicatorProps } from "@/types";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const Loading = ({
  size = "large",
  color = colors.primaryDark,
}: activityIndicatorProps) => {
  return (
    <View style={{
     flex:1,
     justifyContent:"center",
     alignItems:"center",

    }}>
     <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
