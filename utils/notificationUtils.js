import * as SecureStore from "expo-secure-store";

// Вынесенная утильная функция, принимает deletePushToken как аргумент
export const removePushToken = async (deletePushToken, setExpoPushToken) => {
  const token = await SecureStore.getItemAsync("expoPushToken");

  if (token) {
    let success = true;

    try {
      const result = await deletePushToken(token);
      success = result.success;

      if (!success) {
        console.log("❌ Сервер не удалил токен:", result.message);
      } else {
        console.log("🧹 Токен успешно удалён на сервере");
      }
    } catch (error) {
      console.log("❌ Ошибка при удалении токена на сервере:", error.message);
    }

    try {
      await SecureStore.deleteItemAsync("expoPushToken");
    } catch (error) {
      console.log(
        "❌ Ошибка при удалении токена из SecureStore:",
        error.message
      );
    }

    if (typeof setExpoPushToken === "function") {
      setExpoPushToken(null);
    }

    if (success) {
      console.log("🗑️ Push-токен удалён из SecureStore и с сервера");
    }
  } else {
    console.log("ℹ️ Нет токена для удаления");
  }
};
