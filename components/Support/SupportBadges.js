import { Image, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function SupportBadges({ openSupportModal }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: theme.colors.block,
        padding: theme.spacing.medium,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 12,
        borderRadius: 12,
        marginHorizontal: theme.spacing.medium,
      }}
      onPress={openSupportModal}
    >
      <Image
        source={require("../../assets/support-icon.png")}
        style={{ width: 32, height: 32, borderRadius: 4 }}
      />
      <View>
        <Text style={[theme.typography.title3(), { textAlign: "left" }]}>
          Поддержка БАСТ
        </Text>
        <Text style={[theme.typography.regular(), { textAlign: "left" }]}>
          Будем рады помочь
        </Text>
      </View>
    </TouchableOpacity>
  );
}
