import { Router } from "expo-router";
import { Timestamp } from "firebase/firestore";
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
  value?: string;
  multiline?:boolean
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
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  routeName?: any;
};

export type UserDataType = {
  name: string;
  image?: any;
};

export type WalletType = {
  id?: string;
  name: string;
  amount?: number;
  totalIncome?: number;
  totalExpenses?: number;
  image: any;
  uid?: string;
  created?: Date;
};
export type ImageUploadProps = {
  file?: any;
  onSelect: (file: any) => void;
  onClear: () => void;
  containerStyle?: ViewStyle;
  imageStyle?: ViewStyle;
  placeHolder?: string;
};

export interface WalletListItemProps {
  item: WalletType;
  index: number;
  router: Router;
}

export type TransactionListProps = {
  data: TransactionType[];
  title?: string;
  loading?: boolean;
  emptyListMessage?: string;
};

export type TransactionType = {
  id?: string;
  type: string;
  amount: number;
  category?: string;
  date: Date | Timestamp | string;
  description?: string;
  image?: string;
  uid?: string;
  walletId: string;
};

export type TransactionItemProps  = {
  index:number;
  handleClick:()=>void,
  item:TransactionType
}

export type ExpenseCategoryType = {
  [key:string]:CategoryType
}

export type CategoryType = {
  label:string;
  value:string;
  icon:any;
  bgColor:string
}
export type SelectModal = {value:string;label:string}[]



