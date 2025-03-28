import { MaterialIcons } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";

import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

const HouseCard = ({ item, navigation, itemWidth, isModal = false, handleSelected }) => {
  if (!item) return null;

  // Если в данных есть поле likes, используем его, иначе начинаем с 0
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  const handleLikePress = () => {
    // При нажатии переключаем состояние лайка и обновляем число лайков
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Pressable
      style={{ width: itemWidth + 32 }}
      onPress={() => !isModal ? navigation.navigate("House", { houseId: item.id }) : handleSelected(item.id)}
    >
      <View style={[styles.houseItem, { width: itemWidth }]}>
        <View style={styles.houseImageView}>
          {process.env.NODE_ENV == "development" ? (
            <Image style={styles.houseImage} source={{ uri: item.photos[0] }} />
          ) : (
            <FastImage
              style={[styles.houseImage]}
              source={{ uri: item.photos[0] }}
            />
          )}
        </View>
        <View>
          <View style={styles.priceRow}>
            <Text style={styles.houseItemText}>
              {(item.price != null) & (item.price != undefined) &&
                item.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              ₽
            </Text>
            <Text style={styles.pricePerSquare}>
              {Math.floor(item.price / item.house_area)}₽/м²
            </Text>
          </View>
          <View style={styles.addressContainer}>
            <View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsText}>{item.bedrooms}-комн </Text>
                <Octicons name="dot-fill" size={12} color="black" />
                <Text style={styles.detailsText}> {item.house_area} м² </Text>
                <Octicons name="dot-fill" size={12} color="black" />
                <Text style={styles.detailsText}> {item.num_floors} эт</Text>
              </View>
              <Text style={styles.addressText}>
                {item.city}, {item.full_address}
              </Text>
            </View>
            <Pressable onPress={handleLikePress} style={styles.likeButton}>
              <MaterialIcons
                name={isLiked ? "favorite" : "favorite-border"}
                size={28}
                color={isLiked ? "red" : "#007AFF"}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable >
  );
};

const styles = StyleSheet.create({
  houseItem: {
    borderRadius: 20,
    backgroundColor: "#FFF",
    marginTop: 12,
    alignSelf: "center",
  },
  houseImageView: {
    height: 180,
  },
  houseImage: {
    flex: 1,
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  houseItemText: {
    color: "#3E3E3E",
    fontSize: 22,
    fontFamily: "Sora700",
    lineHeight: 28,
    letterSpacing: -0.26,
    fontWeight: 700,
    marginTop: 8,
    marginLeft: 16,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pricePerSquare: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.31,
    color: "#808080",
    fontFamily: "Sora400",
    marginLeft: 8,
    fontWeight: 400,
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 4,
    columnGap: 2,
    alignItems: "center",
  },
  detailsText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: 500,
    color: "#3E3E3E",
    fontFamily: "Sora500"
  },
  addressText: {
    fontSize: 12,
    color: "#808080",
    fontFamily: "Sora400",
    lineHeight: 16,
    letterSpacing: -0.23,
    fontWeight: 400,
  },
  addressContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "flex-end"
  },
});

export default HouseCard;
