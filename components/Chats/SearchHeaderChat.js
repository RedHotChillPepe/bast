import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import SortAscIcon from "../../assets/svg/SortAsc";
import SortDescIcon from "../../assets/svg/SortDesc";
import FilterIcon from "../../assets/svg/Filter";
import { useApi } from '../../context/ApiContext';
import ChatInput from './ChatInput';

export default function SearchHeaderChat(props) {
    const {
        sortChats,
        handleSort,
        chatsData,
        setChatsData,
        setSearchData,
        setSearchValue,
        searchValue
    } = props;

    const { searchMessages } = useApi();

    const handleChangeInputText = (value) => {
        setSearchValue(value);
    };

    const handleChangeFilter = () => {
        handleSort();
    };

    useEffect(() => {
        const sorted = sortChats(chatsData);
        if (!searchValue || searchValue.length < 2) {
            setChatsData(sorted);
            setSearchData([]);
            return;
        }

        const fetchSearch = async () => {
            try {
                const result = await searchMessages(searchValue);
                if (result.statusCode) throw new Error(result.message);

                const foundChats = result.map(item => {
                    const base = chatsData.find(c => c.id === item.chat_id);
                    return base && {
                        ...base,
                        last_message: [{
                            message: item.messages[0]?.text || "",
                            creation_date: item.messages[0]?.creation_date
                        }]
                    };
                }).filter(Boolean);

                setSearchData(sortChats(foundChats));
            } catch (e) {
                console.warn(e);
            }
        };

        const timer = setTimeout(fetchSearch, 300);
        return () => clearTimeout(timer);
    }, [searchValue]);

    return (
        <View style={styles.container}>
            <ChatInput
                handleChangeInputText={handleChangeInputText}
                inputValue={searchValue}
                placeholder="Поиск по сообщениям"
            />
            <Pressable onPress={handleChangeFilter}>
                <FilterIcon />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#E5E5EA",
        alignItems: "center"
    },
});
