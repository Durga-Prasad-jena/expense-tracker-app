import { colors, radius } from "@/constants/theme";
import { getImagePath } from "@/services/imageService";
import { ImageUploadProps } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const ImageUpload = ({
  file = null,
  onClear,
  onSelect,
  containerStyle,
  imageStyle,
  placeHolder = "",
}: ImageUploadProps) => {
  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        // allowsEditing: true,
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
      });

      if (!res.canceled) {
        onSelect(res.assets[0]);
      }
    } catch (error) {
      alert(error)
    }
  };
  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={handlePickImage}
          style={[styles.inputContainer, containerStyle && containerStyle]}
        >
          <Entypo
            name="upload"
            size={verticalScale(30)}
            color={colors.neutral300}
          />
          <Typo>{placeHolder}</Typo>
        </TouchableOpacity>
      )}
      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            source={getImagePath(file)}
            contentFit="cover"
            style={{
              display: "flex",
              height: verticalScale(135),
              width: verticalScale(135),
            }}
            transition={100}
          />
          <TouchableOpacity style={styles.deleteImage} onPress={onClear}>
            <Entypo
              name="circle-with-cross"
              size={verticalScale(30)}
              color={colors.rose}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: verticalScale(54),
    flexDirection: "row",
    backgroundColor: colors.neutral700,
    gap: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: colors.neutral500,
    borderStyle: "dashed",
    borderRadius: radius._15,
  },
  image: {
    backgroundColor: colors.neutral400,
    height: verticalScale(135),
    width: verticalScale(135),
    position: "relative",
    borderWidth: 1,
    borderRadius: radius._15,
    borderColor: colors.neutral500,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deleteImage: {
    position: "absolute",
    top: scale(6),
    right: scale(6),
    shadowColor:colors.black,
    shadowOffset:{width:0,height:5},
    shadowOpacity:1,
    shadowRadius:10
  },
});
