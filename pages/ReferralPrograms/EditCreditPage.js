import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ChevronLeft from '../../assets/svg/ChevronLeft';
import { useTheme } from '../../context/ThemeContext';
import InputProperty from './../../components/PostComponents/InputProperty';

const EditCreditPage = (props) => {
    const { theme } = useTheme();
    const styles = makeStyle(theme);

    const { handleClose, formData, setFormData, setCardNumber } = props;

    const handleInput = (field, value) => {
        // Удаляем все пробелы и недопустимые символы
        const digitsOnly = value.replace(/\D/g, '');

        // Ограничиваем длину до 16 цифр
        const limited = digitsOnly.slice(0, 16);

        // Форматируем в блоки по 4 цифры
        const formatted = limited.replace(/(.{4})/g, '$1 ').trim();

        setFormData((prev) => ({ ...prev, [field]: formatted }));
    };

    const isValidCardNumber = (number) => {
        const cleanNumber = number.replace(/\s+/g, '');

        // Регулярное выражение для проверки формата карты
        const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

        if (!cardRegex.test(cleanNumber)) {
            return false;
        }

        // Алгоритм Луна
        let sum = 0;
        let shouldDouble = false;

        for (let i = cleanNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cleanNumber.charAt(i), 10);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        return sum % 10 === 0;
    };


    const handleSubmit = () => {
        const rawCardNumber = formData.card_number.replace(/\s+/g, '');
        console.log(formData);
        if (!isValidCardNumber(formData.card_number)) {
            alert("Некорректный номер карты");
            return;
        }

        // пример отправки
        const payload = {
            ...formData,
            card_number: rawCardNumber
        };

        // тут отправка данных (API или сохранение в БД)
        console.log("Saving:", payload);
        setCardNumber(formData.card_number)
    }

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Счет для вознаграждения</Text>
            <View />
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={{ marginBottom: theme.spacing.large, flexDirection: "row", alignItems: "stretch" }}>
                <InputProperty
                    title={"Номер банковской карты"}
                    type="number"
                    placeholder={"0000 1111 2222 3333"}
                    value={formData.card_number}
                    valueName={'card_number'}
                    handleInputChange={handleInput}
                />
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                style={theme.buttons.classisButton}
            >
                <Text style={theme.typography.buttonTextXL}>Сохранить</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const makeStyle = (theme) => StyleSheet.create({
    container: theme.container,
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: theme.spacing.xLarge,
        alignItems: "center",
    },
    header__title: theme.typography.title2,
});

export default EditCreditPage