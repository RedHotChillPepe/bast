import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import CloseIcon from '../../assets/svg/Close';
import { CreditCardIcon } from '../../assets/svg/CreditCard';
import DotIcon from "../../assets/svg/Dot";
import ShareIcon from '../../assets/svg/Share';
import CopyIcon from '../../assets/svg/Copy';
import { useTheme } from '../../context/ThemeContext';
import InputImage from './../../components/PostComponents/InputImage';
import * as Clipboard from 'expo-clipboard';

const RequestPage = (props) => {
    const { handleClose, selectedRequest, user, isDeal = false } = props;

    const { theme } = useTheme();
    const styles = makeStyle(theme);

    const [currentStage, setCurrentStage] = useState(0)
    const [maxStage, setMaxStage] = useState(4)
    const [isRejection, setIsRejection] = useState(false);

    const [paymentsStage, setPaymentsStage] = useState(0);
    const [documentIsUpload, setDocumentIsUploadIsUpload] = useState(false);

    const [formData, setFormData] = useState({
        photos: []
    });

    useEffect(() => {
        setDocumentIsUploadIsUpload(formData.photos.length > 0);
    }, [formData])

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{isDeal ? currentStage == maxStage ? "Выплата агенту" : "Сделка" : "Заявка"} {(!isDeal || currentStage !== maxStage) && selectedRequest.id}</Text>
            <Pressable>
                <ShareIcon />
            </Pressable>
        </View>
    }

    const listRequestStatuses = ["Начало", isDeal ? "Проверка документов" : "Начало", isDeal ? "Ожидание оплаты" : "Подтверждена", isDeal ? "Выплата вознаграждений" : "Оформление", "Завершена"]

    const renderStatus = () => {
        return (<View style={[styles.status__flag, { backgroundColor: isRejection ? "#FF2D55" : "#2C88EC" }]}>
            <Text style={styles.flag__text}>{isRejection ? "Отказ" : user.usertype === 3 ? listRequestStatuses[currentStage] : "Без исполнителя"}</Text>
        </View>)
    }

    const renderRequestHeader = () => {
        return <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
                <Text style={styles.update__text}>
                    Обновлено:&nbsp;
                </Text>
                <Text style={styles.update__date}>{selectedRequest.updateDate}</Text>
            </View>
            {renderStatus()}
        </View>
    }

    const renderRequestBody = () => {
        return <View style={{ rowGap: 16, marginTop: 8 }}>
            <View style={{ rowGap: 4 }}>
                <Text style={styles.initials}>{selectedRequest.initials}</Text>
                <Text style={styles.type}>{selectedRequest.type}</Text>
            </View>
            <View style={styles.location}>
                <Text style={styles.location__text}>{selectedRequest.location}</Text>
                <Text style={styles.location__text}>№{selectedRequest.id}</Text>
            </View>
        </View>
    }

    const renderPost = () => {
        return <View style={{ flexDirection: "row", gap: 12, marginTop: 12, alignItems: "center" }}>
            <Image style={{ width: 80, height: 51, borderRadius: 20, aspectRatio: 80 / 51, }} source={{ uri: "https://i3.imageban.ru/out/2025/01/27/972dc53aa3963aa9aaa8a4ee7041829a.jpg" }} />
            <View>
                <Text style={stylePost.price}>{Number(8_900_000).toLocaleString('ru-RU')} ₽</Text>
                <Text style={stylePost.location}>с . Завьялово, ул. Совесткая, 25</Text>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <Text style={stylePost.caption}>2 этажа</Text>
                    <DotIcon />
                    <Text style={stylePost.caption}>200 м2</Text>
                    <DotIcon />
                    <Text style={stylePost.caption}>20 соток</Text>
                </View>
            </View>
        </View>
    }

    const stylePost = StyleSheet.create({
        price: {
            color: "#0A0F09",
            fontSize: 17,
            fontFamily: "Sora500",
            lineHeight: 22,
            letterSpacing: -0.43,
        },
        location: {
            color: "#0A0F09",
            fontSize: 12,
            fontFamily: "Sora500",
            lineHeight: 16,
        },
        caption: {
            color: "#0A0F09",
            fontSize: 11,
            fontFamily: "Sora400",
            lineHeight: 13,
            letterSpacing: 0.06,
        }
    });

    const renderRequest = () => {
        return <View style={styles.containerItem}>{
            <View key={selectedRequest.id} style={styles.item}>
                {renderRequestHeader()}
                {isDeal ? renderPost() : renderRequestBody()}
            </View>
        }</View>
    }

    const listPeople = [
        { type: 1, typeName: "Покупатель", user: { surname: "Гребенкина", name: "Мария", fathername: "Александровна" }, id: 1 },
        { type: 2, typeName: "Продавец", user: { surname: "Васильева", name: "Елена", fathername: "Петровна" }, id: 2 },
        { type: 3, typeName: "Агент", user: { surname: "Пупкин", name: "Василий", fathername: "Иванович" }, id: 3 },
    ]

    const renderPeopleBlock = (item) => {
        return listPeople.map((item) => <View key={`people-${item.id}`} style={[styles.item, { rowGap: 4 }]}>
            <Text style={styles.type}>{item.typeName}</Text>
            <Text style={styles.initials}>{item.user.surname} {item.user.name} {item.user?.fathername}</Text>
        </View>);
    }

    const listStageDescriptions = [
        isDeal ? "Начало сделки" : "Заявка без исполнителя",
        isDeal ? "Подготовка документов" : "Заявка взята в работу",
        isDeal ? "Подписание договора" : "Менеджер связался с клиентом",
        isDeal ? "Завершение сделки" : "Сделка находится в процессе оформления",
        isDeal ? "Выплата вознаграждений" : "Сделка успешно завершена"
    ]

    const renderStageBlock = () => {
        return <View style={[styles.item, { rowGap: 32 }]}>
            <View style={{ rowGap: 16 }}>
                <Text style={styles.stage__title}>Этап {currentStage} из {maxStage}</Text>
                {renderStageIndicator()}
                <Text style={styles.stage__description}>{isRejection ? "Клиент отказался от сделки" : listStageDescriptions[currentStage]}</Text>
            </View>
            {((currentStage < maxStage && !isRejection && user.usertype === 3) || isDeal && maxStage == currentStage) &&
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
        { title: isDeal ? "Начать сделку" : "Взять в работу", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 1 },
        { title: isDeal ? "Документы готовы" : "Подтвердить завяку", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 2 },
        { title: isDeal ? "Договор подписан" : "Начать оформление", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 3 },
        { title: "Завершить сделку", handlePress: () => setCurrentStage((prev) => { return prev + 1 }), id: 4 },
    ]

    const listPaymentsButton = [
        { title: "Выплата отправлена", handlePress: () => console.log(1), id: 5 },
        { title: "Выплата отправлена", handlePress: () => console.log(1), id: 6 },
    ]

    const renderStageButton = () => {
        return <View style={styles.stage__button__container}>
            {!isDeal &&
                <TouchableOpacity
                    style={styles.stage__button}
                    onPress={() => setIsRejection(true)}
                >
                    <Text style={[styles.stage__button__text, { color: "#2C88EC" }]}>Отказ</Text>
                </TouchableOpacity>
            }
            <TouchableOpacity
                disabled={isDeal && maxStage == currentStage && !documentIsUpload}
                style={[styles.stage__button, { backgroundColor: `#2C88EC${isDeal && maxStage == currentStage && !documentIsUpload ? '60' : ''}` }]}
                onPress={isDeal && maxStage == currentStage ? listPaymentsButton[paymentsStage].handlePress : listButtonStage[currentStage].handlePress}
            >
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[styles.stage__button__text, { color: "#F2F2F7" }]}>{isDeal && maxStage == currentStage ? listPaymentsButton[paymentsStage].title : listButtonStage[currentStage].title}</Text>
            </TouchableOpacity>
        </View>
    }

    const renderPaymentsBlock = () => {
        return <View>
            {renderCreditBLock()}
            {renderDocumentBlock()}
        </View>
    }

    const renderCreditBLock = () => {
        return <TouchableOpacity
            onPress={() => { Clipboard.setStringAsync("Номер карты") }}
            style={styles.credit__container}
        >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={theme.typography.regularBold}>Счет для вознаграждений</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing.small }}>
                    <CreditCardIcon />
                    <Text style={theme.typography.regular('caption')}>{"2200 4480 7700 7654"}</Text>
                </View>
                <CopyIcon size={24} strokeWidth={2} />
            </View>
            <Text>Переведите вознаграждение по номеру банковской карты</Text>
        </TouchableOpacity>
    }

    const renderDocumentBlock = () => {
        return <View>
            <InputImage
                label="Чек об операции"
                buttonText="Загрузить документы о переводе"
                title=""
                verticalMargin={0}
                marginTop={10}
                selectionLimit={1}
                showImages={false}
                setFormData={setFormData}
                photos={formData.photos} />
        </View >
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView
                style={styles.containerScroll}>
                <View style={styles.containerItem}>
                    {(!isDeal || currentStage !== maxStage) ? renderRequest() : renderPaymentsBlock()}
                    {isDeal && currentStage !== maxStage && renderPeopleBlock()}
                    {renderStageBlock()}
                </View>
            </ScrollView >
            {(user.usertype === 3 || user.usertype === 2 && currentStage < maxStage) &&
                <Pressable
                    disabled={(user.usertype === 3 && currentStage !== maxStage && !isRejection) || (isDeal && !documentIsUpload)}
                    style={[styles.button, { backgroundColor: !isDeal && (user.usertype === 2 || currentStage === maxStage || isRejection) || (isDeal && documentIsUpload) ? "#2C88EC" : "#2C88EC66" }]}
                    onPress={() => user.usertype === 3 ? console.log("Закрыта") : console.log("Выбор исполнителя")}
                >
                    <Text style={styles.button__text}>{user.usertype === 3 ? "Закрыть сделку" : currentStage === 0 ? "Выбрать исполнителя" : "Сменить исполнителя"}</Text>
                </Pressable>
            }
        </View >
    )
}

