import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import { Selectors } from '../../components/Selectors';
import { useApi } from '../../context/ApiContext';
import { useTheme } from '../../context/ThemeContext';
import RequestPage from './RequestPage';

const UserRequestPage = (props) => {
    const { theme } = useTheme();

    const { getRequest, getStages } = useApi();

    const { handleClose, user, isDeal = false, isOwner = false, handleAssign, selectedPeople } = props;
    const [selectedList, setSelectedList] = useState("waiting");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);

    const [requests, setRequests] = useState([]);
    const [dataCurrentSelector, setDataCurrentSelector] = useState([])
    const [deals, setDeals] = useState([]);
    const [stages, setStages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const prevStatusRef = React.useRef(null);

    useEffect(() => {
        onRefresh();
    }, []);

    const onRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            if (isDeal) {
                await fetchDeals();
            } else {
                const resultStatuses = await getStages();
                setStages(resultStatuses);
                await fetchRequests();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }

    }, [selectedList]);

    const fetchRequests = async () => {
        try {
            const result = await getRequest(selectedPeople);
            setRequests(result);
            setDataCurrentSelector(filteredDataForSelector(result, selectedList));
        } catch (error) {
            throw error;
        }
    }
    useEffect(() => {
        const filteredData = filteredDataForSelector(requests, selectedList);
        setDataCurrentSelector(filteredData);

        if (!selectedRequest?.request_id) return;

        const updatedRequest = requests.find(
            req => req.request_id === selectedRequest.request_id
        );

        if (!updatedRequest) return;

        if (JSON.stringify(updatedRequest) === JSON.stringify(selectedRequest)) {
            return;
        }

        //  FIXME: не правильно обноыляются статусы и не сохраняется прошлый этап до отказа
        console.debug(selectedRequest);
        console.info(updatedRequest);

        setSelectedRequest(updatedRequest);
    }, [requests, selectedRequest?.request_id]);

    const fetchDeals = async () => {
        try { } catch (error) {
            throw error;
        }
    }
    const handleSelected = (item) => {
        setSelectedList(item);
        setDataCurrentSelector(filteredDataForSelector(isDeal ? deals : requests, item));
    }

    const filteredDataForSelector = (data, selector) => {
        const statuses = [];
        switch (selector) {
            case 'working':
                statuses.push(1, 2, 3);
                break;
            case 'closed':
                statuses.push(4, -1);
                break;
            default:
                statuses.push(0);
                break;
        }

        return data.filter((item) => statuses.includes(item.last_assign.status.id))
    }

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{isDeal ? "Сделки" : "Заявки"}</Text>
            <View />
        </View>
    }

    const renderStatus = (status) => {
        return (<View style={[styles.status__flag, {
            backgroundColor: status.id == -1 ? "#FF2D55" : status.id == 4 ? theme.colors.success : status.id == 0 ? '#FFC107' : "#2C88EC"
        }]}>
            <Text style={styles.flag__text
            } > {status.stage}</Text >
        </View >)
    }

    const renderRequest = () => {
        return refreshing ?
            <View style={{ marginTop: theme.spacing.medium }}><ActivityIndicator /></View> :
            <FlatList
                data={dataCurrentSelector}
                contentContainerStyle={styles.containerItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                renderItem={({ item }) =>
                    <TouchableOpacity key={item.request_id} style={styles.item} onPress={() => handleSelectedRequest(item)}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={styles.update__text}>
                                    Обновлено:&nbsp;
                                </Text>
                                <Text style={styles.update__date}>
                                    {new Date(item.last_assign.assigned_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                </Text>
                            </View>
                            {renderStatus(item.last_assign.status)}
                        </View>
                        <View style={{ rowGap: 16, marginTop: 8 }}>
                            <View style={{ rowGap: 4 }}>
                                <Text style={styles.initials}>{item.user.name} {item.user.surname}</Text>
                                <Text style={styles.type}>{item.service.description}</Text>
                            </View>
                            {isDeal &&
                                <View style={styles.location}>
                                    <Text style={styles.location__text}>{item.location}</Text>
                                    <Text style={styles.location__text}>№{item.request_id}</Text>
                                </View>
                            }
                        </View>
                    </TouchableOpacity>
                }
                ListEmptyComponent={<Text style={[theme.typography.title3("caption")]}>
                    Нет {selectedList == "waiting" ?
                        "ожидающих" : selectedList == "working" ?
                            "активных" : "закрытых"}&nbsp;
                    {isDeal ? "сделок" : "заявок"}
                </Text>}
            />
    }

    const handleSelectedRequest = (request) => {
        if (isOwner) {
            handleAssign(request);
            return
        };

        setSelectedRequest(request);
        setIsShowModal(true);
    }

    const listSelectPropertiesRequest = [
        { title: isOwner ? "Доступные" : "В ожидании", value: "waiting", id: 1 },
        { title: "В работе", value: "working", id: 2 },
        { title: "Закрытые", value: "closed", id: 3 },
    ]

    const listSelectPropertiesDeal = [
        { title: "Открытые", value: "waiting", id: 1 },
        { title: "Закрытые", value: "closed", id: 2 },
    ]

    return (
        <View style={styles.container}>
            {renderHeader()}
            <View
                style={styles.containerScroll}>
                <Selectors handleSelected={handleSelected} selectedList={selectedList} listSelector={isDeal ? listSelectPropertiesDeal : listSelectPropertiesRequest} />
                {renderRequest()}
            </View >
            <Modal visible={isShowModal} animationType='slide'><RequestPage prevStatusRef={prevStatusRef} user={user} handleClose={() => setIsShowModal(false)} setRequests={setRequests} selectedRequest={selectedRequest} stages={stages} isDeal={isDeal} /></Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E5E5EA",
        padding: 16,
        flex: 1,
    },
    containerScroll: {
        flex: 1,
        marginBottom: 16
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 16,
        alignItems: "center"
    },
    containerItem: {
        rowGap: 8,
        marginTop: 8,
    },
    item: {
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        padding: 16,
    },
    header__title: {
        color: "#3E3E3E",
        fontSize: 20,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 25.2,
        letterSpacing: -0.6,
    },
    status__flag: {
        backgroundColor: "#2C88EC",
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: "stretch",
    },
    flag__text: {
        textAlign: "center",
        color: "#F5F5F5",
        fontSize: 12,
        fontFamily: "Sora500",
        fontWeight: 400,
        lineHeight: 17,
        letterSpacing: -0.36,
    },
    location: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    location__text: {
        color: "#808080",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    initials: {
        color: "#000",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Sora700",
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    update__text: {
        color: "#808080",
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 16,
        letterSpacing: -0.36,
    },
    update__date: {
        color: "#000",
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Sora00",
        lineHeight: 16,
        letterSpacing: -0.36,
    },
    type: {
        color: "#000",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 17.6,
        letterSpacing: -0.42,
    }
});

export default UserRequestPage;