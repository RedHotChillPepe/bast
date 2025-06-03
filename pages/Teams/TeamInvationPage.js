import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import ChevronLeft from "../../assets/svg/ChevronLeft";
import LinkIcon from "../../assets/svg/Link";
import Loader from "../../components/Loader";
import { useApi } from "../../context/ApiContext";
import { useTheme } from "../../context/ThemeContext";

export default function TeamInvationPage(props) {
  const { handleClose, teamData, user, isReferral = false } = props;
  const [inviteLink, setInviteLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [qrWidth, setQrWidth] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef(null);
  const { getActiveInvitationToTeam, createInvitationToTeam, getReferralLink } =
    useApi();

  const { theme } = useTheme();
  const styles = makeStyleByTheme(theme);

  useEffect(() => {
    if (isReferral) {
      fetchReferralLinkAndGenerateLink();
      return;
    }
    fetchInvitationAndGenerateLink();
  }, [teamData]);

  const generateQrLink = async (link) => {
    let finalLink = link;
    try {
      const response = await fetch(
        `https://clck.ru/--?url=${encodeURIComponent(link)}`
      );
      const short = await response.text();
      if (!response.ok || !short.startsWith("http")) {
        throw new Error("Invalid shortened link");
      }
      finalLink = short;
    } catch (err) {
      console.log(err);
      console.warn(
        "Не удалось сократить ссылку, используем оригинальную:",
        link
      );
    } finally {
      setInviteLink(finalLink);
    }
  };

  const fetchReferralLinkAndGenerateLink = async () => {
    try {
      const result = await getReferralLink();
      await generateQrLink(result.link);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitationAndGenerateLink = async () => {
    try {
      // 1. Получаем активное приглашение
      let invitation = await getActiveInvitationToTeam(teamData.team_id);

      if (!invitation || invitation.length === 0) {
        // 2. Если не найдено — создаём
        const reqBody = { team_id: teamData.team_id };
        invitation = await createInvitationToTeam(reqBody);
        console.log("invitationCreate:", invitation);
      }

      await generateQrLink(invitation[0].invitationLink);
    } catch (err) {
      console.error("Ошибка при получении приглашения", err);
      navigation.navigate("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !inviteLink) {
      handleClose();
      navigation.navigate("Error", {
        messageProp: "Не удалось сгенерировать ссылку",
      });
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
      <Text style={styles.header__title}>
        {isReferral ? "Реферальная программа" : "Ссылка приглашение"}
      </Text>
      <View />
    </View>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.containerItem}>
          <Text style={styles.title}>
            {isReferral
              ? "При регистрации по этой ссылкепользователь станет вашим рефералом, и вы получите вознаграждение с первой его сделки."
              : "С помощью этой ссылки можно подать заявку на вступление в команду"}
          </Text>
          <View style={styles.qr__container}>
            <View
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setQrWidth(width - 32);
              }}
              style={{ padding: 16 }}
            >
              {qrWidth > 0 && inviteLink !== null && (
                <QRCode
                  value={inviteLink}
                  size={qrWidth}
                  backgroundColor={"#F2F2F7"}
                  color={"#3E3E3E"}
                />
              )}
            </View>
            <View style={{ rowGap: 14 }}>
              <View style={styles.link__container}>
                <LinkIcon />
                <Text style={styles.link__text}>{inviteLink}</Text>
              </View>
              <TouchableOpacity style={styles.qr__button} onPress={handleCopy}>
                <Text style={styles.qr__button_text}>
                  {copied ? "Скопировано" : "Копировать"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Pressable style={styles.button} onPress={() => handleClose(true)}>
          <Text style={styles.button__text}>
            Перейти к {isReferral ? "рефералам" : "команде"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const makeStyleByTheme = (theme) =>
  StyleSheet.create({
    container: {
      ...theme.container,
    },
    header: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingBottom: theme.spacing.medium,
      alignItems: "center",
    },
    header__title: {
      ...theme.typography.title2,
    },
    containerItem: {
      rowGap: 12,
      marginTop: theme.spacing.small,
      flex: 1,
    },
    button: {
      ...theme.buttons.classisButton,
      borderRadius: 12,
      marginBottom: 28,
    },
    button__text: {
      ...theme.typography.title3("block"),
    },
    title: {
      ...theme.typography.regular,
    },
    qr__container: {
      backgroundColor: theme.colors.block,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 17,
      gap: 32,
    },
    link__container: {
      flexDirection: "row",
      columnGap: 8,
      alignItems: "center",
    },
    link__text: {
      ...theme.typography.title3("text"),
    },
    qr__button: {
      ...theme.buttons.classisButton,
    },
    qr__button_text: {
      ...theme.typography.regular("block"),
    },
  });
