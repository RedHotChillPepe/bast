import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import ChatCard from '../../components/Chats/ChatCard';
import { useApi } from '../../context/ApiContext';
import { useToast } from '../../context/ToastProvider';
import SearchHeaderChat from './../../components/Chats/SearchHeaderChat';
import Loader from './../../components/Loader';
import ChatScreen from './ChatScreen';

const ChatListScreen = ({ navigation }) => {

    const [chatsData, setChatsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isShowModal, setIsShowModal] = useState(false);
    const [isModalEditShow, setIsModalEditShow] = useState(false);
    const [selectedChat, setSelectedChat] = useState();
    const [currentUser, setCurrentUser] = useState();
    const { getUserChats, togglePinedChat } = useApi();
    const [isAscSort, setIsAscSort] = useState(true);

    const [searchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const showToast = useToast();

    const isFocused = useIsFocused();

    // Функция сортировки: сначала все isPined, потом остальные;
    // внутри pinned — по убыванию даты, внутри остальных — asc/desc.
    const sortChats = (chats, asc) => {
        const pinned = chats.filter(c => c.isPined);
        const unpinned = chats.filter(c => !c.isPined);

        // DESC по дате для pinned
        pinned.sort((a, b) => new Date(b.last_message[0]?.creation_date || 0)
            - new Date(a.last_message[0]?.creation_date || 0));

        // asc/desc для unpinned
        unpinned.sort((a, b) => {
            const diff = new Date(b.last_message[0]?.creation_date || 0)
                - new Date(a.last_message[0]?.creation_date || 0);
            return asc ? -diff : diff;
        });

        return [...pinned, ...unpinned];
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchChats = async () => {
            try {
                const chatData = await getUserChats();
                if (chatData?.data?.chats) {
                    setChatsData(sortChats(chatData.data.chats, isAscSort));
                }
                if (chatData?.data?.current_user) {
                    setCurrentUser(chatData.data.current_user);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
                showToast('Ошибка при загрузке чатов', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchChats();
    }, [isFocused]);

    if (isLoading) return <Loader />

    const handleSelectedChat = (item, isShowModalChat = true) => {
        if (!item) return

        setSelectedChat(item);
        setIsShowModal(isShowModalChat);
        setIsModalEditShow(!isShowModalChat);
    }

    const renderModalFunctional = () => {
        return <Modal visible={isModalEditShow} transparent animationType="fade">
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
                                <Text style={styles.modal__text}>{selectedChat?.isPined ? "Открепить" : "Закрепить"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleToRead}
                                style={[styles.modal_button, { backgroundColor: "#2C88EC" }]}
                            >
                                <Text style={styles.modal__text}>Отметить прочитанным</Text>
                            </TouchableOpacity>
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
        </Modal >
    }

    const handleToFix = async () => {
        try {
            const result = await togglePinedChat(selectedChat.id);
            if (!result.success) throw new Error(result.message);

            setChatsData(prev => {
                const updated = prev.map(c =>
                    c.id === selectedChat.id ? { ...c, isPined: result.isPined } : c
                );
                return sortChats(updated, isAscSort);
            });
        } catch (e) {
            showToast(e.message, "error");
        }
        setIsModalEditShow(false);
    };

    const handleToRead = () => {
        setIsModalEditShow(false);
    }
    const handleToRemove = () => {
        setIsModalEditShow(false);
    }

    return <SafeAreaView style={styles.container}>
        <SearchHeaderChat
            sortChats={sortChats}
            isAscSort={isAscSort}
            setIsAscSort={setIsAscSort}
            chatsData={chatsData}
            setChatsData={setChatsData}
            searchData={searchData}
            setSearchData={setSearchData}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
        />
        <FlatList
            data={searchValue.length > 0 ? (searchData || []).filter(Boolean) : (chatsData || []).filter(Boolean)}
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
            <ChatScreen handleClose={() => setIsShowModal(false)} selectedChat={selectedChat} currentUser={currentUser} />
        </Modal>
    </SafeAreaView>
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
        alignItems: 'center',
        justifyContent: "center",
        borderRadius: 12,
        alignSelf: "stretch"
    },
    modal__text: {
        color: "#F2F2F7",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: -0.48,
        lineHeight: 20.17,
        fontFamily: "Sora700"
    }
});

export default ChatListScreen;
