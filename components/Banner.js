import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
const { width } = Dimensions.get("window");

const Banner = (props) => {
  const { openModal } = props;
  const { title, description, imageSrc } = props.bannerData;

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerImageView}>
        <Image style={styles.bannerImage} source={{ uri: imageSrc }} />
      </View>
      <View style={styles.bannerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.bannerButton}>
          <Button title="Подробнее" buttonHandle={() => openModal(props.bannerData)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginTop: 8,
    width: width - 32,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    marginLeft: 16,
    marginTop: 12,
  },
  bannerImageView: {
    height: 180,
  },
  bannerImage: {
    flex: 1,
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bannerContent: {
    padding: 16,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  bannerButton: {
    marginTop: 27,
  },
  textContainer: {
    width: "100%",
    flex: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: 14,
    color: "#3E3E3E",
  },
  description: {
    fontWeight: 400,
    fontSize: 12,
    color: "#3E3E3E",
  },
});

export default Banner;
