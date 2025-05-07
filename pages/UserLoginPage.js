import React, { useState } from 'react';
import { Dimensions, Pressable, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import ChevronLeft from '../assets/svg/ChevronLeft';
import InputProperty from '../components/PostComponents/InputProperty';
import { useToast } from '../context/ToastProvider';

const { width } = Dimensions.get('window');

const UserLoginPage = () => {
    const { getLogin, checkPhone } = useApi()
    const { setAuth } = useAuth()
    const showToast = useToast();
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: '',
    });

    const [formErrors, setFormErrors] = useState({
        phoneNumber: '',
        password: '',
        responseError: ''
    });

    const [prevPhone, setPrevPhone] = useState("");

    const [isResetPassword, setIsResetPassword] = useState(false);

    const handleSubmit = async () => {
        if (hasFormErrors()) {
            showToast("Пожалуйста, исправьте ошибки в форме", "warn");
            return;
        }

        const normalPhoneNumber = normalizePhoneNumber(formData.phoneNumber);
        try {
            const response = await getLogin(normalPhoneNumber, formData.password)
            await setAuth([{
                access_token: response.access_token,
                refresh_token: response.refresh_token
            }])
            return;
        } catch (error) {
            console.error(error.message);
            showToast(error.message, "warn");
        }
    }

    const handleResetPassword = async () => {
        try {
            const normalPhoneNumber = normalizePhoneNumber(formData.phoneNumber);
            const result = await checkPhone(normalPhoneNumber, isResetPassword);
            if (result.statusCode !== 200) throw new Error(result.message);
            navigation.navigate("ConfirmationPage", {
                regData: {
                    phoneNumber: normalPhoneNumber,
                },
                isResetPassword
            });
        } catch (error) {
            console.log(error.message);
            showToast(error.message, "warn");
        }
    }

    const normalizePhoneNumber = (text) => {
        if (!text) return "";
        // Убираем все нецифровые символы
        let cleaned = text.replace(/\D/g, "");

        // Если номер начинается с "7", заменяем на "8", иначе добавляем "8" в начале
        if (cleaned.startsWith("7")) {
            cleaned = "8" + cleaned.slice(1);
        } else {
            cleaned = "8" + cleaned;
        }

        // Если цифр больше 11, обрезаем до 11
        if (cleaned.length > 11) {
            cleaned = cleaned.slice(0, 11);
        }

        // Возвращаем в формате +79999999999
        return cleaned;
    };

    const handleChangePhone = (field, value) => {
        const formatted = formatPhoneNumber(value, prevPhone);
        setFormData((prevData) => ({ ...prevData, [field]: formatted }));
        setFormErrors((prev) => ({ ...prev, [field]: formatted.length === 18 ? "" : "Не верный формат номера телефона" }))
        setPrevPhone(formatted);
    };

    const formatPhoneNumber = (text, previousText) => {
        if (!text) return "";

        // Если пользователь удаляет символы, не переформатируем (чтобы не «скакала» маска)
        if (previousText && previousText.length > text.length) return text;

        // Убираем все нецифровые символы
        let cleaned = text.replace(/\D/g, "");

        // Нормализуем номер: если начинается с "7" или "8" – заменяем на "7", иначе добавляем "7" в начале
        if (cleaned.startsWith("7") || cleaned.startsWith("8")) {
            cleaned = "7" + cleaned.slice(1);
        } else {
            cleaned = "7" + cleaned;
        }

        // Ограничиваем длину до 11 цифр (код +10 цифр)
        cleaned = cleaned.slice(0, 11);

        // Форматируем номер в зависимости от количества цифр
        if (cleaned.length <= 1) {
            return "+7";
        } else if (cleaned.length <= 4) {
            // Например: +7 (912
            return `+7 (${cleaned.slice(1)}`;
        } else if (cleaned.length <= 7) {
            // Например: +7 (912) 345
            const match = cleaned.match(/7(\d{3})(\d{0,3})/);
            if (match) return `+7 (${match[1]}) ${match[2]}`;
        } else if (cleaned.length <= 9) {
            // Например: +7 (912) 345-67
            const match = cleaned.match(/7(\d{3})(\d{3})(\d{0,2})/);
            if (match) return `+7 (${match[1]}) ${match[2]}-${match[3]}`;
        } else {
            // Например: +7 (912) 345-67-89
            const match = cleaned.match(/7(\d{3})(\d{3})(\d{2})(\d{0,2})/);
            if (match) return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
        }

        return text;
    };

    // Разрешённые символы: ASCII от 33 (!) до 126 (~)
    const allowedRegex = /^[\x21-\x7E]*$/;
    const handlePasswordChange = (field, value) => {
        if (!allowedRegex.test(value)) {
            setFormErrors((prev) => ({ ...prev, [field]: "Введён недопустимый символ" }));
            return;
        }

        setFormErrors((prev) => ({ ...prev, [field]: "" }));
        setFormData((prevData) => ({ ...prevData, [field]: value }));
    };

    const hasFormErrors = () => {
        // Проверка ошибок валидации (только для активных полей)
        const activeFormErrors = isResetPassword
            ? { phoneNumber: formErrors.phoneNumber }  // В режиме восстановления пароля - только телефон
            : formErrors;                             // Иначе - все ошибки

        if (Object.values(activeFormErrors).some(error => error !== "")) {
            return true;
        }

        let result = false;

        // Проверка обязательных полей (только для активных полей)
        const requiredFields = isResetPassword
            ? { phoneNumber: "Телефон обязателен" }    // В режиме восстановления пароля - только телефон
            : {                                        // Иначе - телефон и пароль
                phoneNumber: "Телефон обязателен",
                password: "Пароль обязателен",
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
            <Pressable onPress={() => isResetPassword ? setIsResetPassword(false) : navigation.goBack()}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>{isResetPassword ? "Восстановление пароля" : "Авторизация"}</Text>
            <View />
        </View >
    }

    const listInput = [
        { label: "Телефон", placeholder: "+7 (ХХХ) ХХХ-ХХ-ХХ", valueName: "phoneNumber", type: "tel", error: formErrors.phoneNumber },
        { label: "Пароль", placeholder: "Пароль", valueName: "password", type: "password", error: formErrors.password },
    ];

    const handleInputChange = (field, value) => {
        switch (field) {
            case "phoneNumber":
                handleChangePhone(field, value);
                break;
            case "password":
                handlePasswordChange(field, value);
                break;
        }
    };

    const renderInput = () => {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignSelf: 'stretch', marginHorizontal: 16, }}>
                <Text style={styles.titleText}>Данные пользователя</Text>
                <View style={styles.input__container}>
                    {listInput.filter((item) => {
                        if (!isResetPassword) return true;
                        return item.valueName === 'phoneNumber';
                    }).map((item, index) => (
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
                <TouchableOpacity
                    onPress={() => setIsResetPassword(!isResetPassword)}
                    style={{ marginTop: 16 }}
                >
                    <Text style={styles.reset__text}>{isResetPassword ? "Я вспомнил пароль" : "Забыли пароль?"}</Text>
                </TouchableOpacity>
            </View >)
    }

    const renderSubmitButton = () => {
        return <TouchableOpacity style={[styles.button, { opacity: hasFormErrors() ? 0.5 : 1 }]}
            disabled={hasFormErrors()}
            onPress={() => isResetPassword ? handleResetPassword() : handleSubmit()}>
            <Text style={styles.button__text}>
                {isResetPassword ? "Сбросить пароль" : "Подтвердить"}
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

export default UserLoginPage

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