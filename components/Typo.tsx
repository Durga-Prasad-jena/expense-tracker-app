import { colors } from "@/constants/theme";
import { typoProps } from "@/types";
import React from "react";
import { Text, TextStyle } from "react-native";

const Typo = ({
  size,
  color = colors.text,
  children,
  textProps = {},
  fontWeight = "400",
  style,
}: typoProps) => {
  const textStyle: TextStyle = {
    color,
    fontWeight,
    fontSize: size,
  };
  return (
    <Text style={[style, textStyle]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
