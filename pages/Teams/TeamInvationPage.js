import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useRef, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import QRCode from 'react-native-qrcode-svg';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import LinkIcon from '../../assets/svg/Link';
import Loader from '../../components/Loader';
import { useApi } from '../../context/ApiContext';

export default function TeamInvationPage(props) {
    const { handleClose, teamData } = props;
    const [inviteLink, setInviteLink] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [qrWidth, setQrWidth] = useState(0);
    const [copied, setCopied] = useState(false);
    const copyTimeout = useRef(null);

    const { getActiveInvitationToTeam, createInvitationToTeam } = useApi();

    useEffect(() => {
        const fetchInvitationAndGenerateLink = async () => {
            try {
                // 1. Получаем активное приглашение
                let invitation = await getActiveInvitationToTeam(teamData.team_id);

                if (!invitation || invitation.length === 0) {
                    // 2. Если не найдено — создаём
                    const reqBody = { team_id: teamData.team_id };
                    invitation = await createInvitationToTeam(reqBody);
                }


                // 3. Формируем длинную ссылку
                const longUrl = invitation[0].invitationLink;
                let finalLink = longUrl;

                // 4. Пробуем сократить ссылку
                try {
                    const response = await fetch(`https://clck.ru/--?url=${encodeURIComponent(longUrl)}`);
                    const short = await response.text();
                    if (!response.ok || !short.startsWith("http")) {
                        throw new Error("Invalid shortened link");
                    }
                    finalLink = short;
                } catch (err) {
                    console.warn("Не удалось сократить ссылку, используем оригинальную:", longUrl);
                }

                // 5. Устанавливаем финальную ссылку
                setInviteLink(finalLink);
            } catch (err) {
                console.error("Ошибка при получении приглашения", err);
                navigation.navigate("Error");
            } finally {
                setLoading(false);
            }
        };

        fetchInvitationAndGenerateLink();
    }, [teamData]);


    useEffect(() => {
        if (!loading && !inviteLink) {
            navigation.navigate("Error", { messageProp: "Не удалось сгенерировать ссылку" });
        }
    }, [loading, inviteLink]);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(inviteLink);
        setCopied(true);

        // Сброс предыдущего таймера, если он есть
        if (copyTimeout.current) {
            clearTimeout(copyTimeout.current);
        }

        // Устанавливаем новый таймер
        copyTimeout.current = setTimeout(() => {
            setCopied(false);
            copyTimeout.current = null;
        }, 2000);
    };

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
            <Loader />
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
                            onPress={handleCopy}
                        >
                            <Text style={styles.qr__button_text}>
                                {copied ? "Скопировано" : "Копировать"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Pressable style={styles.button} onPress={() => handleClose(true)}>
                <Text style={styles.button__text}>Перейти к команде</Text>
            </Pressable>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E5E5EA",
        padding: 16,
        flex: 1,
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
