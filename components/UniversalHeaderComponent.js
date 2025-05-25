import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import ChevronLeft from "../assets/svg/ChevronLeft"

const UniversalHeader = ({ title = "", handleClose = () => { console.log("back") }, rightButton = <View /> }) => {
    const navigation = useNavigation();

    const { theme } = useTheme();
    const styles = makeStyle(theme);

    const handleBack = () => {
        const canGoBack = navigation.canGoBack();
        if (canGoBack) {
            navigation.goBack();
            return
        };

        handleClose();

        // navigation.navigate("Main");
    }

    return <View style={styles.header}>
        <Pressable onPress={handleBack}>
            <ChevronLeft />
        </Pressable>
        <Text style={styles.header__title}>{title}</Text>
        {rightButton}
    </View >
}

const makeStyle = (theme) => StyleSheet.create({
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: theme.spacing.medium,
        alignItems: "center",
    },
    header__title: theme.typography.title3(),
});

export default UniversalHeader;