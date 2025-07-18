import { colors } from "@/constants/theme";
import { inputProps } from "@/types";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import {
     heightPercentageToDP,
     widthPercentageToDP,
} from "react-native-responsive-screen";

const FormInput = (props: inputProps) => {
  return (
    <View
      style={[styles.container, props.containerStyle && props.containerStyle]}
    >
      {props.icon && props.icon}
      <TextInput
        placeholder={props.placeHolder}
        placeholderTextColor={colors.neutral400}
        style={[styles.input, props.inputStyle]}
        ref={props.inputRef && props.inputRef}
        onChangeText={props.onChangeText}
         secureTextEntry={props.secureTextEntry}
        {...props}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: heightPercentageToDP(6),
    borderWidth: widthPercentageToDP(0.1),
    borderColor: colors.neutral300,
    borderRadius: widthPercentageToDP(3),
    alignItems: "center",
    paddingHorizontal: widthPercentageToDP(2),
  },
  input: {
    flex: 1,
    fontSize: widthPercentageToDP(4),
    color: colors.white,
  },
});
