import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import UserRemove from '../../assets/svg/UserRemove';
import AccordionList from '../../components/AccordionList';

const EmployeeTeamPage = (props) => {

    const { handleClose, selectedPeople } = props;

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Сотрудник</Text>
            <Pressable>
                <UserRemove />
            </Pressable>
        </View>
    }

    const renderPeopleItem = () => {
        console.log(selectedPeople);
        return (
            <View style={styles.item}>
                <View style={{ flexDirection: "row", columnGap: 8 }}>
                    <Image style={styles.item__photo} source={{ uri: selectedPeople.photo }} />
                    <View style={styles.item__about}>
                        <View style={styles.people}>
                            <Text style={styles.people__name}>{selectedPeople.name}</Text>
                            <Text style={styles.people__classification}>{selectedPeople.classification}</Text>
                        </View>
                        {selectedPeople?.status &&
                            <View style={styles.status_container}>
                                <Text style={styles.people__status}>в работе: </Text>
                                <Text style={styles.people__status__number}>{selectedPeople.status}</Text>
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

    const requestList = [
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
    ]

    const renderStatus = (status) => {
        return (<View style={styles.status__flag}>
            <Text style={styles.flag__text}>{status}</Text>
        </View>)
    }

    const renderRequest = () => {
        return requestList.map((item) => (
            <View key={item.id} style={{ rowGap: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.update__text}>
                            Обновлено:&nbsp;
                        </Text>
                        <Text style={styles.update__date}>{item.updateDate}</Text>
                    </View>
                    {renderStatus(item.status)}
                </View>
                <View style={{ rowGap: 4 }}>
                    <Text style={styles.initials}>{item.initials}</Text>
                    <Text style={styles.type}>{item.type}</Text>
                    <View style={styles.location}>
                        <Text style={styles.location__text}>{item.location}</Text>
                        <Text style={styles.location__text}>№{item.id}</Text>
                    </View>
                </View>
            </View>
        ))
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView style={styles.containerScroll}>
                <View style={styles.containerItem}>
                    {renderPeopleItem()}
                    <AccordionList title="В работе" isExpanded={true}>
                        {renderRequest()}
                    </AccordionList>
                    <AccordionList title="Закрытые" ></AccordionList>
                </View>
            </ScrollView>
            <Pressable style={styles.button}>
                <Text style={styles.button__text}>Добавить задачу</Text>
            </Pressable>
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
        paddingBottom: 8,
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
        rowGap: 8,
        marginTop: 16,
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
        color: "#3E3E3E",
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
        color: "#3E3E3E",
        fontSize: 12,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 16,
        letterSpacing: -0.36,
    },
    type: {
        color: "#3E3E3E",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Sora400",
        lineHeight: 17.6,
        letterSpacing: -0.42,
    }
});

export default EmployeeTeamPage;