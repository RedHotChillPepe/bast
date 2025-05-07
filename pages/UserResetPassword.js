import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChevronLeft from '../assets/svg/ChevronLeft';
import InputProperty from '../components/PostComponents/InputProperty';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastProvider';


const UserResetPassword = ({ route }) => {
    const { resetPassword } = useApi()
    const { setAuth } = useAuth()
    const showToast = useToast();
    const navigation = useNavigation();

    const { regData, token = '' } = route.params;
    const [formData, setFormData] = useState({
        phoneNumber: regData?.phoneNumber || "",
        password: '',
        confirmPassword: '',
    });
    console.log("token:", token);
    const [formErrors, setFormErrors] = useState({
        password: '',
        confirmPassword: '',
        responseError: ''
    });

    const handleSubmit = async () => {
        if (hasFormErrors()) {
            showToast("Пожалуйста, исправьте ошибки в форме", "warn");
            return;
        }

        try {
            const response = await resetPassword({ phoneNumber: formData.phoneNumber, newPassword: formData.password }, token);
            if (response.statusCode) throw new Error(response.message);
            console.log("response:", response);
            await setAuth([{
                access_token: response.access_token,
                refresh_token: response.refresh_token
            }])
            navigation.navigate("Main");
            return;
        } catch (error) {
            console.error(error.message);
            showToast(error.message, "warn");
        }
    }

    // Разрешённые символы: ASCII от 33 (!) до 126 (~)
    const allowedRegex = /^[\x21-\x7E]*$/;
    const handlePasswordChange = (field, value) => {
        if (!allowedRegex.test(value)) {
            setFormErrors((prev) => ({ ...prev, [field]: "Введён недопустимый символ" }));
            return;
        }

        setFormData((prevData) => {
            const newData = { ...prevData, [field]: value };
            const password = field === 'password' ? value : prevData.password;
            const confirmPassword = field === 'confirmPassword' ? value : prevData.confirmPassword;

            const newErrors = {
                password: password.length > 0 && password.length < 6
                    ? "Пароль должен содержать минимум 6 символов"
                    : password !== confirmPassword ? "Пароли не совпадают" : "",
                confirmPassword: password !== confirmPassword ? "Пароли не совпадают" : ""
            };

            setFormErrors(newErrors);
            return newData;
        });
    };

    const hasFormErrors = () => {
        // Проверка ошибок валидации
        if (Object.values(formErrors).some(error => error !== "")) {
            return true;
        }

        let result = false;

        // Проверка обязательных полей
        const requiredFields = {
            phoneNumber: "Телефон обязателен",
            password: "Пароль обязателен",
            confirmPassword: "Подтверждение пароля обязательно"
        };

        for (const [field, errorMessage] of Object.entries(requiredFields)) {
            if (!formData[field] || formData[field].trim() === "") {
                result = true;
            }
        }

        return result;
    };

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{"Сброс пароля"}</Text>
            <View />
        </View >
    }

    const listInput = [
        { label: "Придумайте пароль", placeholder: "Пароль", valueName: "password", type: "password", error: formErrors.password },
        { label: "Подтвердите пароль", placeholder: "Подтвердите пароль", valueName: "confirmPassword", type: "confirmPassword", error: formErrors.confirmPassword },
    ];

    const handleInputChange = (field, value) => {
        switch (field) {
            case "password":
                handlePasswordChange(field, value);
                break;
            case "confirmPassword":
                handlePasswordChange(field, value);
                break;
        }
    };

    const renderInput = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: 'stretch', marginHorizontal: 16, }}>
                <Text style={styles.titleText}>Данные пользователя</Text>
                <View style={styles.input__container}>
                    {listInput.map((item, index) => (
                        <View key={`input-${index}`}>
                            <View View style={styles.row} >
                                <InputProperty
                                    title={item.label}
                                    placeholder={item.placeholder}
                                    value={formData[item.valueName]}
                                    valueName={item.valueName}
                                    type={item.type}
                                    handleInputChange={handleInputChange}
                                />
                            </View>
                            {item.error &&
                                <Text style={styles.errorText}>{item.error}</Text>
                            }
                        </View>)
                    )}
                </View>
            </View >)
    }

    const renderSubmitButton = () => {
        return <TouchableOpacity style={[styles.button, { opacity: hasFormErrors() ? 0.5 : 1 }]}
            disabled={hasFormErrors()}
            onPress={() => handleSubmit()}>
            <Text style={styles.button__text}>
                Подтвердить
            </Text>
        </TouchableOpacity>
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
            {renderHeader()}
            {renderInput()}
            {renderSubmitButton()}
        </SafeAreaView >
    )
}

export default UserResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5EA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingVertical: 16,
        alignItems: "center",
        alignSelf: "stretch",
        marginHorizontal: 16
    },
    header__title: {
        color: "#3E3E3E",
        fontSize: 20,
        fontFamily: "Sora700",
        fontWeight: 600,
        lineHeight: 25.2,
        letterSpacing: -0.6,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 12,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 44,
    },
    button__text: {
        fontSize: 16,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontWeight: 600,
        fontFamily: "Sora700",
        color: '#F2F2F7',
    },
    errorText: {
        marginTop: 8,
        color: "red",
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.42,
        fontWeight: 400,
        fontFamily: "Sora400",
    },
    input__container: {
        gap: 24,
        alignSelf: "stretch",
    },
    row: {
        columnGap: 16,
        flexDirection: "row",
    },
    titleText: {
        fontSize: 16,
        color: "#3E3E3E",
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontWeight: 600,
        fontFamily: "Sora700",
        paddingBottom: 24,
    },
    input: {
        flex: 1,
        height: 40,
        paddingVertical: 7,
        fontSize: 17,
    },
    reset__text: {
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.42,
        fontWeight: 400,
        fontFamily: "Sora400",
        color: '#2C88EC',
    }
})