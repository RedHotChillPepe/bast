import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '../assets/svg/ChevronLeft';
import ShareIcon from '../assets/svg/Share';
import CustomModal from '../components/CustomModal';
import ProfilePageView from './ProfilePageView';

const TeamPage = (props) => {
    const { title } = props;

    const [isShowModal, setIsShowModal] = useState(false);
    const [selectedPeople, setSelectedPeople] = useState(null);

    const listPeople = [
        {
            photo: "https://s3-alpha-sig.figma.com/img/ffc1/4cd3/1111aefb2980dcf0a98c1acf18ebd9d2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p9uBhDPBp52KjxLhtpW4EjokeE7zSwh~rnW3qShRPNIxS4VqCs5d69qlU9Nku9RkO2WSPBUqZ-~RWTpCu~SS44Sp1Oe94TCO~0cN5mUGoE6iAHujsMBwS0m4aVmB-8ipLkB1bbGYV66MH3s8bPvwU--KF78o~xtwUDMYV80FZqp~46SzRgDhMoZYIg7NGX2Egt2O-qj~LMlwebUbW3BsxxlviB-dvC934eqXYT72WY1JsIGxNQubNGGpkUXCJ~7WCKUrfujhHIXiRKnzmbrzWaifgfzTm1LQkMvz7Nu45BXpKge3juHPAUqazZsE4P3FpHG~Duc2AQRpYzDpMz072A__",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            status: 99,
            id: 1
        },
        {
            photo: "https://s3-alpha-sig.figma.com/img/ffc1/4cd3/1111aefb2980dcf0a98c1acf18ebd9d2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p9uBhDPBp52KjxLhtpW4EjokeE7zSwh~rnW3qShRPNIxS4VqCs5d69qlU9Nku9RkO2WSPBUqZ-~RWTpCu~SS44Sp1Oe94TCO~0cN5mUGoE6iAHujsMBwS0m4aVmB-8ipLkB1bbGYV66MH3s8bPvwU--KF78o~xtwUDMYV80FZqp~46SzRgDhMoZYIg7NGX2Egt2O-qj~LMlwebUbW3BsxxlviB-dvC934eqXYT72WY1JsIGxNQubNGGpkUXCJ~7WCKUrfujhHIXiRKnzmbrzWaifgfzTm1LQkMvz7Nu45BXpKge3juHPAUqazZsE4P3FpHG~Duc2AQRpYzDpMz072A__",
            name: "Тест Физлицо",
            classification: "Менеджер",
            status: 66,
            id: 2
        },
        {
            photo: "https://s3-alpha-sig.figma.com/img/ffc1/4cd3/1111aefb2980dcf0a98c1acf18ebd9d2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p9uBhDPBp52KjxLhtpW4EjokeE7zSwh~rnW3qShRPNIxS4VqCs5d69qlU9Nku9RkO2WSPBUqZ-~RWTpCu~SS44Sp1Oe94TCO~0cN5mUGoE6iAHujsMBwS0m4aVmB-8ipLkB1bbGYV66MH3s8bPvwU--KF78o~xtwUDMYV80FZqp~46SzRgDhMoZYIg7NGX2Egt2O-qj~LMlwebUbW3BsxxlviB-dvC934eqXYT72WY1JsIGxNQubNGGpkUXCJ~7WCKUrfujhHIXiRKnzmbrzWaifgfzTm1LQkMvz7Nu45BXpKge3juHPAUqazZsE4P3FpHG~Duc2AQRpYzDpMz072A__",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            status: 80,
            id: 3
        },
        {
            photo: "https://s3-alpha-sig.figma.com/img/ffc1/4cd3/1111aefb2980dcf0a98c1acf18ebd9d2?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=p9uBhDPBp52KjxLhtpW4EjokeE7zSwh~rnW3qShRPNIxS4VqCs5d69qlU9Nku9RkO2WSPBUqZ-~RWTpCu~SS44Sp1Oe94TCO~0cN5mUGoE6iAHujsMBwS0m4aVmB-8ipLkB1bbGYV66MH3s8bPvwU--KF78o~xtwUDMYV80FZqp~46SzRgDhMoZYIg7NGX2Egt2O-qj~LMlwebUbW3BsxxlviB-dvC934eqXYT72WY1JsIGxNQubNGGpkUXCJ~7WCKUrfujhHIXiRKnzmbrzWaifgfzTm1LQkMvz7Nu45BXpKge3juHPAUqazZsE4P3FpHG~Duc2AQRpYzDpMz072A__",
            name: "Тест Физлицо",
            classification: "Риэлтор",
            status: 54,
            id: 4
        },
    ]

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{title}</Text>
            <Pressable>
                <ShareIcon />
            </Pressable>
        </View>
    }

    const renderPeoples = () => {
        return (
            <View style={styles.containerItem}>
                {listPeople.map((people) =>
                    <Pressable key={people.id} onPress={() => handleSelectedPeople(people.id)}>
                        <View style={styles.item}>
                            <Image style={styles.item__photo} source={{ uri: people.photo }} />
                            <View style={styles.item__about}>
                                <View style={styles.people}>
                                    <Text style={styles.people__name}>{people.name}</Text>
                                    <Text style={styles.people__classification}>{people.classification}</Text>
                                </View>
                                <View style={styles.status_container}>
                                    <Text style={styles.people__status}>в работе: </Text>
                                    <Text style={styles.people__status__number}>{people.status}</Text>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                )}
            </View>)
    }

    const handleSelectedPeople = (id) => {
        setSelectedPeople(id);
        setIsShowModal(true);
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                {renderPeoples()}
            </ScrollView >
            <CustomModal isVisible={isShowModal} onClose={() => setIsShowModal(false)} buttonLeft={<ChevronLeft />} buttonRight={<ShareIcon />}>
                <ProfilePageView route={{ params: { posterId: 35 } }} />
            </CustomModal>
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
        flexDirection: "row",
        columnGap: 8,
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
        fontFamily: "Sora500",
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
});

export default TeamPage;