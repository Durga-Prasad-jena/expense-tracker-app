import { HeaderProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {title && <Typo  size={19} style={{
          textAlign:'center',
          width:leftIcon ? "82%" : "100%"
      }}>{title}</Typo>}
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
     alignItems:"center",
     flexDirection:"row",
     width:"100%"
  },
  leftIcon: {
     alignSelf:"flex-start"
  },
  rightIcon: {
     alignSelf:"flex-end"
  },
});
