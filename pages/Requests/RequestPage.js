import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import CloseIcon from '../../assets/svg/Close';
import ShareIcon from '../../assets/svg/Share';

const RequestPage = (props) => {
    const { handleClose, selectedRequest, user } = props;

    const [currentStage, setCurrentStage] = useState(0)
    const [maxStage, setMaxStage] = useState(4)
    const [isRejection, setIsRejection] = useState(false);

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Заявка №{selectedRequest.id}</Text>
            <Pressable>
                <ShareIcon />
            </Pressable>
        </View>
    }

    const listRequestStatuses = ["Начало", "Начало", "Подтверждена", "Оформление", "Завершена"]

    const renderStatus = () => {
        return (<View style={[styles.status__flag, { backgroundColor: isRejection ? "#FF2D55" : "#2C88EC" }]}>
            <Text style={styles.flag__text}>{isRejection ? "Отказ" : user.usertype === 3 ? listRequestStatuses[currentStage] : "Без исполнителя"}</Text>
        </View>)
    }

    const renderRequest = () => {
        return <View style={styles.containerItem}>{
            <View key={selectedRequest.id} style={styles.item}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.update__text}>
                            Обновлено:&nbsp;
                        </Text>
                        <Text style={styles.update__date}>{selectedRequest.updateDate}</Text>
                    </View>
                    {renderStatus()}
                </View>
                <View style={{ rowGap: 16, marginTop: 8 }}>
                    <View style={{ rowGap: 4 }}>
                        <Text style={styles.initials}>{selectedRequest.initials}</Text>
                        <Text style={styles.type}>{selectedRequest.type}</Text>
                    </View>
                    <View style={styles.location}>
                        <Text style={styles.location__text}>{selectedRequest.location}</Text>
                        <Text style={styles.location__text}>№{selectedRequest.id}</Text>
                    </View>
                </View>
            </View>
        }</View>
    }

    const listStageDescriptions = [
        "Заявка без исполнителя",
        "Заявка взята в работу",
        "Менеджер связался с клиентом",
        "Сделка находится в процессе оформления",
        "Сделка успешно завершена"
    ]

    const renderStageBlock = () => {
        return <View style={[styles.item, { rowGap: 32 }]}>
            <View style={{ rowGap: 16 }}>
                <Text style={styles.stage__title}>Этап {currentStage} из {maxStage}</Text>
                {renderStageIndicator()}
                <Text style={styles.stage__description}>{isRejection ? "Клиент отказался от сделки" : listStageDescriptions[currentStage]}</Text>
            </View>
            {(currentStage < maxStage && !isRejection && user.usertype === 3) &&
                renderStageButton()
            }
        </View>
    }

    const renderStageIndicator = () => {
        const indicators = [];
        for (let i = 0; i < maxStage; i++) {
            const indicator = <View key={`indicator-${i}`} style={i < currentStage ? styles.stage__active : styles.stage}>
                {isRejection && <CloseIcon color={"#2C88EC"} />}
            </View>;
            indicators.push(indicator);
        }

        return <View style={styles.container__stages}>
            {indicators}
        </View>
    }

    const listButtonStage = [
        { title: "Взять в работу", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 1 },
        { title: "Подтвердить завяку", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 2 },
        { title: "Начать оформление", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 3 },
        { title: "Завершить сделку", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 4 },
    ]

    const renderStageButton = () => {
        return <View style={styles.stage__button__container}>
            <TouchableOpacity
                style={styles.stage__button}
                onPress={() => setIsRejection(true)}
            >
                <Text style={[styles.stage__button__text, { color: "#2C88EC" }]}>Отказ</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.stage__button, { backgroundColor: "#2C88EC" }]}
                onPress={listButtonStage[currentStage].handlePress}
            >
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.stage__button__text, { color: "#F2F2F7" }]}>{listButtonStage[currentStage].title}</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                <View style={styles.containerItem}>
                    {renderRequest()}
                    {renderStageBlock()}
                </View>
            </ScrollView >
            {(user.usertype === 3 || user.usertype === 2 && currentStage < maxStage) &&
                <Pressable
                    disabled={user.usertype === 3 && currentStage !== maxStage && !isRejection}
                    style={[styles.button, { backgroundColor: user.usertype === 2 || currentStage === maxStage || isRejection ? "#2C88EC" : "#2C88EC66" }]}
                    onPress={() => user.usertype === 3 ? console.log("Закрыта") : console.log("Выбор исполнителя")}
                >
                    <Text style={styles.button__text}>{user.usertype === 3 ? "Закрыть сделку" : currentStage === 0 ? "Выбрать исполнителя" : "Сменить исполнителя"}</Text>
                </Pressable>
            }
        </View >
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
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: "stretch",
    },
    flag__text: {
        color: "#F5F5F5",
        textAlign: "center",
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
    },
    button: {
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
    container__stages: {
        flexDirection: "row",
        columnGap: 6,
    },
    stage: {
        flex: 1,
        height: 26,
        borderRadius: 12,
        backgroundColor: "#2C88EC66",
        justifyContent: "center",
        alignItems: "center"
    },
    stage__active: {
        flex: 1,
        height: 26,
        borderRadius: 12,
        backgroundColor: "#2C88EC",
        justifyContent: "center",
        alignItems: "center"
    },
    stage__button__container: {
        flexDirection: "row",
        columnGap: 16,
    },
    stage__button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        minWidth: 0, // 🛠️ позволяет flex shrink корректно сработать
    },
    stage__button__text: {
        fontFamily: "Sora700",
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.42,
        color: "#000",
        fontWeight: "600",
        textAlign: "center",
        flexShrink: 1,
        includeFontPadding: false,
    },
    stage__title: {
        fontFamily: "Sora700",
        fontSize: 16,
        lineHeight: 20.17, /* 20.178 */
        letterSpacing: -0.48,
        color: "#000",
        fontWeight: 600,
    },
    stage__description: {
        fontWeight: 400,
        fontFamily: "Sora400",
        fontSize: 14,
        lineHeight: 17.6, /* 20.178 */
        letterSpacing: -0.42,
        color: "#000"
    },
});

export default RequestPage;