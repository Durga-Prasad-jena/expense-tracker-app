import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import WalletListItem from "@/components/WalletListItem";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const { user } = useAuth();
  const {
    data: wallets,
    error,
    loading,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);
  const router = useRouter();
  const getTotalBalance = () => {
    return wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);
  };
  return (
    <ScreenWrapper style={{ backgroundColor: "black" }}>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Typo color={colors.white} size={43} fontWeight={"500"}>
            ${getTotalBalance()?.toFixed(2)}
          </Typo>
          <Typo color={colors.neutral300}>Total balance</Typo>
        </View>
        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={"600"}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <AntDesign
                name="pluscircle"
                size={verticalScale(30)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyle}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
  },
  wrapper: {
    height: "20%",
    alignItems: "center",
  },
  wallets: {
    width: "100%",
    height: "80%",
    backgroundColor: colors.neutral700,
    borderTopLeftRadius: radius._30,
    borderTopRightRadius: radius._30,
    paddingHorizontal: spacingX._25,
    paddingVertical: spacingY._25,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
});
