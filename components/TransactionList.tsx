//import liraries
import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingY } from "@/constants/theme";
import { TransactionItemProps, TransactionListProps, TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Loading from "./Loading";
import Typo from "./Typo";

// create a component
const TransactionList = ({
  data,
  emptyListMessage,
  loading,
  title,
}: TransactionListProps) => {
  const router = useRouter()
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        image: item?.image,
        amount: item?.amount.toString(),
        description: item?.description,
        type: item?.type,
        category: item?.category,
        walletId: item?.walletId,
        date: (item.date as Timestamp).toDate()?.toISOString(),
        uid: item?.uid
      }
    })
  };
  return (
    <View style={styles.container}>
      {title && (
        <Typo fontWeight={"bold"} size={18}>
          {title}
        </Typo>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <TransactionItem
                item={item}
                index={index}
                handleClick={()=>handleClick(item)}
              />
            );
          }}
          estimatedItemSize={200}
        />
      </View>
      {!loading && data.length === 0 && (
        <Typo
          size={15}
          color={colors.neutral500}
          fontWeight={"600"}
          style={{ alignSelf: "center" }}
        >
          {emptyListMessage}
        </Typo>
      )}

      {loading && (
        <View style={{ marginTop: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

//transaction item component
const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {


  let category = item.type == "income" ? incomeCategory : expenseCategories[item.category!]
  const IconComponent = category.icon;
  const date = (item.date as Timestamp).toDate().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short"
  })
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={handleClick} >
        <View style={[styles.leftSection]}>
          <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
            <View>
              {IconComponent && (
                <Image
                  source={IconComponent}
                  style={styles.imageIcon}
                  tintColor={colors.white}

                />
              )}
            </View>
          </View>
          <View>
            <Typo size={14} color={colors.neutral300} fontWeight={"700"}>
              {category.label}
            </Typo>
            <Typo size={12} color={colors.neutral500} fontWeight={"600"}>
              {item?.description}
            </Typo>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Typo size={16} color={item.type == "income" ? colors.primary : colors.rose}>
            {`${item.type == "income" ? " + $" : "- $"}`}{item.amount}
          </Typo>
          <Typo size={12} color={colors.neutral500}>{date}</Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    gap: spacingY._12,
  },
  list: {
    minHeight: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacingY._12,
    justifyContent: "space-between",
    gap: spacingY._10,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._10,
  },
  icon: {
    width: verticalScale(43),
    height: verticalScale(43),
    borderRadius: radius._10,
    borderCurve: "continuous",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    width: verticalScale(20),
    height: verticalScale(20),
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

//make this component available to the app
export default TransactionList;
