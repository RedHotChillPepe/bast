import { CommonActions, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

const RestoreAndDeleteProfile = ({ route }) => {
  const { theme } = useTheme();
  const { restoreProfile } = useApi();
  const { setAuth } = useAuth();
  const navigation = useNavigation();

  const {
    isRestore = false,
    tempToken = null,
    updated_at = new Date().toISOString(),
  } = route?.params ?? {};

  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const deletedAt = new Date(updated_at).getTime();
  const deletionDeadline = deletedAt + SEVEN_DAYS_IN_MS;

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = deletionDeadline - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("0 д 0 ч 0 м");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${days} д ${hours} ч ${minutes} м`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRestore = async () => {
    try {
      setLoading(true);
      setMessage("");
      const result = await restoreProfile(tempToken);
      if (!result.success) throw result;
      await setAuth([
        {
          access_token: result.access_token,
          refresh_token: result.refresh_token,
        },
      ]);
    } catch (error) {
      setMessage(error.message || "Произошла ошибка, повторите попытку позже");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const renderTextBlock = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          rowGap: theme.spacing.small,
        }}
      >
        {isRestore ? (
          isExpired ? (
            <View style={{ rowGap: theme.spacing.small }}>
              <Text style={theme.typography.title1}>
                Срок восстановления истёк
              </Text>
              <Text style={theme.typography.title3()}>
                Профиль удалён без возможности восстановления
              </Text>
            </View>
          ) : (
            <View style={{ rowGap: theme.spacing.small }}>
              <Text style={theme.typography.title1}>Ваш профиль удален</Text>
              <Text style={theme.typography.title3()}>
                Вы хотите восстановить профиль?
              </Text>
            </View>
          )
        ) : (
          <View style={{ rowGap: theme.spacing.small }}>
            <Text style={theme.typography.title1}>Профиль успешно удален</Text>
            <Text style={theme.typography.title3()}>
              Его можно восстановить в течение 7 дней
            </Text>
          </View>
        )}
        {!isExpired && (
          <Text style={theme.typography.regular("placeholder")}>
            До полного удаления: {timeLeft}
          </Text>
        )}
        {message.length > 0 && (
          <Text style={[theme.typography.errorText, { textAlign: "center" }]}>
            {message}
          </Text>
        )}
      </View>
    );
  };

  const renderButton = () => {
    const isRestoreExpired = isRestore && isExpired;

    return (
      <TouchableOpacity
        onPress={
          isRestoreExpired
            ? handleGoToLogin
            : isRestore
            ? handleRestore
            : handleGoToLogin
        }
        style={[
          theme.buttons.classisButton,
          {
            marginBottom: theme.spacing.medium,
            width: "100%",
            opacity: isLoading ? 0.6 : 1,
          },
        ]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <Text style={theme.typography.buttonTextXL}>
            {isRestoreExpired
              ? "Понятно"
              : isRestore
              ? "Восстановить"
              : "Понятно"}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[
        theme.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      {renderTextBlock()}
      {renderButton()}
    </SafeAreaView>
  );
};

export default RestoreAndDeleteProfile;
