import { colors } from "@/constants/theme";
import { customButtonProps } from "@/types";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Loading from "./Loading";
const Button = ({ style, children, onPress, loading }: customButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.btnContain,{backgroundColor:"transparent"}]}>
        <Loading size={"large"} color={colors.primary} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={[styles.btnContain, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btnContain: {
    height: hp(7),
    backgroundColor: colors.primary,
    marginTop: wp(8),
    justifyContent:"center",
    alignItems:"center",
    borderRadius:wp(4),

  },
});