const makeStyle = (theme) => StyleSheet.create({
    container: theme.container,
    containerScroll: {
        flex: 1,
        marginBottom: theme.spacing.medium
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: theme.spacing.medium,
        alignItems: "center"
    },
    containerItem: {
        rowGap: theme.spacing.small,
        marginTop: theme.spacing.small,
    },
    item: {
        backgroundColor: theme.colors.block,
        borderRadius: 12,
        padding: theme.spacing.medium,
    },
    header__title: theme.typography.title2,
    status__flag: {
        paddingHorizontal: theme.spacing.small,
        borderRadius: theme.spacing.small,
        alignSelf: "stretch",
    },
    flag__text: theme.typography.captionBold,
    location: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    location__text: theme.typography.regular("caption"),
    initials: {
        color: "#000",
        fontSize: 14,
        fontWeight: 600,
        fontFamily: "Sora700",
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    update__text: theme.typography.caption,
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
    button__text: theme.typography.buttonTextXL,
    container__stages: {
        flexDirection: "row",
        columnGap: 6,
    },
    stage: {
        flex: 1,
        height: 26,
        borderRadius: 12,
        backgroundColor: `${theme.colors.accent}66`,
        justifyContent: "center",
        alignItems: "center"
    },
    stage__active: {
        flex: 1,
        height: 26,
        borderRadius: 12,
        backgroundColor: theme.colors.accent,
        justifyContent: "center",
        alignItems: "center"
    },
    stage__button__container: {
        flexDirection: "row",
        columnGap: theme.spacing.medium,
    },
    stage__button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: theme.spacing.small,
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
    credit__container: {
        padding: theme.spacing.medium,
        backgroundColor: theme.colors.block,
        gap: 12,
        borderRadius: 12,
        marginTop: theme.spacing.small,
    },
});


export default RequestPage;