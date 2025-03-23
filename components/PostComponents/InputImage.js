import AntDesign from '@expo/vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useToast } from "../../context/ToastProvider";

const { width } = Dimensions.get('window');

const containerHorizontalPadding = 16;
const gap = 16;
const containerWidth = width - 16;
const availableWidth = containerWidth - 2 * containerHorizontalPadding;

const InputImage = (props) => {
    const { setFormData, photos } = props;
    const showToast = useToast();
    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast('Разрешите доступ к фото, чтобы загружать изображения!', "warn");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: 20,
            quality: 1,
            base64: true
        });

        if (result.canceled) return;

        const newPhotos = result.assets.map(asset => ({
            filename: asset.fileName || null,
            base64: asset.base64,
            uri: asset.uri,
        }));

        setFormData(prevData => ({
            ...prevData,
            photos: [...prevData.photos, ...newPhotos],
        }));
        showToast('Изображения успешно добавлены!');
    };

    const removePhoto = (uri) => {
        setFormData(prevData => ({
            ...prevData,
            photos: prevData.photos.filter(item => item.uri !== uri)
        }));
    };

    // Группируем фото в ряды по 4 элемента
    const groupPhotos = (photosArray, itemsPerRow = 4) => {
        const rows = [];
        for (let i = 0; i < photosArray.length; i += itemsPerRow) {
            rows.push(photosArray.slice(i, i + itemsPerRow));
        }
        return rows;
    };

    const rows = groupPhotos(photos, 4);

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.title}>Фотографии</Text>
            <View style={styles.photoContainer}>
                {photos.length === 0 &&
                    <View style={styles.photoContainer__title}>
                        <Text style={styles.header}>Фото</Text>
                    </View>}
                {/* Галерея выбранных фото */}
                <View style={styles.galleryContainer}>
                    {rows.map((row, rowIndex) => {
                        const rowLength = row.length;
                        // Вычисляем ширину для каждого фото в данном ряду
                        const photoWidth = (availableWidth - gap * (rowLength - 1)) / rowLength;
                        return (
                            <View key={rowIndex} style={[styles.row]}>
                                {row.map((item, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.photoWrapper,
                                            {
                                                width: photoWidth,
                                                height: photoWidth,
                                                marginRight: index !== rowLength - 1 ? gap : 0,
                                            },
                                        ]}
                                    >
                                        <Image source={{ uri: item.uri }} style={styles.photo} />
                                        <Pressable
                                            style={styles.removeIcon}
                                            onPress={() => removePhoto(item.uri)}
                                        >
                                            <AntDesign name="close" size={20} color="white" />
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
                {photos.length === 0 && (
                    <View style={styles.photoContainer__button}>
                        <Pressable style={styles.button} onPress={pickImages}>
                            <AntDesign name="addfile" size={24} color="white" />
                            <Text style={styles.buttonText}>Загрузить изображения</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </View >
    );
};

export default InputImage;

const styles = StyleSheet.create({
    inputContainer: {
        width: width - 16,
        marginVertical: 16,
    },
    title: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: '600',
    },
    photoContainer: {
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#A1A1A1",
        width: "100%",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#F5F5F5",
    },
    photoContainer__title: {
        alignSelf: "stretch",
    },
    header: {
        color: "#808080",
        fontSize: 14,
    },
    galleryContainer: {
        alignSelf: 'stretch',
        gap: 16,
    },
    row: {
        flexDirection: 'row',
    },
    photoWrapper: {
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    removeIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#2C88EC',
        borderRadius: "50%", // число, а не процент
        padding: 4,
    },
    photoContainer__button: {
        marginTop: 16,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2C88EC",
        padding: 12,
        borderRadius: 12,
        alignSelf: "stretch",
        justifyContent: "center",
        marginBottom: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: '400',
        marginLeft: 8,
    },
});
