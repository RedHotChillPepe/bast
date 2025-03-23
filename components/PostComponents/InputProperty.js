import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const InputProperty = (props) => {
    const { placeholder, title, type, valueName, value, options, handleInputChange, keyboardType } = props;

    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={options}
                        labelField="label"
                        valueField="value"
                        placeholder={placeholder}
                        value={value}
                        onChange={(value) => handleInputChange(valueName, value)}
                    />
                );
            case 'textarea':
                return (
                    <TextInput
                        style={[styles.input, styles.textarea]}
                        placeholder={placeholder}
                        placeholderTextColor="#A1A1A1"
                        value={value}
                        keyboardType={keyboardType || "default"}
                        multiline={true}
                        numberOfLines={14}
                        onChangeText={(value) => {
                            handleInputChange(valueName, value);
                        }}
                    />
                );
            default: // обычный инпут
                return (
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor="#A1A1A1"
                        keyboardType={keyboardType || "default"}
                        value={value}
                        onChangeText={(value) => {
                            handleInputChange(valueName, value);
                        }}
                    />
                );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {renderInput()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: "#A1A1A1",
        backgroundColor: "#F5F5F5",
        flex: 1,
    },
    title: {
        color: "#808080",
        fontSize: 12,
        fontWeight: "400",
        marginBottom: 4,
    },
    input: {
        color: "#3E3E3E",
        fontSize: 14,
        padding: 0,
        margin: 0,
        textAlignVertical: "center",
        lineHeight: 17,
    },
    dropdown: {
        justifyContent: "center",
    },
    placeholderStyle: {
        fontSize: 14,
        color: "#A1A1A1",
        paddingVertical: 0,
    },
    selectedTextStyle: {
        fontSize: 14,
        color: "#3E3E3E",
        paddingVertical: 0,
    },
    textarea: {
        height: 240,
        textAlignVertical: "top",
    },
});

export default InputProperty;
