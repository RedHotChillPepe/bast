import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CheckAllIcon from "../../assets/svg/CheckAll";
import CommunicationIcon from "../../assets/svg/Communication";
import DotIcon from "../../assets/svg/Dot";
import PaperclipAttachmentIcon from "../../assets/svg/PaperclipAttachment";
import HeaderChat from "../../components/Chats/HeaderChat";
import Loader from "../../components/Loader";
import { useApi } from "../../context/ApiContext";
import { useChatSocket } from "../../hooks/useChatSocket";
import useSocket from "../../hooks/usePresenceSocket";
import ChatInput from "./ChatInput";
import CustomModal from "../../components/CustomModal";
import DynamicHousePostPage from "../DynamicHousePostPage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

const ChatScreen = (props) => {
  const { handleClose, selectedChat, currentUser } = props;
  const [inputValue, setInputValue] = useState("");
  const { getChatMessages } = useApi();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListReady, setIsListReady] = useState(false);
  const listRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const typingTimeout = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isShowModalPost, setIsShowModalPost] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const navigation = useNavigation();

  const handleIncoming = useCallback(
    (msg) => setMessages((prev) => [...prev, msg]),
    []
  );

  const handleTyping = useCallback((is) => setIsTyping(is), []);
  const { opponentStatus } = useSocket();

  // Хук сокетов — вызывается всегда
  const {
    socket,
    isConnected,
    sendMessage,
    emitTyping,
    emitStopTyping,
    markAsRead,
  } = useChatSocket(
    selectedChat?.id,
    currentUser,
    handleIncoming,
    handleTyping
  );

  const { theme } = useTheme();
  const styles = makeStyles(theme);

  // обработчик входящих событий о прочтении
  useEffect(() => {
    if (!socket) return;

    const handleMessagesRead = ({ result }) => {
      console.log(result);
      const { ids } = result;

      setMessages((prev) =>
        prev.map((msg) => (ids.includes(msg.id) ? { ...msg, status: 1 } : msg))
      );
    };

    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket]);

  // Конфиг для viewability
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Считаем «видимым», если хотя бы 50% элемента в кадре
    minimumViewTime: 300, // Минимальное время видимости
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    // Находим последнее видимое сообщение от собеседника
    let lastUnreadMessage = null;

    viewableItems.forEach(({ item, index }) => {
      if (!item.isMyMessage && !item.isRead && index !== null) {
        lastUnreadMessage = item;
      }
    });
    if (!lastUnreadMessage) return;
    // Используем метод markAsRead из useChatSocket
    console.log("lastUnreadMessage:", lastUnreadMessage);

    markAsRead(lastUnreadMessage.id, selectedChat.id);
  }).current;

  // слушаем клавиатуру
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Загрузка истории — вызываем всегда, но внутри проверяем наличие ID
  useEffect(() => {
    console.log(selectedChat);
    if (!selectedChat?.id) return;

    setIsDeleted(selectedChat.opponent_user.status == -1);

    setIsLoading(true);
    getChatMessages(selectedChat.id)
      .then((res) => {
        setMessages(res.data || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [selectedChat?.id]);

  useEffect(() => {
    if (!keyboardVisible || !isListReady) return;
    if (!listRef.current) return;
    if (messages.length === 0) return;

    const formattedMessages = formatMessages(messages);
    const groupedMessages = formattedMessages.reduce((acc, message) => {
      const date = getDateString(message.timestamp);
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});

    const flatData = [];
    Object.entries(groupedMessages).forEach(([date, messages]) => {
      flatData.push({ type: "header", id: `header-${date}`, date });
      messages.forEach((message) => {
        flatData.push({ ...message, type: "message", id: message.id });
      });
    });

    if (flatData.length === 0) return;

    // Ищем индекс последнего элемента
    const lastIndex = flatData.length - 1;

    setTimeout(() => {
      if (listRef.current?.scrollToIndex) {
        listRef.current.scrollToIndex({
          index: lastIndex,
          animated: true,
          viewPosition: 1, // Прокручиваем так, чтобы элемент был внизу
        });
      }
    }, 50);
  }, [messages, keyboardVisible, isListReady]);

  if (isLoading) return <Loader />;

  const handleSendMessage = () => {
    if (inputValue.length == 0) return;
    sendMessage(inputValue.trim());
    setInputValue("");
    // При отправке сразу сбрасываем индикатор
    emitStopTyping();
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  const handleChangeInputText = (value) => {
    setInputValue(value);
    emitTyping();

    // Сбрасываем предыдущий таймаут
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Устанавливаем новый: через 1s без ввода — stopTyping
    typingTimeout.current = setTimeout(() => {
      emitStopTyping();
    }, 1000);
  };

  // Преобразование сообщений с сервера в нужный формат
  const formatMessages = (serverMessages) => {
    if (!currentUser || !selectedChat) {
      console.error("Current user or chat data is not available");
      return [];
    }

    return serverMessages.map((message) => {
      // Создаем дату с учетом временной зоны
      const messageDate = new Date(message.creation_date);

      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Преобразуем время с сервера в локальное время пользователя
      const timeString = messageDate.toLocaleString("ru-RU", {
        timeZone: userTimeZone, // Указываем временную зону пользователя
        hour: "2-digit",
        minute: "2-digit",
      });

      const isMyMessage =
        message.user_id === currentUser.id &&
        message.user_usertype === currentUser.usertype;

      return {
        id: message.id.toString(),
        isMyMessage,
        user: {
          name: isMyMessage
            ? `${currentUser.name || ""}${
                currentUser.surname ? " " + currentUser.surname : ""
              }`
            : selectedChat.opponent_fullname,
          avatar: isMyMessage
            ? currentUser?.photo
            : selectedChat.opponent_user?.photo,
        },
        text: message.message,
        time: timeString,
        timestamp: message.creation_date,
        isMyMessage: isMyMessage,
        isRead: message.status == 1,
      };
    });
  };

  const renderPost = () => {
    if (!selectedChat?.post) return null;

    const post = selectedChat.post;
    const firstPhoto = post.photos?.[0] || "https://via.placeholder.com/80x50";
    const price = post.price
      ? Number(post.price).toLocaleString("ru-RU")
      : "Цена не указана";

    return (
      <Pressable
        onPress={() => setIsShowModalPost(true)}
        style={styles.post__container}
      >
        <Image style={styles.post__image} source={{ uri: firstPhoto }} />
        <View style={styles.post__info}>
          <Text style={styles.info__price}>{price} ₽</Text>
          <Text style={styles.info__location}>
            {post.city}, {post.full_address}
          </Text>
          <View style={styles.caption__container}>
            <Text style={styles.caption__text}>{post.num_floors} этажа</Text>
            <DotIcon />
            <Text style={styles.caption__text}>{post.house_area} м2</Text>
            <DotIcon />
            <Text style={styles.caption__text}>{post.plot_area} соток</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderItem = ({ item }) => {
    if (item.type === "header") {
      return <Text style={styles.full__date}>{item.date}</Text>;
    }
    console.warn(item);

    return (
      <View
        style={[
          styles.sender__container,
          item.isMyMessage && {
            flexDirection: "row-reverse",
            alignSelf: "flex-end",
          },
          !item.isMyMessage && {
            alignSelf: "flex-start",
          },
        ]}
      >
        <Image
          style={styles.user__image}
          source={
            isDeleted && !item.isMyMessage
              ? require("../../assets/deleted_user.jpg")
              : item.user?.avatar
              ? { uri: item.user?.avatar }
              : require("../../assets/placeholder.png")
          }
        />
        <View style={{ rowGap: 7 }}>
          <Text
            style={[
              styles.user__initials,
              item.isMyMessage && { textAlign: "right" },
            ]}
          >
            {item.user.name}
          </Text>
          <View style={styles.message}>
            <Text style={styles.message__text}>{item.text}</Text>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: item.isMyMessage ? "row-reverse" : "row",
              alignItems: "flex-end",
              gap: 4,
            },
          ]}
        >
          <Text style={styles.message__date}>{item.time}</Text>
          {item.isMyMessage && (
            <CheckAllIcon color={item.isRead ? "#2C88EC" : "#8E8E93"} />
          )}
        </View>
      </View>
    );
  };

  const getDateString = (dateStr) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString("ru-RU", options);
  };

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет сообщений</Text>
        </View>
      );
    }

    const formattedMessages = formatMessages(messages);

    // Группируем сообщения по датам
    const groupedMessages = formattedMessages.reduce((acc, message) => {
      const date = getDateString(message.timestamp);
      if (!acc[date]) acc[date] = [];
      acc[date].push(message);
      return acc;
    }, {});

    // Преобразуем в плоский массив с заголовками дат
    const flatData = [];
    Object.entries(groupedMessages).forEach(([date, messages]) => {
      flatData.push({ type: "header", id: `header-${date}`, date });
      messages.forEach((message, index) => {
        flatData.push({ ...message, type: "message", id: message.id });
      });
    });
    return (
      <FlatList
        ref={listRef}
        data={flatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[styles.container, { flexGrow: 1 }]}
        style={{ flex: 1 }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onLayout={() => setIsListReady(true)}
        onScrollToIndexFailed={(info) => {
          // Пытаемся снова через небольшой таймаут
          setTimeout(() => {
            if (listRef.current?.scrollToIndex) {
              listRef.current.scrollToIndex({
                index: info.index,
                animated: true,
              });
            }
          }, 50);
        }}
      />
    );
  };

  const renderInput = () => {
    return (
      <View>
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Собеседник печатает...</Text>
          </View>
        )}
        {!isDeleted && (
          <View style={styles.input__container}>
            <PaperclipAttachmentIcon />
            <ChatInput
              handleChangeInputText={handleChangeInputText}
              inputValue={inputValue}
              placeholder={"Сообщение"}
            />
            <TouchableOpacity onPress={handleSendMessage}>
              <CommunicationIcon color={theme.colors.accent} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#E5E5EA" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <HeaderChat
          handleClose={handleClose}
          title={selectedChat?.opponent_fullname || "Чат"}
          avatar={selectedChat?.opponent_user?.photo}
          online={opponentStatus}
          isOwner={
            selectedChat?.post?.poster_id == currentUser.id &&
            selectedChat?.post?.poster_type == currentUser.usertype
          }
        />
        {!isDeleted && renderPost()}
        {renderMessages()}
        {renderInput()}
        <CustomModal
          isVisible={isShowModalPost}
          onClose={() => setIsShowModalPost(false)}
        >
          <DynamicHousePostPage
            navigation={navigation}
            route={{
              houseId: selectedChat?.post?.id,
              isModal: true,
              setIsModalShow: setIsShowModalPost,
            }}
          />
        </CustomModal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      padding: theme.spacing.medium,
      gap: theme.spacing.medium,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyText: {
      ...theme.typography.title3("caption"),
    },
    full__date: {
      ...theme.typography.title3("text"),
      paddingBottom: theme.spacing.medium,
    },
    sender__container: {
      flexDirection: "row",
      gap: theme.spacing.small,
      marginBottom: theme.spacing.medium,
    },
    user__image: {
      width: 42,
      height: 42,
      aspectRatio: 1 / 1,
      borderRadius: 100,
    },
    user__initials: {
      ...theme.typography.regularBold,
      wordWrap: "break-word",
    },
    message: {
      backgroundColor: theme.colors.block,
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      gap: 10,
      flexWrap: "wrap",
      maxWidth: 200,
      padding: 12,
      borderRadius: 12,
    },
    message__text: {
      ...theme.typography.regular(),
      wordWrap: "break-word",
    },
    message__date: {
      ...theme.typography.caption,
      wordWrap: "break-word",
    },
    post__container: {
      backgroundColor: theme.colors.block,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.placeholder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
      flexDirection: "row",
    },
    post__image: {
      width: 80,
      borderRadius: 20,
      alignSelf: "stretch",
      aspectRatio: 80 / 50,
    },
    info__price: {
      color: theme.colors.text,
      fontFamily: "Sora700",
      letterSpacing: -0.43,
      fontWeight: 600,
      lineHeight: 22,
      fontSize: 17,
    },
    info__location: {
      color: theme.colors.text,
      fontFamily: "Sora500",
      fontWeight: 500,
      lineHeight: 16,
      fontSize: 12,
    },
    caption__container: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    caption__text: {
      ...theme.typography.caption,
    },
    input__container: {
      flexDirection: "row",
      backgroundColor: theme.colors.block,
      gap: theme.spacing.small,
      paddingVertical: theme.spacing.small,
      alignItems: "center",
      paddingHorizontal: theme.spacing.medium,
    },
    typingIndicator: {
      paddingVertical: theme.spacing.small,
      paddingHorizontal: theme.spacing.medium,
      backgroundColor: "transparent",
      alignItems: "flex-start",
    },
    typingText: {
      ...theme.typography.caption,
    },
  });

export default ChatScreen;
