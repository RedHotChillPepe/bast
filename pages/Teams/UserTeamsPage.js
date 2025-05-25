import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import TeamMembers from "../../assets/svg/TeamMembers";
import Loader from '../../components/Loader';
import { useApi } from '../../context/ApiContext';
import CreateTeamPage from './CreateTeamPage';
import TeamPage from './TeamPage';

const UserTeamsPage = (props) => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [teamsData, setTeamsData] = useState([])

    const { currentUser } = props;

    const { getUserTeams } = useApi();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const fetchTeams = async () => {
            setTeamsData(await getUserTeams());
            setIsLoading(false);
        }

        fetchTeams();
    }, [])

    if (isLoading) {
        return (
            <Loader />
        );
    }

    const handleClose = () => {
        props?.handleClose();
    }

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Мои команды</Text>
            <View />
        </View>
    }

    const renderTeams = () => {
        if (teamsData.length == 0) return <Text style={styles.text__empty}>У вас нет действующих команд</Text>
        return (
            <View style={styles.containerItem}>
                {teamsData.map((item) =>
                    <Pressable key={item.team_id} onPress={() => handleSelectedTeam(item)}>
                        <View style={styles.item}>
                            <TeamMembers />
                            <View style={styles.team}>
                                <View style={styles.team__about}>
                                    <Text style={styles.team__name}>{item.team_name}</Text>
                                    {item.member_role === 1 &&
                                        <View style={styles.status_container}>
                                            <Text style={styles.team__status}>в работе: </Text>
                                            <Text style={styles.team__status__number}>{item.team_request_count}</Text>
                                        </View>
                                    }
                                </View>
                                <Text style={styles.team__classification}>{item.description}</Text>
                            </View>
                        </View>
                    </Pressable>
                )}
            </View>)
    }

    const handleSelectedTeam = (team) => {
        setSelectedTeam(team);
        setIsShowModal(true);
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                {renderTeams()}
            </ScrollView >
            <Pressable style={styles.button} onPress={() => setIsShowCreateModal(true)}>
                <Text style={styles.button__text}>Создать команду</Text>
            </Pressable>

            <Modal visible={isShowCreateModal}><CreateTeamPage handleClose={() => setIsShowCreateModal(false)} setTeamsData={setTeamsData} /></Modal>
            <Modal visible={isShowModal}>
                <TeamPage
                    handleClose={() => setIsShowModal(false)}
                    selectedTeam={selectedTeam}
                    setTeamsData={setTeamsData}
                    setSelectedTeam={setSelectedTeam}
                    currentUser={currentUser} />
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
        padding: 16,
        flexDirection: "row",
        columnGap: 16,
    },
    team__about: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    team: {
        flex: 1, rowGap: 8
    },
    team__name: {
        color: "#3E3E3E",
        fontSize: 14,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    team__classification: {
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
    team__status: {
        color: "#2C88EC",
        fontSize: 14,
        fontFamily: "Sora400",
        lineHeight: 15.1,
        letterSpacing: -0.36,
    },
    team__status__number: {
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
    text__empty: {
        color: "#3E3E3E",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontFamily: "Sora500",
        textAlign: "center"
    }
});

export default UserTeamsPage;