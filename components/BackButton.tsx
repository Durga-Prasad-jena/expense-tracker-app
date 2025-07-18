import { colors } from "@/constants/theme";
import { backButtonProps } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const BackButton = ({ iconsize = 26, style }: backButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.backBtn, style]}
    >
      <Ionicons name="chevron-back" size={iconsize} color={colors.white} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  backBtn: {
    backgroundColor: colors.neutral600,
    padding: wp(1),
    borderRadius: wp(3),
    alignSelf: "flex-start",
    borderCurve: "continuous",
    marginLeft: wp(4),
  },
});
