import Octicons from "@expo/vector-icons/Octicons";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../context/FavoritesContext";

import FastImage from "react-native-fast-image";
import { HeartIcon } from "../assets/svg/HeartIcon";
import { ShareIcon } from "../assets/svg/ShareIcon";
import { useShare } from "../context/ShareContext";

const { width } = Dimensions.get("window");

const HouseCard = ({
  item,
  navigation,
  itemWidth,
  isModal = false,
  handleSelected,
}) => {
  if (!item) return null;

  const { toggleFavorite, isFavorite } = useFavorites();

  const { sharePost } = useShare();

  const specList = [
    {
      valueName: "bedrooms",
      suffix: "-комн",
    },
    {
      valueName: "house_area",
      suffix: " м²",
    },
    {
      valueName: "num_floors",
      suffix: " эт",
    },
  ];

  const renderScpecList = (item) => {
    return (
      <View>
        <View style={styles.detailsRow}>
          {specList.map((spec, index) => {
            if (item[spec.valueName] == null || item[spec.valueName] === 0)
              return;
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 6,
                }}
                key={index}
              >
                <Text style={styles.detailsText}>
                  {item[spec.valueName]}
                  {spec.suffix}
                </Text>
                {index < specList.length - 1 && (
                  <Octicons name="dot-fill" size={12} color="black" />
                )}
              </View>
            );
          })}
        </View>
        <Text style={styles.addressText}>
          {item.city}, {item.full_address}
        </Text>
      </View>
    );
  };

  return (
    <Pressable
      style={{ width: itemWidth + 32 }}
      onPress={() =>
        isModal
          ? handleSelected(item.id)
          : navigation.navigate("House", { houseId: item.id })
      }
    >
      <View style={[styles.houseItem, { width: itemWidth }]}>
        <View style={styles.houseImageView}>
          {process.env.NODE_ENV === "development" ? (
            <Image style={styles.houseImage} source={{ uri: item.photos[0] }} />
          ) : (
            <FastImage
              style={[styles.houseImage]}
              source={{
                uri: item.photos[0],
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              resizeMode={FastImage.resizeMode.cover}
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
            {renderScpecList(item)}
            <View style={{ flexDirection: "row", columnGap: 16 }}>
              <TouchableOpacity onPress={() => sharePost(item)}>
                <ShareIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={styles.likeButton}
              >
                <HeartIcon color={isFavorite(item.id) ? "red" : "gray"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
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
    columnGap: 6,
    alignItems: "center",
  },
  detailsText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: 500,
    color: "#3E3E3E",
    fontFamily: "Sora500",
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
    alignItems: "flex-end",
  },
});

export default HouseCard;
