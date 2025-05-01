import React from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import UserRemove from '../../assets/svg/UserRemove';
import AccordionList from '../../components/AccordionList';
import { useApi } from '../../context/ApiContext';

const EmployeeTeamPage = (props) => {

    const { handleClose, selectedPeople, selectedTeam, isOwner, setTeamsData, setTeamMembers, setRequestTeam } = props;

    const [showKickModal, setShowKickModal] = React.useState(false);
    const [isLoadingResult, setIsLoadingResult] = React.useState(false);
    const [error, setError] = React.useState("");

    const { removeTeamMember } = useApi();

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Сотрудник</Text>
            {isOwner ?
                <Pressable onPress={() => setShowKickModal(true)}>
                    <UserRemove />
                </Pressable>
                : <View />}
        </View>
    }

    const renderPeopleItem = () => {
        return (
            <View style={styles.item}>
                <View style={{ flexDirection: "row", columnGap: 8 }}>
                    <Image style={styles.item__photo} source={
                        selectedPeople?.user?.photo
                            ? { uri: selectedPeople?.user?.photo }
                            : require('../../assets/placeholder.png')
                    } />
                    <View style={styles.item__about}>
                        <View style={styles.people}>
                            <Text style={styles.people__name}>{selectedPeople.user.name} {selectedPeople.user.surname}</Text>
                            <Text style={styles.people__classification}>{selectedPeople.role_description}</Text>
                        </View>
                        <View style={styles.status_container}>
                            <Text style={styles.people__status}>в работе: </Text>
                            <Text style={styles.people__status__number}>{selectedPeople.request_count}</Text>
                        </View>
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

    const handleKickMember = async () => {
        try {
            setIsLoadingResult(true);
            setError("");

            const result = await removeTeamMember(
                selectedTeam.team_id,
                selectedPeople.user.id,
                selectedPeople.usertype,
            );

            if (!result.success) {
                throw new Error(result.message)
            }

            // Удалить участника из списка
            setTeamMembers((prev) =>
                prev.filter(member => member.member_id !== selectedPeople.member_id)
            );

            // Удалить заявки, связанные с участником
            setRequestTeam((prev) =>
                prev.filter(request => request.user_id !== selectedPeople.user.id && request.user_type !== selectedPeople.usertype)
            );

            // Обновить teamsData и уменьшить request_count
            setTeamsData((prev) =>
                prev.map(team => {
                    if (team.team_id === selectedTeam.team_id) {
                        const removedCount = parseInt(selectedPeople.request_count || "0", 10);
                        const currentCount = parseInt(team.request_count || "0", 10);
                        return {
                            ...team,
                            request_count: (currentCount - removedCount).toString()
                        };
                    }
                    return team;
                })
            );

            setIsLoadingResult(false);
            setShowKickModal(false);
            handleClose();
        } catch (err) {
            setIsLoadingResult(false);
            setError(err.message || "Не удалось удалить участника. Попробуйте позже.");
        }
    };

    const KickMemberModal = () => {
        return (
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>
                        Удалить участника
                    </Text>

                    {isLoadingResult ? (
                        <View style={{ paddingVertical: 24 }}>
                            <ActivityIndicator size="large" color="#32322C" />
                        </View>
                    ) : (
                        <View>
                            <Text style={[styles.modalSubtitle, { color: "#3E3E3E" }]}>
                                Вы уверены, что хотите удалить участника{' '}
                                <Text style={{ fontWeight: 'bold' }}>
                                    {selectedPeople.user.name} {selectedPeople.user.surname}
                                </Text>{' '}
                                из команды?
                            </Text>
                            {error ? (
                                <Text style={[styles.modalSubtitle, { color: "red" }]}>{error}</Text>
                            ) : null}
                        </View>
                    )}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: isLoadingResult ? "#F2F2F780" : "#F2F2F7" }]}
                            onPress={() => setShowKickModal(false)}
                            disabled={isLoadingResult}
                        >
                            <Text style={[styles.cancelButtonText, { color: isLoadingResult ? "#3E3E3E66" : '#3E3E3E' }]}>Отмена</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: isLoadingResult || error.length > 0 ? "#2C88EC66" : "#2C88EC" }]}
                            onPress={handleKickMember}
                            disabled={isLoadingResult || error.length > 0}
                        >
                            <Text style={styles.confirmButtonText}>Удалить</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

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
            {isOwner &&
                <Pressable style={styles.button}>
                    <Text style={styles.button__text}>Добавить задачу</Text>
                </Pressable>
            }
            <Modal visible={showKickModal} transparent={true} onRequestClose={() => setShowKickModal(false)}><KickMemberModal /></Modal>
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
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 360,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Sora700',
        color: '#3E3E3E',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        fontFamily: 'Sora400',
        marginBottom: 20,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        columnGap: 12,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButtonText: {
        fontFamily: 'Sora600',
        fontSize: 14,
    },
    confirmButtonText: {
        color: '#fff',
        fontFamily: 'Sora600',
        fontSize: 14,
    }
});

export default EmployeeTeamPage;