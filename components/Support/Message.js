import { Image, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import CheckAllIcon from "../../assets/svg/CheckAll";

export default function Message({ message }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: message.isMe ? "row-reverse" : "row",
        columnGap: 8,
        paddingVertical: 16,
      }}
    >
      <Image
        style={{ width: 42, height: 42, borderRadius: 100 }}
        source={message.avatar}
      />
      <View style={{ rowGap: 8, maxWidth: 200 }}>
        <Text
          style={[
            theme.typography.regularBold,
            { textAlign: message.isMe ? "right" : "left" },
          ]}
        >
          {message.senderName}
        </Text>
        <View
          style={{
            backgroundColor: theme.colors.block,
            padding: 12,
            borderRadius: 12,
          }}
        >
          <Text style={[theme.typography.regular(), { textAlign: "left" }]}>
            {message.text}
          </Text>
        </View>
      </View>
      <View
        style={{
          alignItems: "flex-end",
          flexDirection: message.isMe ? "row-reverse" : "row",
          columnGap: 4,
        }}
      >
        <Text style={theme.typography.caption}>{message.time}</Text>
        <CheckAllIcon
          color={message.read ? theme.colors.accent : theme.colors.caption}
        />
      </View>
    </View>
  );
}
