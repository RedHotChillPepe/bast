import { useNavigation } from "@react-navigation/native";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import ChevronLeft from "../assets/svg/ChevronLeft";

const { width } = Dimensions.get("window");

const UniversalHeader = ({
  title = "",
  typography,
  handleClose = () => {
    console.log("back");
  },
  rightButton = <View style={{ width: 24 }} />,
}) => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const styles = makeStyle(theme, typography);

  const handleBack = () => {
    const canGoBack = navigation.canGoBack();
    if (canGoBack) {
      navigation.goBack();
      return;
    }

    handleClose();

    // navigation.navigate("Main");
  };

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        <Pressable onPress={handleBack}>
          <ChevronLeft />
        </Pressable>
      </View>

      <View style={styles.center}>
        <Text style={styles.header__title}>{title}</Text>
      </View>

      <View style={styles.side}>{rightButton}</View>
    </View>
  );
};

const makeStyle = (theme, title) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: theme.spacing.medium,
      position: "relative",
    },
    side: {
      // width: 48, // фиксированная ширина, чтобы зарезервировать место
      alignItems: "center",
      justifyContent: "center",
    },
    center: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 1,
      bottom: 0,
      pointerEvents: "none", // чтобы не мешало нажатиям на боковые кнопки
    },
    header__title: !title ? theme.typography.title3() : theme.typography[title],
  });

export default UniversalHeader;
