import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ErrorScreen = ({ route }) => {
    const navigation = useNavigation();
    const { errorCode } = route.params || 0;
    const renderMessage = () => {
        let message = 'Ошибка! Повторите попытку позже.';
        switch (errorCode) {
            case 403:
                message = "Ой... Доступ к этой странице запрещен.";
                break;
            case 404:
                message = "Ой... Страница не найдена.";
                break;
            case 500:
                message = "На сервере произошла ошибка. Пожалуйста, подождите, мы скоро это исправим.";
                break;
            case 503:
                message = "Извините, запрашиваемый ресурс временно недоступен. Пожалуйста, попробуйте снова позже.";
                break;
            default:
                break;
        }
        return <Text style={styles.message}>{message}</Text>;
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {errorCode !== 0 && <Text style={{ fontSize: 40, fontWeight: 600, textAlign: 'center' }}>{errorCode}</Text>}
            <Text style={{ fontSize: 24, fontWeight: 600, textAlign: 'center' }}>{renderMessage()}</Text>
            <View>
                <Pressable style={{
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderWidth: 1,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 96
                }}
                    onPress={() => navigation.navigate("Main")}>
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 400 }}>На главную</Text>
                </Pressable>
            </View>

        </SafeAreaView >
    )
};

export default ErrorScreen;

const styles = StyleSheet.create({
});
