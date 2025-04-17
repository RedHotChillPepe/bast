import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import EditPencil from '../../assets/svg/EditPencil';
import { Selectors } from '../../components/Selectors';
import EmployeeTeamPage from './EmployeeTeamPage';
import EditTeamPage from './EditTeamPage';
import TeamInvationPage from './TeamInvationPage';

const TeamPage = (props) => {
    const [selectedList, setSelectedList] = useState("active");

    const { selectedTeam, handleClose } = props;

    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowInvationModal, setIsShowInvationModal] = useState(false);

    const [selectedPeople, setSelectedPeople] = useState(null);

    const listPeople = [
        {
            photo: "https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/Successful-mature-businessman-looking-at-camera-with-confidence/960x0.jpg?format=jpg&width=960",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            status: 99,
            id: 1
        },
        {
            photo: "https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/Successful-mature-businessman-looking-at-camera-with-confidence/960x0.jpg?format=jpg&width=960",
            name: "Тест Физлицо",
            classification: "Менеджер",
            status: 66,
            id: 2
        },
        {
            photo: "https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/Successful-mature-businessman-looking-at-camera-with-confidence/960x0.jpg?format=jpg&width=960",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            status: 80,
            id: 3
        },
    ]

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{selectedTeam.team_name}</Text>
            <Pressable onPress={() => setIsShowEditModal(true)}>
                <EditPencil />
            </Pressable>
        </View>
    }

    const listSelectProperties = [
        { title: "Активные", value: "active", id: 1 },
        { title: "Заявки", value: "request", id: 2 },
    ]

    const renderPeopleItem = (people) => {
        return (
            <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Image style={styles.item__photo} source={{ uri: people.photo }} />
                <View style={styles.item__about}>
                    <View style={styles.people}>
                        <Text style={styles.people__name}>{people.name}</Text>
                        <Text style={styles.people__classification}>{people.classification}</Text>
                    </View>
                    {people?.status &&
                        <View style={styles.status_container}>
                            <Text style={styles.people__status}>в работе: </Text>
                            <Text style={styles.people__status__number}>{people.status}</Text>
                        </View>
                    }
                </View>
            </View>
        )
    }

    const renderPeoples = () => {
        console.log(listPeople);
        return (
            <View style={styles.containerItem}>
                {listPeople.map((people) =>
                    <Pressable key={people.id} onPress={() => handleSelectedPeople(people)}>
                        <View style={styles.item}>
                            {renderPeopleItem(people)}
                        </View>
                    </Pressable>
                )}
            </View>)
    }

    const listRequest = [
        {
            photo: "https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/Successful-mature-businessman-looking-at-camera-with-confidence/960x0.jpg?format=jpg&width=960",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            id: 1
        },
        {
            photo: "https://imageio.forbes.com/specials-images/imageserve/66c3b9c5b69e4e9fcffc9ca6/Successful-mature-businessman-looking-at-camera-with-confidence/960x0.jpg?format=jpg&width=960",
            name: "Тест Физлицо",
            classification: "Менеджер",
            id: 2
        },
    ]

    const renderRequest = () => {
        return (<View style={styles.containerItem}>
            {listRequest.map((people) =>
                <Pressable key={people.id} onPress={() => handleSelectedPeople(people)}>
                    <View style={styles.item}>
                        {renderPeopleItem(people)}
                        <View style={{ flexDirection: "row", columnGap: 8, }}>
                            <Pressable style={styles.request__button}>
                                <Text style={[styles.request__button__text, { color: "#2C88EC" }]}>Отклонить</Text>
                            </Pressable>
                            <Pressable style={[styles.request__button, { backgroundColor: "#2C88EC" }]}>
                                <Text style={[styles.request__button__text, { color: "#F2F2F7" }]}>Принять</Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            )
            }
        </View >)
    }

    const handleSelectedPeople = (people) => {
        setSelectedPeople(people);
        setIsShowModal(true);
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                <Selectors handleSelected={setSelectedList} selectedList={selectedList} listSelector={listSelectProperties} />
                {selectedList == "active" ?
                    renderPeoples() :
                    renderRequest()
                }
            </ScrollView >
            <Pressable style={styles.button} onPress={() => setIsShowInvationModal(true)}>
                <Text style={styles.button__text}>Добавить сотрудника</Text>
            </Pressable>

            <Modal visible={isShowInvationModal}><TeamInvationPage handleClose={() => setIsShowInvationModal(false)} teamData={selectedTeam} /></Modal>
            <Modal visible={isShowEditModal}><EditTeamPage handleClose={() => setIsShowEditModal(false)} selectedTeam={selectedTeam} /></Modal>
            <Modal visible={isShowModal}>
                <EmployeeTeamPage selectedPeople={selectedPeople} handleClose={() => setIsShowModal(false)} />
            </Modal>
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
    header__title: {
        color: "#3E3E3E",
        fontSize: 20,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 25.2,
        letterSpacing: -0.6,
    },
    containerItem: {
        rowGap: 12,
        marginTop: 8,
    },
    item: {
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
        padding: 12,
        columnGap: 8,
        rowGap: 24,
    },
    item__photo: {
        width: 42,
        height: 42,
        borderRadius: 54,
        alignSelf: "stretch",
        aspectRatio: "1/1"
    },
    item__about: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1
    },
    people: {
        justifyContent: "space-between"
    },
    people__name: {
        color: "#3E3E3E",
        fontSize: 14,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    people__classification: {
        color: "#808080",
        fontSize: 14,
        fontFamily: "Sora400",
        fontWeight: 400,
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    status_container: {
        flexDirection: "row"
    },
    people__status: {
        color: "#2C88EC",
        fontSize: 14,
        fontFamily: "Sora400",
        lineHeight: 15.1,
        letterSpacing: -0.36,
    },
    people__status__number: {
        color: "#2C88EC",
        fontSize: 14,
        fontFamily: "Sora700",
        lineHeight: 15.1,
        letterSpacing: -0.36,
    },
    button: {
        backgroundColor: "#2C88EC",
        padding: 12,
        alignItems: "center",
        borderRadius: 12,
        marginBottom: 28,
    },
    button__text: {
        color: "#F2F2F7",
        fontSize: 16,
        fontWeight: 600,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontFamily: "Sora700",
    },
    request__button: {
        flex: 1,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12
    },
    request__button__text: {
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 17.6,
        letterSpacing: -0.42
    },
});

export default TeamPage;