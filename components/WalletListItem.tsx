import { colors, radius, spacingY } from "@/constants/theme";
import { WalletListItemProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Typo from "./Typo";

const WalletListItem = ({ item, index, router }: WalletListItemProps) => {
  const openWallet = () => {
    router.push({
      pathname: "/(modals)/walletModal",
      params: {
        id: item?.id,
        name: item?.name,
        image: item?.image,
      },
    });
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)
        .springify()
        .damping(18)}
    >
      <TouchableOpacity style={styles.container} onPress={openWallet}>
        <View style={styles.imageContainer}>
          <Image
            style={{ flex: 1 }}
            source={item?.image}
            contentFit="cover"
            transition={100}
          />
        </View>
        <View style={styles.nameContainer}>
          <Typo size={15} color={colors.white}>
            {item?.name}
          </Typo>
          <Typo size={14} color={colors.neutral400}>
            ${item?.amount}
          </Typo>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.neutral300} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WalletListItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._15,
  },
  imageContainer: {
    height: verticalScale(45),
    width: verticalScale(45),
    borderRadius: radius._15,
    borderWidth: 1,
    backgroundColor: colors.neutral700,
    overflow: "hidden",
  },
  nameContainer: {
    flex: 1,
    marginLeft: spacingY._5,
    gap: spacingY._5,
  },
});
