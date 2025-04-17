import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import { Selectors } from '../../components/Selectors';
import RequestPage from './RequestPage';

const UserRequestPage = (props) => {
    const { handleClose, user } = props;
    const [selectedList, setSelectedList] = useState("waiting");
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);


    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Заявки</Text>
            <View />
        </View>
    }

    const requestListWaiting = [
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "В ожидании",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 1
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "В ожидании",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 2
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "Без исполнителя",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 3
        },
    ]

    const requestListWorking = [
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "В работе",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 1
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "В работе",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 2
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "В работе",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 3
        },
    ]

    const requestListClosed = [
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "Закрыта",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 1
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "Закрыта",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 2
        },
        {
            updateDate: `13.04 18:34`,
            initials: "Гребенкина Марина Александровна",
            status: "Закрыта",
            type: "Сопровождение сделки",
            location: "г Ижевск, ул Горнолыжная, д 23",
            id: 3
        },
    ]

    const renderStatus = (status) => {
        return (<View style={styles.status__flag}>
            <Text style={styles.flag__text}>{status}</Text>
        </View>)
    }

    const renderRequest = (requestList) => {
        return <View style={styles.containerItem}>{
            requestList.map((item) => (
                <Pressable key={item.id} style={styles.item} onPress={() => handleSelectedRequest(item)}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.update__text}>
                                Обновлено:&nbsp;
                            </Text>
                            <Text style={styles.update__date}>{item.updateDate}</Text>
                        </View>
                        {renderStatus(item.status)}
                    </View>
                    <View style={{ rowGap: 16, marginTop: 8 }}>
                        <View style={{ rowGap: 4 }}>
                            <Text style={styles.initials}>{item.initials}</Text>
                            <Text style={styles.type}>{item.type}</Text>
                        </View>
                        <View style={styles.location}>
                            <Text style={styles.location__text}>{item.location}</Text>
                            <Text style={styles.location__text}>№{item.id}</Text>
                        </View>
                    </View>
                </Pressable>
            ))
        }</View>
    }

    const handleSelectedRequest = (request) => {
        setSelectedRequest(request);
        setIsShowModal(true);
    }

    const listSelectProperties = [
        { title: "В ожидании", value: "waiting", id: 1 },
        { title: "В работе", value: "working", id: 2 },
        { title: "Закрытые", value: "closed", id: 3 },
    ]

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                <Selectors handleSelected={setSelectedList} selectedList={selectedList} listSelector={listSelectProperties} />
                {selectedList === "working" ? renderRequest(requestListWorking) :
                    selectedList === "waiting" ? renderRequest(requestListWaiting) : renderRequest(requestListClosed)}
            </ScrollView >
            <Modal visible={isShowModal}><RequestPage user={user} handleClose={() => setIsShowModal(false)} selectedRequest={selectedRequest} /></Modal>
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