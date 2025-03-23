import { Ionicons } from "@expo/vector-icons";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const ToastContext = createContext();

// Глобальная переменная для хранения ссылки на функцию showToast
let globalShowToast = null;

export const setGlobalShowToast = (fn) => {
  globalShowToast = fn;
};

export const getGlobalShowToast = () => globalShowToast;

export const ToastProvider = ({ children }) => {
  // Храним массив сообщений, каждое сообщение имеет уникальный id, текст, тип и Animated.Value для opacity
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = "success", duration = 2000) => {
    // Если сообщение — массив, объединяем его в одну строку с переносами строк
    if (Array.isArray(msg)) {
      msg = msg.join("\n");
    } else if (typeof msg !== "string") {
      msg = String(msg);
    }

    const id = Date.now().toString();
    const newToast = { id, msg, type, opacity: new Animated.Value(0) };

    setToasts((prev) => [...prev, newToast]);

    // Анимация появления
    Animated.timing(newToast.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // После задержки запускаем анимацию исчезания
      setTimeout(() => {
        Animated.timing(newToast.opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Удаляем уведомление из стека
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        });
      }, duration);
    });
  };

  // Маппинг типа уведомления на иконку и её цвет
  const iconMapping = {
    success: { name: "checkmark-circle-outline", color: "#fff" },
    error: { name: "close-circle-outline", color: "#fff" },
    warn: { name: "alert-circle-outline", color: "#fff" },
    info: { name: "information-circle-outline", color: "#fff" },
  };

  // Сохраняем глобальную ссылку при монтировании компонента
  useEffect(() => {
    setGlobalShowToast(showToast);
  }, [showToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toasts.map((toast, index) => {
        const icon = iconMapping[toast.type] || iconMapping.success;
        return (
          <Animated.View
            key={toast.id}
            style={[
              toastStyles.toastContainer,
              { opacity: toast.opacity, bottom: 50 + index * 80 },
              toast.type === "success"
                ? toastStyles.success
                : toast.type === "error"
                  ? toastStyles.error
                  : toast.type === "warn"
                    ? toastStyles.warn
                    : toast.type === "info"
                      ? toastStyles.info
                      : {},
            ]}
          >
            <View style={toastStyles.toastContent}>
              <Ionicons
                name={icon.name}
                size={20}
                color={icon.color}
                style={{ marginRight: 8 }}
              />
              <Text style={toastStyles.toastText}>{toast.msg}</Text>
            </View>
          </Animated.View>
        );
      })}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const toastStyles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    left: Dimensions.get("window").width * 0.05, // Уменьшил отступы
    right: Dimensions.get("window").width * 0.05,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    paddingVertical: 12, // Добавил внутренний отступ
  },
  toastContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    flexShrink: 1,
    maxWidth: Dimensions.get("window").width * 0.7, // Ограничение ширины
  },
  success: { backgroundColor: "#4CAF50" },
  error: { backgroundColor: "#F44336" },
  warn: { backgroundColor: "#FFC107" },
  info: { backgroundColor: "#2196F3" },
});

export default ToastProvider;
