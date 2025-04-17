import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import LinkIcon from '../../assets/svg/Link';
import { useToast } from '../../context/ToastProvider';

export default function TeamInvationPage(props) {
    const { handleClose, teamData } = props;
    const [inviteLink, setInviteLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const showToast = useToast();
    const [qrWidth, setQrWidth] = useState(0);

    useEffect(() => {
        const generateShortLink = async () => {
            const longUrl = `https://win-e5oqtj6uhak.tailb0dc72.ts.net/share/post/13`;
            try {
                const response = await fetch(`https://clck.ru/--?url=${encodeURIComponent(longUrl)}`);
                const short = await response.text();
                if (!response.ok) throw new Error(short)
                setInviteLink(short);
            } catch (err) {
                navigation.navigate("Error");
                console.error("Ошибка при генерации ссылки", err);
            } finally {
                setLoading(false);
            }
        };

        generateShortLink();
    }, [teamData]);

    useEffect(() => {
        if (!loading && !inviteLink) {
            navigation.navigate("Error", { messageProp: "Не удалось сгенерировать ссылку" });
        }
    }, [loading, inviteLink]);

    const renderHeader = () => (
        <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Ссылка приглашение</Text>
            <View />
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                {renderHeader()}
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2C88EC" />
                    <Text>Загрузка кода...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <View style={styles.containerItem}>
                <Text style={styles.title}>С помощью этой ссылки можно подать заявку на вступление в команду</Text>
                <View
                    style={styles.qr__container}
                >
                    <View onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setQrWidth(width - 32);
                    }}
                        style={{ padding: 16 }}
                    >
                        {qrWidth > 0 && (
                            <QRCode value={inviteLink} size={qrWidth} backgroundColor={"#F2F2F7"} color={"#3E3E3E"} />
                        )}
                    </View>
                    <View style={{ rowGap: 14 }}>
                        <View style={styles.link__container}>
                            <LinkIcon />
                            <Text style={styles.link__text}>{inviteLink}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.qr__button}
                            onPress={() => {
                                Clipboard.setStringAsync(inviteLink)
                                showToast("Ссылка скопирована", "info");
                            }}
                        >
                            <Text style={styles.qr__button_text}>Копировать</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Pressable style={styles.button}>
                <Text style={styles.button__text}>Перейти к команде</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E5E5EA",
        padding: 16,
        flex: 1,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        rowGap: 12,
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 16,
        alignItems: "center"
    },
    header__title: {
        color: "#3E3E3E",
        fontSize: 20,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 25.2,
        letterSpacing: -0.6,
    },
    containerItem: {
        rowGap: 12,
        marginTop: 8,
        flex: 1
    },
    button: {
        backgroundColor: "#2C88EC",
        padding: 12,
        alignItems: "center",
        borderRadius: 12,
        marginBottom: 28,
    },
    button__text: {
        color: "#F2F2F7",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontFamily: "Sora700",
    },
    title: {
        color: "#3E3E3E",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 17.6,
        letterSpacing: -0.42,
        fontFamily: "Sora400",
    },
    qr__container: {
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 17,
        gap: 32,
    },
    link__container: {
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center"
    },
    link__text: {
        color: "#3E3E3E",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontFamily: "Sora700",
    },
    qr__button: {
        padding: 12,
        backgroundColor: "#2C88EC",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    qr__button_text: {
        color: "#F2F2F7",
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 17.6,
        letterSpacing: -0.42,
        fontFamily: "Sora400",
    },
});
