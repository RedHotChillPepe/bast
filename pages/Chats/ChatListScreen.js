import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ChatCard from "../../components/Chats/ChatCard";
import SupportBadges from "../../components/Support/SupportBadges";
import { useApi } from "../../context/ApiContext";
import { useToast } from "../../context/ToastProvider";
import SupportPage from "../Support/SupportPage";
import SearchHeaderChat from "./../../components/Chats/SearchHeaderChat";
import CustomModal from "./../../components/CustomModal";
import Loader from "./../../components/Loader";
import ChatScreen from "./ChatScreen";

const ChatListScreen = ({ navigation }) => {
  const [originalChats, setOriginalChats] = useState([]);
  const [chatsData, setChatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalEditShow, setIsModalEditShow] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [currentUser, setCurrentUser] = useState();
  const { getUserChats, togglePinedChat, setStatusMessage, deleteChat } =
    useApi();

  const [searchData, setSearchData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const [isShowSortModal, setIsShowSortModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState(1);

  const [isShowSupportModal, setIsShowSupportModal] = useState(false);

  const showToast = useToast();

  const isFocused = useIsFocused();

  const sortChats = (chats) => {
    const pinned = chats.filter((c) => c.isPined);
    const unpinned = chats.filter((c) => !c.isPined);

    const sortByStatusAndDate = (a, b) => {
      const statusA = a.last_message?.status ?? 0;
      const statusB = b.last_message?.status ?? 0;
      const dateA = new Date(a.last_message?.creation_date ?? 0).getTime();
      const dateB = new Date(b.last_message?.creation_date ?? 0).getTime();

      // Не прочитанные выше прочитанных
      if (statusA !== statusB) return statusB - statusA;

      // Новые выше старых
      return dateB - dateA;
    };

    pinned.sort(sortByStatusAndDate);
    unpinned.sort(sortByStatusAndDate);

    return [...pinned, ...unpinned];
  };

  useEffect(() => {
    let filtered = [...originalChats];
    if (selectedSort === 2) {
      // Оставляем только чаты с непрочитанным сообщением от оппонента
      filtered = filtered.filter((chat) => {
        const msg = chat.last_message?.[0];
        if (!msg) return false;

        return msg.status === 0 && msg.user_id === chat.opponent_user?.id;
      });
    }

    setChatsData(sortChats(filtered));
  }, [selectedSort, originalChats]);

  useEffect(() => {
    setIsLoading(true);
    const fetchChats = async () => {
      try {
        const chatData = await getUserChats();
        if (chatData?.data?.chats) {
          setOriginalChats(chatData.data.chats);
          setChatsData(sortChats(chatData.data.chats));
        }
        if (chatData?.data?.current_user) {
          setCurrentUser(chatData.data.current_user);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
        showToast("Ошибка при загрузке чатов", "error");
      } finally {
        setIsLoading(false);
      }
    };
    console.log(1);

    fetchChats();
  }, [isFocused]);

  if (isLoading) return <Loader />;

  const handleSelectedChat = (item, isShowModalChat = true) => {
    if (!item) return;

    setSelectedChat(item);
    setIsShowModal(isShowModalChat);
    setIsModalEditShow(!isShowModalChat);
  };

  const renderModalFunctional = () => {
    return (
      <Modal visible={isModalEditShow} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsModalEditShow(false)}>
          <View style={styles.overlay}>
            <View style={styles.modal_container}>
              <ChatCard
                post={selectedChat?.post}
                isModal={true}
                initials={`${selectedChat?.opponent_user?.name} ${selectedChat?.opponent_user?.surname?.[0]}.`}
              />
              <View style={{ gap: 16 }}>
                <TouchableOpacity
                  onPress={handleToFix}
                  style={[styles.modal_button, { backgroundColor: "#2C88EC" }]}
                >
                  <Text style={styles.modal__text}>
                    {selectedChat?.isPined ? "Открепить" : "Закрепить"}
                  </Text>
                </TouchableOpacity>
                {console.log(selectedChat?.last_message)}
                {selectedChat?.last_message[0].is_opponent_message &&
                  selectedChat?.last_message[0].status == 0 && (
                    <TouchableOpacity
                      onPress={handleToRead}
                      style={[
                        styles.modal_button,
                        { backgroundColor: "#2C88EC" },
                      ]}
                    >
                      <Text style={styles.modal__text}>
                        Отметить прочитанным
                      </Text>
                    </TouchableOpacity>
                  )}
                <TouchableOpacity
                  onPress={handleToRemove}
                  style={[styles.modal_button, { backgroundColor: "#FF2D55" }]}
                >
                  <Text style={styles.modal__text}>Удалить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const handleToFix = async () => {
    try {
      const result = await togglePinedChat(selectedChat.id);
      if (!result.success) throw new Error(result.message);

      setOriginalChats((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedChat.id ? { ...c, isPined: result.isPined } : c
        );
        return updated;
      });

      setChatsData((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedChat.id ? { ...c, isPined: result.isPined } : c
        );
        return sortChats(updated);
      });
    } catch (e) {
      showToast(e.message, "error");
    }
    setIsModalEditShow(false);
  };

  const handleToRead = async () => {
    try {
      const lastMessage = selectedChat.last_message[0];
      if (
        !lastMessage ||
        (!lastMessage.is_opponent_message && lastMessage.status == 1)
      )
        return;

      const result = await setStatusMessage(lastMessage.id);
      if (!result.success) throw new Error(result.message);

      const updatedChat = {
        ...selectedChat,
        last_message: [
          {
            ...lastMessage,
            status: 1,
          },
        ],
      };

      setOriginalChats((prev) => {
        return prev.map((item) =>
          item.id === selectedChat.id ? updatedChat : item
        );
      });

      setChatsData((prev) => {
        const updated = prev.map((c) =>
          c.id === selectedChat.id ? updatedChat : c
        );
        return sortChats(updated);
      });
    } catch (error) {
      showToast(error.message, "error");
    }
    setIsModalEditShow(false);
  };

  const handleToRemove = async () => {
    try {
      const result = await deleteChat(selectedChat.id);
      setOriginalChats((prev) => prev.filter((c) => c.id !== selectedChat.id));
      setChatsData((prev) => prev.filter((c) => c.id !== selectedChat.id));
    } catch (error) {
      showToast(error.message, "error");
    }
    setIsModalEditShow(false);
  };

  const listSort = [
    { label: "Последние", id: 1 },
    { label: "Непрочитанные", id: 2 },
  ];

  const handleSelectedSort = (id) => {
    setSelectedSort(id);
  };

  const radioButtons = () => {
    return (
      <View style={{ rowGap: 12 }}>
        {listSort.map((item) => (
          <TouchableOpacity
            key={`sortItem-${item.id}`}
            onPress={() => handleSelectedSort(item.id)}
            style={{
              columnGap: 12,
              flexDirection: "row",
              alignItems: "center",
              alignItems: "center",
            }}
          >
            <View
              style={[
                styles.radio__button,
                {
                  borderColor: selectedSort == item.id ? "#2C88EC" : "#A1A1A1",
                },
              ]}
            >
              {selectedSort == item.id && (
                <View style={styles.radio__point}></View>
              )}
            </View>
            <View style={styles.radio__text__container}>
              <Text style={[styles.radio__text, { color: "#808080" }]}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SearchHeaderChat
          sortChats={sortChats}
          chatsData={chatsData}
          setChatsData={setChatsData}
          searchData={searchData}
          setSearchData={setSearchData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          handleSort={() => setIsShowSortModal(true)}
        />
        <SupportBadges openSupportModal={() => setIsShowSupportModal(true)} />
        <FlatList
          data={
            searchValue.length > 0
              ? (searchData || []).filter(Boolean)
              : (chatsData || []).filter(Boolean)
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const chat = item || {};
            const post = chat.post || {};
            const lastMessage = chat.last_message || {};

            return (
              <TouchableOpacity
                onLongPress={() => handleSelectedChat(item, false)}
                onPress={() => handleSelectedChat(item)}
              >
                <ChatCard
                  post={post}
                  lastMessage={lastMessage}
                  searchValue={searchValue}
                  initials={`${item?.opponent_user?.name} ${item?.opponent_user?.surname?.[0]}.`}
                  isPined={item.isPined}
                  opponentUser={item?.opponent_user}
                />
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.text__empty}>
              {searchValue.length > 0 ? "Ничего не найдено" : "Нет чатов"}
            </Text>
          }
        />
        {renderModalFunctional()}
        <Modal visible={isShowModal}>
          <ChatScreen
            handleClose={() => setIsShowModal(false)}
            selectedChat={selectedChat}
            currentUser={currentUser}
          />
        </Modal>
        <CustomModal
          onClose={() => setIsShowSortModal(false)}
          isVisible={isShowSortModal}
          customHeight="300"
          title="Сортировка"
        >
          <View style={{ gap: 16, padding: 16 }}>{radioButtons()}</View>
        </CustomModal>
        <Modal
          visible={isShowSupportModal}
          onRequestClose={() => setIsShowSupportModal(false)}
          animationType="slide"
        >
          <SupportPage handleClose={() => setIsShowSupportModal(false)} />
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5E5EA",
    flex: 1,
  },
  text__empty: {
    color: "#3E3E3E",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontFamily: "Sora500",
    textAlign: "center",
    marginTop: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 16,
  },
  modal_container: {
    gap: 32,
    padding: 16,
    backgroundColor: "#E5E5EA",
    borderRadius: 16,
  },
  modal_button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    alignSelf: "stretch",
  },
  modal__text: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: -0.48,
    lineHeight: 20.17,
    fontFamily: "Sora700",
  },
  radio__button: {
    borderRadius: "50%",
    width: 14,
    height: 14,
    borderWidth: 1,
    padding: 2,
  },
  radio__point: {
    borderRadius: "50%",
    backgroundColor: "#2C88EC",
    flex: 1,
  },
  radio__text__container: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio__text: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
    letterSpacing: -0.36,
    fontFamily: "Sora400",
  },
});

export default ChatListScreen;
