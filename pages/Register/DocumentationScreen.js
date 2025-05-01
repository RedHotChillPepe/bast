import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RenderHTML from 'react-native-render-html';
import ChevronLeft from '../../assets/svg/ChevronLeft';

const DocumentationScreen = ({ selectedDocument, handleClose }) => {
    
    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <Pressable onPress={handleClose}>
                    <ChevronLeft />
                </Pressable>
                <Text style={styles.header__title}>{selectedDocument.title}</Text>
                <View />
            </View>
        );
    };

    const { width } = Dimensions.get('window');

    return (
        <View style={styles.container}>
            {renderHeader()}
            <ScrollView style={styles.scroll}>
                <RenderHTML
                    contentWidth={width - 32}
                    source={{ html: selectedDocument.content }}
                    baseStyle={styles.documentText}
                />
            </ScrollView>
            <TouchableOpacity onPress={handleClose} style={styles.acceptButton}>
                <Text style={styles.acceptText}>Принять</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scroll: {
        flex: 1,
    },
    documentText: {
        fontSize: 14,
        lineHeight: 17.6,
        color: '#3E3E3E',
        fontFamily: "Sora400",
        letterSpacing: -0.42
    },
    header: {
        justifyContent: "space-between",
        flexDirection: "row",
        paddingBottom: 16,
        alignItems: "center",
    },
    header__title: {
        color: "#3E3E3E",
        fontSize: 16,
        fontFamily: "Sora700",
        fontWeight: "600",
        lineHeight: 25.2,
        letterSpacing: -0.6,
    },
    acceptButton: {
        marginTop: 16,
        marginBottom: 28,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#2C88EC',
        borderRadius: 8,
    },
    acceptText: {
        color: '#F2F2F7',
        fontSize: 16,
        lineHeight: 20.17,
        letterSpacing: -0.48,
        fontFamily: "Sora700",
        fontWeight: 600
    }
});

export default DocumentationScreen;
