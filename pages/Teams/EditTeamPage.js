import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import ChevronLeft from '../../assets/svg/ChevronLeft';
import InputProperty from '../../components/PostComponents/InputProperty';
import { useApi } from '../../context/ApiContext';
import { useNavigation } from '@react-navigation/native';

export default function EditTeamPage(props) {
    const { handleClose, selectedTeam, setTeamsData, setSelectedTeam } = props;

    const { editTeam } = useApi();
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        team_name: selectedTeam.team_name ?? '',
        description: selectedTeam.description ?? '',
    });

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({ ...prevData, [field]: value.value || value }));
    };

    const renderHeader = () => {
        return <View style={styles.header}>
            <Pressable onPress={handleClose}>
                <ChevronLeft />
            </Pressable>
            <Text style={styles.header__title}>Редактирование команды</Text>
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
        const { team_name, description } = formData;

        const nameNotEmpty = team_name.trim() !== "" && team_name.length >= 4;
        const nameChanged = team_name !== selectedTeam.team_name;
        const descriptionChanged = (selectedTeam.description ?? '') !== (formData.description ?? '');

        return nameNotEmpty && (nameChanged || descriptionChanged);
    };

    const handleEditSubmit = async () => {
        try {
            const payload = {
                ...formData,
                team_id: selectedTeam.team_id,
            };
            const updatedTeam = await editTeam(payload);
            setSelectedTeam(updatedTeam);

            setTeamsData(prev =>
                prev.map(team =>
                    team.team_id === updatedTeam.team_id ? updatedTeam : team
                )
            );

            handleClose();
        } catch (error) {
            console.error("Ошибка при обновлении команды:", error);
            navigation.navigate("Error");
        }
    };


    return (
        <KeyboardAvoidingView style={styles.container} >
            {renderHeader()}
            < View style={styles.containerItem} >
                {renderInput()}
            </View>
            <Pressable
                style={[
                    styles.button,
                    { backgroundColor: isFormValidAndChanged() ? "#2C88EC" : "#2C88EC66" }
                ]}
                onPress={handleEditSubmit}
                disabled={!isFormValidAndChanged()}
            >
                <Text style={styles.button__text}>Сохранить</Text>
            </Pressable>
        </KeyboardAvoidingView >
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