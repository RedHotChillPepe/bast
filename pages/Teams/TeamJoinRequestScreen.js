import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApi } from '../../context/ApiContext';

export default function TeamJoinRequestScreen({ route }) {
    const [modalVisible, setModalVisible] = useState(true); // Модальное окно отображается по умолчанию
    const { token } = route.params;

    const navigation = useNavigation();
    const { isValidInvitation, acceptInvitationToTeam } = useApi();

    const [loading, setLoading] = useState(true);  // Статус загрузки
    const [errorMessage, setErrorMessage] = useState("");  // Сообщение об ошибке
    const [successMessage, setSuccessMessage] = useState("");  // Сообщение об успешном принятии

    const canGoBack = navigation.canGoBack();

    useEffect(() => {
        const checkInvitation = async () => {
            try {
                const result = await acceptInvitationToTeam(token);
                if (result.success) {
                    setSuccessMessage(result.message || "Заявка успешно отправлена!");
                } else {
                    setErrorMessage(result.message || "Не удалось отправить заявку.");
                }
            } catch (error) {
                setErrorMessage("Произошла ошибка при проверке приглашения.");
            }
            setLoading(false);
        };

        checkInvitation();
    }, [token]);

    const handleBack = () => {
        setModalVisible(false);

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "Profile",
                        state: {
                            index: 0,
                            routes: [
                                { name: "Profile" },
                            ],
                        },
                    },
                ],
            })
        );

        // Normal back behavior
        if (canGoBack) {
            navigation.goBack();
            return;
        }

        navigation.navigate("Main");

    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)} // Для Android
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2C88EC" /> // Индикатор загрузки
                    ) : (
                        <>
                            <Text style={styles.title}>{successMessage || errorMessage}</Text>
                            <TouchableOpacity style={styles.button} onPress={handleBack}>
                                <Text style={styles.buttonText}>{canGoBack ? 'Вернуться назад' : 'Перейти на главную'}</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // полупрозрачный фон
    },
    modalContent: {
        backgroundColor: '#F2F2F7',
        paddingHorizontal: 32,
        paddingVertical: 24,
        alignItems: 'center',
        width: '100%',  // Ширина на весь экран
        height: '100%', // Высота на весь экран
        justifyContent: 'center',  // Центрируем содержимое
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#3E3E3E',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#3E3E3E',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#2C88EC',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginTop: 20,
    },
    buttonText: {
        color: '#F2F2F7',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
