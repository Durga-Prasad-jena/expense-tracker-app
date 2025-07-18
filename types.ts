import React, { ReactNode } from "react";
import { TextInput, TextProps, TextStyle, ViewStyle } from "react-native";

export type screenWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};
export type modalWrapperProps = {
  style?: ViewStyle;
  children: React.ReactNode;
  bg?: string;
};

export type typoProps = {
  size?: number;
  color?: string;
  fontWeight?: TextStyle["fontWeight"];
  children: any | null;
  style?: TextStyle;
  textProps?: TextProps;
};

export type customButtonProps = {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
};

export type activityIndicatorProps = {
  size?: number | "large" | "small";
  color?: string;
};

export type backButtonProps = {
  iconsize?: number;
  style?: ViewStyle;
};

export type inputProps = {
  icon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  inputRef?: React.RefObject<TextInput>;
  placeHolder?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  value?:string
};

export type userType = {
  uid?: string;
  email?: string | null;
  name: string | null;
  image?: any;
} | null;

export type AuthContextType = {
  user: userType;
  setUser: Function;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; msg?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; msg?: string }>;
  updateUserData: (userId: string) => Promise<void>;
};

export type responseType = {
  success: boolean;
  data?: any;
  msg?: string;
};

export type HeaderProps = {
  style?: ViewStyle;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  title?: string;
};

export type AccountOptionType = {
  title:string,
  icon:React.ReactNode;
  bgColor:string;
  routeName?:any
}

export type UserDataType = {
  name:string;
  image?:any
}

