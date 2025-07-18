import { colors } from "@/constants/theme";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function MyTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {

  const tabbarIcons: any = {
    home: (isFocused: boolean) => (
      <MaterialCommunityIcons
        name="home-analytics"
        size={20}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    profile: (isFocused: boolean) => (
      <Feather
        name="user"
        size={20}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    wallet: (isFocused: boolean) => (
      <MaterialIcons
        name="wallet"
        size={20}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
    statitics: (isFocused: boolean) => (
      <Entypo
        name="bar-graph"
        size={20}
        color={isFocused ? colors.primary : colors.neutral400}
      />
    ),
  };
  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
             {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            <Text style={{ color: isFocused ? colors.primary : colors.neutral400 }}>
              {label}
            </Text>
           
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: widthPercentageToDP(100),
    height:
      Platform.OS === "ios" ? widthPercentageToDP(20) : widthPercentageToDP(15),
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.neutral800,
  },
  tabbarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:
      Platform.OS == "ios" ? widthPercentageToDP(5) : widthPercentageToDP(2),
  },
});
