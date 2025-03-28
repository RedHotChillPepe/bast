import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "../Button";

const { width } = Dimensions.get("window");

const Banner = (props) => {
  const { openModal } = props;
  const { title, description, imageSrc, rating } = props.bannerData;

  // Если в данных есть поле likes, используем его, иначе начинаем с 0
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(props.bannerData.likes || 0);

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
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>Рейтинг: {rating ? rating.toFixed(1) : "0.0"}</Text>
            <Pressable onPress={handleLikePress} style={styles.likeButton}>
              <MaterialIcons
                name={isLiked ? "favorite" : "favorite-border"}
                size={20}
                color={isLiked ? "red" : "#007AFF"}
              />
              <Text style={styles.likesCount}>{likes}</Text>
            </Pressable>
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center"
  },
  textContainer: {
    width: "100%",
    flex: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 14,
    color: "#3E3E3E",
  },
  description: {
    fontWeight: "400",
    fontSize: 12,
    color: "#3E3E3E",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#3E3E3E",
    marginRight: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    fontSize: 14,
    color: "#3E3E3E",
    marginLeft: 4,
  },
});

export default Banner;
