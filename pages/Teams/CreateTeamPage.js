import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import ChevronLeft from '../../assets/svg/ChevronLeft';
import InputProperty from '../../components/PostComponents/InputProperty';
import TeamInvationPage from './TeamInvationPage';
import { useApi } from '../../context/ApiContext';

export default function CreateTeamPage(props) {
    const { handleClose, setTeamsData } = props;
    const [formData, setFormData] = useState({
        team_id: null,
        team_name: '',
        description: '',
    });

    const { createTeam } = useApi();

    const [isShowInvationModal, setIsShowInvationModal] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value.value || value }));
    };

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Создание команды</Text>
            <View />
        </View>
    }

    const inputList = [
        { text: "Название", placeholder: "Адские Псы", valueName: "team_name" },
        { text: "Описание", placeholder: "Работа с ипотечными клиентами", valueName: "description" },
    ]

    const renderInput = () => {
        return (<View>
            <View style={propertyStyle.container}>
                {inputList.map((item, index) => (
                    <View View key={index} style={propertyStyle.row} >
                        <InputProperty
                            title={item.text}
                            placeholder={item.placeholder}
                            value={formData[item.valueName]}
                            valueName={item.valueName}
                            handleInputChange={handleInputChange}
                        />
                    </View>)
                )}
            </View>
        </View>)
    }

    const isFormValidAndChanged = () => {
        const { team_name } = formData;
        return team_name.trim() !== "" && team_name.length >= 4;
    };

    const handleNext = async () => {
        if (!formData.team_name) return;

        try {
            const response = await createTeam(formData);
            if (response.statusCode && response.statusCode !== 201) throw new Error(response.message)
            setTeamsData((prev) => [...prev, response]);
            setFormData((prevData) => ({ ...prevData, team_id: response.team_id }));
            setIsShowInvationModal(true);
        } catch (error) {
            console.error("Произошла ошибка при создании команды:", error.message);
            navigator.navigate("Error", { messageProp: "Произошла ошибка при создании команды" })
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            {renderHeader()}
            <View style={styles.containerItem}>
                {renderInput()}
            </View>
            <Pressable
                style={[
                    styles.button,
                    { backgroundColor: isFormValidAndChanged() ? "#2C88EC" : "#2C88EC66" }
                ]}
                onPress={handleNext}
                disabled={!isFormValidAndChanged()}
            >
                <Text style={styles.button__text}>Далее</Text>
            </Pressable>


            <Modal visible={isShowInvationModal}><TeamInvationPage handleClose={() => setIsShowInvationModal(false)} teamData={formData} /></Modal>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E5E5EA",
        padding: 16,
        flex: 1,
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
        flex: 1
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
    }
});

const propertyStyle = StyleSheet.create({
    container: {
        gap: 24,
    },
    row: {
        columnGap: 16,
        flexDirection: "row",
    }
})