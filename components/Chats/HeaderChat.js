import React from 'react'
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from "../../assets/svg/ChevronLeft"
import { useTheme } from '../../context/ThemeContext';

export default function HeaderChat(props) {
    const { handleClose, title, online, isOwner = false } = props;
    const { theme } = useTheme();
    const styles = makeStyles(theme);

    return <View style={styles.header}>
        <Pressable onPress={handleClose}>
            <ChevronLeft />
        </Pressable>
        <View style={styles.info}>
            <Text style={styles.header__title}>{title}</Text>
            {online && <View style={styles.onlineDot} />}
        </View>
        {isOwner ?
            <TouchableOpacity style={styles.button}>
                <Text
                    numberOfLines={2}
                    style={styles.button__text}>Начать</Text>
                <Text
                    numberOfLines={2}
                    style={styles.button__text}>сделку</Text>
            </TouchableOpacity> : <View />
        }
    </View>
}

const makeStyles = (theme) => StyleSheet.create({
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        padding: theme.spacing.medium,
        alignItems: "center",
        backgroundColor: theme.colors.block,
        borderBottomWidth: 1,
    },
    header__title: {
        ...theme.typography.title3("text")
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'green',
        marginTop: 2,
    },
    button: {
        ...theme.buttons.buttonCustom(4, 8),
    },
    button__text: {
        ...theme.typography.buttonTextSmall,
    }
})
