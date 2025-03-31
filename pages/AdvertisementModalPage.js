import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const AdvertisementModalPage = (props) => {
    const { isVisible, closeModal } = props;
    const { imageSrc, title, description, durationDate } = props.selectedBannerData || {};
    const formatTheDate = (durationDate) => {
        if (!durationDate) return "xx месяц xxxx";
        let formateDate = new Date(durationDate);
        return formateDate.toLocaleDateString("ru", {
            day: '2-digit',
            month: "long",
            year: "numeric"
        });
    };

    return (
        <Modal visible={isVisible} animationType='slide'>
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Pressable style={styles.headerContainer} onPress={closeModal}>
                        <AntDesign name="closecircleo" size={18} color="#808080" />
                    </Pressable>
                    <View style={styles.bannerImageView}>
                        <Image style={styles.bannerImage} source={{ uri: imageSrc }} />
                    </View>
                    <View style={styles.bannerContent}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text>
                            <Text style={styles.dateText}>Акция действует: до {formatTheDate(durationDate)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: "flex-end", paddingHorizontal: 16, marginBottom: 48 }}>
                    <Button buttonHandle={() => console.log("заявка!")} title="Оставить заявку" />
                </View>
            </View>
        </Modal >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-end",
    },
    headerContainer: {
        width: width,
        paddingVertical: 6,
        paddingRight: 20,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    bannerImageView: {
        height: 200,
    },
    bannerImage: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: 'cover',
    },
    bannerContent: {
        padding: 16,
        justifyContent: "space-between",
        alignItems: "flex-end",
        flex: 1,
    },
    textContainer: {
        width: "100%",
        flex: 1,
    },
    title: {
        fontWeight: '600',
        fontSize: 14,
        color: "#3E3E3E",
        marginBottom: 8,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        color: "#3E3E3E",
        marginBottom: 8,
    },
    dateText: {
        fontSize: 13,
        color: "#3E3E3E",
        marginTop: 20,
        marginBottom: 16,
    },
});

export default AdvertisementModalPage;
