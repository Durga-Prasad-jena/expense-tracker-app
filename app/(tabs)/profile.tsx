import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { getProfileImage } from "@/services/imageService";
import { AccountOptionType } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { signOut } from "firebase/auth";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { widthPercentageToDP } from "react-native-responsive-screen";

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter()
  const handleLogout = async () => {
    await signOut(auth);
  };

  const accountOption: AccountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (
        <MaterialCommunityIcons
          name="face-man-profile"
          size={20}
          color={colors.neutral300}
        />
      ),
      routeName: "(modals)/profileModal",
      bgColor: "#6366f1",
    },
    {
      title: "Settings",
      icon: <Ionicons name="settings" size={20} color={colors.neutral300} />,
      // routeName: "/(modals)/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: (
        <MaterialCommunityIcons
          name="book-clock"
          size={20}
          color={colors.neutral300}
        />
      ),
      // routeName: "/(modals)/profileModal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: (
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color={colors.neutral300}
        />
      ),
      // routeName: "/(modals)/profileModal",
      bgColor: "#e11d48",
    },
  ];

  const showLogoutAlert = () =>{
    Alert.alert("Confirm","Are you sure you want to logout!",[
      {
        text:"cancel",
        style:"cancel"
      },
      {
        text:"logout",
        onPress:handleLogout,
        style:"destructive"
      }
    ])
  }

  const handlePress = async (item:AccountOptionType) =>{
    if(item.title === "Logout"){
      showLogoutAlert()
    }
    if(item.routeName)router.push(item.routeName)
  }

  return (
    <ScreenWrapper>
      <View style={styles.profileContainer}>
        <Header title="Profile" />
        <View style={styles.userInfo}>
          <View style={{ alignSelf: "center" }}>
            <Image
              contentFit="cover"
              transition={1000}
              style={styles.userImage}
              source={getProfileImage(user?.image)}
            />
          </View>
          <View style={styles.textContainer}>
            <Typo
              size={20}
              fontWeight={"700"}
              color={colors.white}
              style={{ textAlign: "center" }}
            >
              {user?.name}
            </Typo>
            <Typo size={15} fontWeight={"200"} color={colors.white}>
              {" "}
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}

        <View style={styles.accountoptions}>
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(14)}
                key={index}
                style={[styles.listitem]}
              >
                <TouchableOpacity  onPress={()=>handlePress(item)} style={styles.wrapper}>
                  <View
                    style={[styles.leftIcon, { backgroundColor: item.bgColor }]}
                  >
                    {item.icon}
                  </View>
                  <Typo size={16} fontWeight={"500"} style={{ flex: 1 }}>
                    {item.title}
                  </Typo>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.neutral300}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
      {/* <Button onPress={handleLogout}>
        <Typo>logout</Typo>
      </Button> */}
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(5),
  },
  userInfo: {
    alignSelf: "center",
    marginTop: widthPercentageToDP(18),
  },
  textContainer: {
    alignSelf: "center",
    gap: widthPercentageToDP(3),
  },
  userImage: {
    width: widthPercentageToDP(30),
    height: widthPercentageToDP(30),
    borderRadius: widthPercentageToDP(30),
    backgroundColor: colors.textLight,
  },
  accountoptions: {
    marginTop: widthPercentageToDP(6),
  },
  listitem: {
    marginBottom: widthPercentageToDP(3),
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthPercentageToDP(5),
  },
  leftIcon: {
    width: widthPercentageToDP(10),
    height: widthPercentageToDP(10),
    backgroundColor: colors.neutral500,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: widthPercentageToDP(3),
    borderCurve: "continuous",
  },
});
