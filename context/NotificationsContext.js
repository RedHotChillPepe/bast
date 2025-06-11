import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Modal, Platform } from "react-native";
import { removePushToken } from "../utils/notificationUtils";
import { useApi } from "./ApiContext";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  const { registerPushToken, deletePushToken } = useApi();
  const { isAuth, tokenIsLoaded } = useAuth();

  const [isShowModal, setIsShowModal] = useState(false);
  const [modalContent, setModalContent] = useState();

  useEffect(() => {
    if (!tokenIsLoaded) return; // ждём, пока загрузится токен авторизации
    if (!isAuth) {
      setExpoPushToken(null);
      return;
    } // пользователь не авторизован — не регистрируем пуш токен

    const setupNotifications = async () => {
      const storedToken = await SecureStore.getItemAsync("expoPushToken");

      if (storedToken) {
        console.log("📦 Найден токен в SecureStore:", storedToken);
        setExpoPushToken(storedToken);
      } else {
        const newToken = await registerForPushNotificationsAsync();
        if (newToken) {
          setExpoPushToken(newToken);
          try {
            await SecureStore.setItemAsync("expoPushToken", newToken);
          } catch (error) {
            console.log(
              "❌ Ошибка сохранения токена в SecureStore:",
              error.message
            );
          }

          try {
            await registerPushToken(newToken); // отправка на сервер
          } catch (error) {
            console.log(
              "❌ Ошибка при регистрации токена на сервере:",
              error.message
            );
          }
        }
      }

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("📩 Уведомление получено:", notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("📲 Открыто уведомление:", response);
          const data = response.notification.request.content.data;
          console.log("data:", data);

          if (!data.screen) {
            navigation.navigate("Main");
            return;
          }

          if (data.isModal) {
            return;
          }

          try {
            navigation.navigate(data.screen, data.params || {});
          } catch (error) {
            console.error(
              "❌ Ошибка навигации при открытии уведомления:",
              error
            );
          }
        });
    };

    setupNotifications();

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuth, tokenIsLoaded]); // обновляем при изменении авторизации или загрузке токена

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const sendPushNotification = async ({ title, body, data }) => {
    if (!expoPushToken) return;

    console.log("Отправка уведомления с данными:", { title, body, data });
    console.log(expoPushToken);

    const message = {
      to: expoPushToken,
      sound: "default",
      title,
      body,
      data,
    };

    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log("📤 Уведомление отправлено:", result);
    } catch (error) {
      console.error("❌ Ошибка отправки уведомления:", error);
    }
  };

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Не удалось получить разрешение на уведомления!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("📱 Expo Push Token:", token);
    } else {
      console.log("⚠️ Уведомления работают только на реальном устройстве");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        icon: "",
      });
    }

    return token;
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        sendPushNotification,
        removePushToken: () =>
          removePushToken(deletePushToken, setExpoPushToken),
      }}
    >
      {children}
      <Modal visible={isShowModal} onRequestClose={() => setIsShowModal(false)}>
        {modalContent}
      </Modal>
    </NotificationContext.Provider>
  );
};
