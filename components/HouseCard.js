import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";

import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

const HouseCard = ({ item, navigation, itemWidth, isModal = false, handleSelected }) => {
  if (!item) return null;

  return (
    <Pressable
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
    // borderColor: '#54545630',
    // borderWidth: 1,
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
    color: "#32322C",
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: "600",
    marginTop: 16,
    marginLeft: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  pricePerSquare: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    opacity: 0.6,
    marginLeft: 12,
    fontWeight: "400",
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 4,
    marginLeft: 12,
    alignItems: "center",
  },
  detailsText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.45,
    fontWeight: "500",
  },
  addressText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    opacity: 0.6,
    marginLeft: 12,
    fontWeight: "400",
    marginTop: 12,
    marginBottom: 12,
  },
});

export default HouseCard;
