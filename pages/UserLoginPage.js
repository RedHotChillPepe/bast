import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const UserLoginPage = () => {
    const { getLogin } = useApi()
    const { setAuth } = useAuth()

    const [phoneNumber, setPhoneNumber] = useState('')
    const [prevPhone, setPrevPhone] = useState("");

    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState("");

    const [isPhoneLabelShown, setIsPhoneLabelShown] = useState(false)
    const [isAuthLabelShown, setIsAuthLabelShown] = useState(false)

    const handleSubmit = async () => {
        const phonePattern = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/g

        let isCorrect = (errorMessage.length == 0);
        if (!phonePattern.test(phoneNumber)) {
            setIsPhoneLabelShown(true)
            isCorrect = false;
        }

        if (!password) {
            setErrorMessage("Необходимо указать пароль");
            isCorrect = false;
        }

        if (!isCorrect) return;

        const normalPhoneNumber = normalizePhoneNumber(phoneNumber);
        console.log(normalPhoneNumber);
        setIsPhoneLabelShown(false)
        const response = await getLogin(normalPhoneNumber, password)
        const responseJson = JSON.parse([await response.text()])
        console.log(await response);

        if (await response.status == 200) {
            console.log(responseJson);

            if (await responseJson.result) {
                const authResp = await setAuth([{
                    status: true,
                    onboarded: false,
                    phone: normalPhoneNumber,
                    password: responseJson.hash,
                    id: responseJson.id,
                    usertype: responseJson.usertype
                }])
                return;
            }
            setIsAuthLabelShown(true)
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

    const handleChangePhone = (text) => {
        const formatted = formatPhoneNumber(text, prevPhone);
        setPhoneNumber(formatted);
        setPrevPhone(formatted);
    };

    const formatPhoneNumber = (text, previousText) => {
        if (!text) return "";
        setIsPhoneLabelShown(text.length !== 18);
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
    const handlePasswordChange = (text) => {
        if (!allowedRegex.test(text)) {
            setErrorMessage("Введён недопустимый символ");
            return;
        }

        setPassword(text);
        if (text.length > 0 && text.length < 6) {
            setErrorMessage("Пароль должен содержать минимум 6 символов");
            return;
        }

        setErrorMessage("");
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.block}>
                <View style={styles.title}>
                    <Text style={styles.titleText} >Телефон:</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="+7 (912) 444-22-11"
                    keyboardType='phone-pad'
                    maxLength={18}
                    value={phoneNumber}
                    onChangeText={text => handleChangePhone(text)}
                    placeholderTextColor='rgba(60,60,67, 0.6'
                    fontSize={17}
                />
                {
                    isPhoneLabelShown
                    &&
                    <Text style={styles.inputLabel}>Неверный номер телефона</Text>
                }
            </View>

            <View style={styles.block}>
                <View style={styles.title}>
                    <Text style={styles.titleText} >Пароль:</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => handlePasswordChange(text)}
                    maxLength={20}
                    placeholderTextColor='rgba(60,60,67, 0.6'
                    fontSize={17}
                />
                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
            </View>

            <Pressable style={{ backgroundColor: '#007AFF', paddingVertical: 7, paddingHorizontal: 14, borderRadius: 12, marginTop: 32 }}
                //  onPress={() => setIsAuth(true)}
                onPress={() => handleSubmit()}>
                <Text style={{ fontSize: 20, color: 'white' }}>
                    Подтвердить
                </Text>
            </Pressable>

            {
                isAuthLabelShown
                &&
                <Text style={styles.inputLabel}>Неверный номер телефона или пароль</Text>
            }


        </SafeAreaView>
    )
}

export default UserLoginPage

const styles = StyleSheet.create({
    block: {
        width: width * 0.6,
        marginBottom: 24
    },
    errorText: {
        marginTop: 8,
        color: "red",
        fontSize: 14,
    },

    title: {
        marginBottom: 4
    },

    titleText: {
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: -0.45,
        fontWeight: '500',
        marginBottom: 8,
    },

    input: {
        backgroundColor: 'rgba(120,120,128, 0.12)',
        height: 40,
        width: width * 0.6,
        marginBottom: 12,
        borderRadius: 12,
        paddingVertical: 7,
        paddingHorizontal: 8,
    },
    inputLabel: {
        color: "red"
    }
})