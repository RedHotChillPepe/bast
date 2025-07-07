import { SafeAreaView, StyleSheet, View } from "react-native";
import InputBlock from "../../components/Support/InputBlock";
import MessageBlock from "../../components/Support/MessageBlock";
import UniversalHeader from "../../components/UniversalHeaderComponent";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";

export default function SupportPage({ handleClose }) {
  const { theme } = useTheme();
  const styles = makeStyle(theme);

  const [messages, setMessages] = useState([]);
  const [isActiveAppeal, setIsActiveAppeal] = useState(false);
  const [isDisabledInput, setIsDisabledInput] = useState(true);
  const [currentStep, setCurrentStep] = useState("topic");

  useEffect(() => {
    // Получаем сообщения

    // Проверяем открытоли обращение
    setIsActiveAppeal(messages.length !== 0);
    // если Чат пустой или обращение закрыто -> отправить системное сообщение
    if (!isActiveAppeal) {
      sendTopicSelection();
      return;
    }

    setIsActiveAppeal(true);
    // иначи -> разблокировать клавиатуру
  }, [isActiveAppeal]);

  // Конфигурация по умолчанию
  const defaultUserMessage = {
    isMe: false,
    senderType: "user",
    senderName: "Вы",
    avatar: require("../../assets/deleted_user.jpg"),
    read: true,
  };

  const defaultSystemMessage = {
    senderType: "system",
  };

  // Упрощенная функция добавления сообщения
  const addMessage = (messageContent, type = "user") => {
    const baseMessage = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...(type === "user" ? defaultUserMessage : defaultSystemMessage),
      ...messageContent,
    };

    setMessages((prev) => {
      const lastConversation = prev[prev.length - 1];

      // Если нет диалогов или последний диалог завершен, создаем новый
      if (!lastConversation || lastConversation.isCompleted) {
        return [
          ...prev,
          {
            id: Date.now(),
            date: new Date().toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            isCompleted: false,
            messages: [baseMessage],
          },
        ];
      }

      // Добавляем в текущий диалог
      return [
        ...prev.slice(0, -1),
        {
          ...lastConversation,
          messages: [...lastConversation.messages, baseMessage],
        },
      ];
    });
  };

  // Специализированные функции для разных типов сообщений
  const sendUserMessage = (text, topic = null) => {
    if (currentStep === "topic" && topic) {
      // Шаг 1: Пользователь выбрал тему
      addMessage(
        {
          text: topic.title,
          topic: topic.title,
        },
        "user"
      );
      sendDescriptionRequest(topic.title);
      setCurrentStep("description");
      setIsDisabledInput(false);
    } else if (currentStep === "description") {
      // Шаг 2: Пользователь отправил описание
      addMessage({ text }, "user");

      // Шаг 3: Отправляем уведомление
      setTimeout(() => {
        sendSystemMessage("notification", {
          text: "Обращение создано. Вскоре с вами свяжется оператор.",
        });
        setCurrentStep("conversation");
      }, 1000);
    } else {
      // Обычные сообщения в процессе диалога
      addMessage({ text }, "user");
    }
  };

  const sendSystemMessage = (type, content) => {
    addMessage({ content: { type, ...content } }, "system");
  };

  const sendTopicSelection = () => {
    sendSystemMessage("topicSelection", {
      topics: [
        { id: 1, title: "Проблема с оплатой" },
        { id: 2, title: "Технические неполадки" },
      ],
    });
  };

  const sendDescriptionRequest = (topic) => {
    sendSystemMessage("descriptionRequest", {
      text: `Пожалуйста, опишите вашу проблему подробнее`,
    });
  };

  const closeConversation = () => {
    setMessages((prev) =>
      prev.map((conv, i) =>
        i === prev.length - 1 ? { ...conv, isCompleted: true } : conv
      )
    );
    sendSystemMessage("conversationClosed", {
      text: "Обращение закрыто. Спасибо за обращение!",
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View style={styles.header__container}>
        <UniversalHeader
          title="БАСТ Поддержка"
          handleClose={handleClose}
          isModal={true}
        />
      </View>
      <View style={[theme.container, { paddingVertical: 0 }]}>
        <MessageBlock messages={messages} sendUserMessage={sendUserMessage} />
      </View>
      <InputBlock sendMessage={sendUserMessage} isDisabled={isDisabledInput} />
    </SafeAreaView>
  );
}

const makeStyle = (theme) =>
  StyleSheet.create({
    header__container: {
      paddingTop: theme.spacing.medium,
      paddingHorizontal: theme.spacing.medium,
      borderBottomColor: theme.colors.caption,
      borderBottomWidth: 1,
      backgroundColor: theme.colors.block,
    },
  });
