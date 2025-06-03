import { Image, StyleSheet, Text, View } from "react-native";
import DotIcon from "../../assets/svg/Dot";

export default function ChatCard({
  post,
  lastMessage = "",
  searchValue,
  isModal = false,
  initials,
  isPined = false,
  opponentUser = {},
}) {
  // Функция для выделения совпадающей части
  const highlightMatch = (text) => {
    if (!searchValue) return text;

    const regex = new RegExp(`(${searchValue})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text key={index} style={styles.highlightedText}>
          {part}
        </Text>
      ) : (
        <Text key={index}>{part}</Text>
      )
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          padding: isModal ? 0 : 16,
          borderBottomWidth: isModal ? 0 : 1,
          backgroundColor: isPined ? "#FFF" : "#E5E5EA",
        },
      ]}
    >
      <View style={styles.postContainer}>
        <Image
          style={[
            styles.post__image,
            {
              width: isModal ? 87 : 78,
              aspectRatio: isModal ? 87.15 / 56 : 39 / 25,
            },
          ]}
          source={
            opponentUser.status == -1
              ? require("../../assets/deleted_user.jpg")
              : post?.photos?.[0]
              ? { uri: post.photos[0] }
              : require("../../assets/placeholder.png")
          }
        />
        <View style={styles.post__info}>
          <Text style={styles.post__price}>
            {opponentUser.status == -1 ? "Удаленый пользователь" : initials}
          </Text>
          {opponentUser.status !== -1 && (
            <View
              style={[
                styles.post__caption,
                {
                  flexDirection: isModal ? "column" : "row",
                  alignItems: isModal ? "baseline" : "center",
                },
              ]}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.caption__text, styles.addressText]}
              >
                {post.city}, {post.full_address}
              </Text>
              {!isModal && <DotIcon />}
              <Text style={styles.caption__text}>
                {Number(post.price).toLocaleString("ru-RU")} ₽
              </Text>
            </View>
          )}
          {lastMessage.length > 0 && (
            <Text style={styles.message__text}>
              {highlightMatch(lastMessage[0].message)}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    borderColor: "#808080",
  },
  postContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    alignSelf: "stretch",
  },
  post__image: {
    borderRadius: 4,
    width: "100%",
  },
  post__info: {
    flexDirection: "column",
    flex: 1,
  },
  post__price: {
    color: "#0A0F09",
    fontFamily: "Sora700",
    letterSpacing: -0.43,
    fontWeight: 600,
    lineHeight: 22,
    fontSize: 17,
  },
  post__location: {
    color: "#0A0F09",
    fontFamily: "Sora500",
    fontWeight: 500,
    lineHeight: 16,
    fontSize: 12,
  },
  post__caption: {
    columnGap: 8,
    rowGap: 4,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  addressText: {
    flexShrink: 1,
  },
  caption__text: {
    color: "#808080",
    fontFamily: "Sora400",
    letterSpacing: 0.06,
    fontWeight: 400,
    lineHeight: 16,
    fontSize: 12,
  },
  message__text: {
    color: "#808080",
    fontFamily: "Sora500",
    letterSpacing: -0.36,
    fontWeight: 400,
    lineHeight: 16,
    fontSize: 12,
    marginTop: 8,
  },
  highlightedText: {
    backgroundColor: "yellow",
    fontWeight: "bold",
  },
});
