import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { getProfileImage } from "@/services/imageService";
import { UserDataType } from "@/types";
import { verticalScale } from "@/utils/styling";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from "expo-image";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

const ProfileModal = () => {
  const [userData,setUserData]=useState<UserDataType>({
    name:"",
    image:null
  })
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image 
            source={getProfileImage(null)}
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
            />
            <TouchableOpacity style={styles.editIcon}>
               <MaterialIcons
                  name="insert-photo"
                  size={verticalScale(20)}
                  color={colors.neutral500}
                />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Typo>Name</Typo>
            {/* <FormInput
            placeHolder="Enter your name"
            value={userData.name}
            onChangeText={()=>setUserData({...userData,name:value})}
            /> */}
          </View>
        </ScrollView>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  container: {},
  form: {
    marginTop: spacingY._15,
    gap: spacingY._30,
  },
  avatarContainer:{
    position:"relative",
    alignSelf:"center"
  },
  avatar:{
    alignSelf:"center",
    backgroundColor:colors.neutral400,
    height:verticalScale(135),
    width:verticalScale(135),
    borderWidth:1,
    borderRadius:200,
    borderColor:colors.neutral500
  },
  editIcon:{
    position:"absolute",
    bottom:spacingY._5,
    right:spacingY._7,
    padding:spacingY._7,
    borderRadius:100,
    backgroundColor:colors.neutral100,
    shadowColor:colors.black,
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.25,
    shadowRadius:10,
    elevation:4,
  },
  inputContainer:{
    marginTop:spacingY._15,
    gap:spacingY._10,
    marginHorizontal:widthPercentageToDP(5)
  }
});
