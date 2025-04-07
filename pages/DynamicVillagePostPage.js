import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { Geocoder, Marker, YaMap } from 'react-native-yamap';
import CustomModal from '../components/CustomModal';
import HouseCard from '../components/HouseCard';
import ImageCarousel from '../components/ImageCarousel';
import { useApi } from '../context/ApiContext';
import DynamicHousePostPage from './DynamicHousePostPage';
import ChevronLeft from './../assets/svg/ChevronLeft';
import ShareIcon from './../assets/svg/Share';
import { useToast } from "../context/ToastProvider";
import { useLogger } from '../context/LoggerContext';

const { width, height } = Dimensions.get("window");

export const DynamicVillagePostPage = ({ navigation, route }) => {
    const villageId = route.villageId || route.params.villageId;
    const timestamp = route.params?.timestamp || 0;
    const [isInteractingWithMap, setIsInteractingWithMap] = useState(false);
    const [selectedList, setSelectedList] = useState("active");
    const [isGeoLoaded, setIsGeoLoaded] = useState(false);
    const [geoState, setGeoState] = useState({ lat: 0, lon: 0 });
    const [villageData, setVillageData] = useState({});
    const [activePost, setActivePost] = useState([]);
    const [closedPost, setClosedPost] = useState([]);
    const showToast = useToast();

    const isModal = route.isModal || false;
    const mapRef = useRef(null);

    const { logError } = useLogger();
    const { getVillage } = useApi();

    // Получение данных объявления и пользователя
    useEffect(() => {
        if (!villageId) return;
        fetchVillage();
    }, [villageId, timestamp]);

    const [isModalShow, setIsModalShow] = useState(false);
    const [selectedPost, setSelectedPost] = useState();

    const handleSelected = (post) => {
        if (!post) return;
        setSelectedPost(post);
        setIsModalShow(true);
    };

    const fetchVillage = async () => {
        getVillage(villageId)
            .then(async response => {
                setVillageData(response)
                const addressString = `${response.city} ${response.full_address}`;
                if (!response.latitude || !response.longitude) {
                    Geocoder.addressToGeo(addressString)
                        .then(({ lat, lon }) => {
                            setGeoState({ lat, lon });
                        })
                        .finally(() => setIsGeoLoaded(true));
                } else {
                    setGeoState({
                        lat: parseFloat(response.latitude),
                        lon: parseFloat(response.longitude),
                    });
                    setIsGeoLoaded(true);
                }

                if (!response.houses) return

                setActivePost(await getPostDataByStatus(response.houses, 1));
                setClosedPost(await getPostDataByStatus(response.houses, 3));
            })
            .catch(err => {
                logError(navigation.getState().routes[0].name, err, { villageId, handleName: "fetchVillage" });
            });
    }

    const getPostDataByStatus = (houses, status) => {
        return houses.filter(item => item.status == status);
    }

    const specsList = [
        { value: villageData.year_of_completion, caption: 'Год сдачи' },
        { value: villageData.class_name, caption: 'Класс' },
    ];

    const renderHouseSpecs = () => {
        if (Object.keys(villageData).length === 0) {
            return <ActivityIndicator size="large" color="#32322C" />;
        }

        return (
            <View style={styles.specView}>
                {specsList.map((spec, index) => (
                    <View style={styles.specElement} key={index}>
                        <Text style={styles.caption1}>
                            {spec.caption}
                        </Text>
                        <Text style={styles.specText}>
                            {spec.value}
                        </Text>
                    </View>
                ))}
            </View>
        );
    };

    const sharePost = async () => {
        try {
            const { name, full_address, description, class_name } = villageData;
            const url = `${process.env.EXPO_PUBLIC_API_HOST}share/village/${villageId}`;
            const postName = name ? name : 'Поселение';
            const address = `📍 Адрес: ${full_address}`;
            const priceInfo = `💰 Тип: ${class_name}.`;
            const text = description ? description : 'Описание отсутствует';

            const message = `
🏡 ${postName}
${address}
${priceInfo}
📄 Описание: ${text}
🔗 Посмотри это объявление: ${url}
          `;

            const shareOptions = {
                message,
            };

            await Share.share(shareOptions);
        } catch (error) {
            logError(navigation.getState().routes[0].name, error, { villageData, handleName: "sharePost" });
            showToast('Ошибка при попытке поделиться объявлением', "error")
        }
    };


    const renderMap = () => {
        return <View style={styles.addressView}>
            <Text style={styles.infoTitle}>На карте</Text>
            <View style={{ borderRadius: 16, width: width, alignSelf: 'center' }}>
                {isGeoLoaded ? (
                    process.env.NODE_ENV !== "development" ? (
                        <View onTouchStart={() => setIsInteractingWithMap(true)} onTouchEnd={() => setIsInteractingWithMap(false)}>
                            <YaMap
                                ref={mapRef}
                                style={styles.map}
                                onMapLoaded={() => { mapRef.current.setCenter({ lon: geoState.lon, lat: geoState.lat }, 10) }}
                            >
                                <Marker point={{ lat: geoState.lat, lon: geoState.lon }} scale={0.25} source={require('../assets/marker.png')} />
                            </YaMap>
                        </View>
                    ) : <Text style={{ color: "red", fontSize: 24, textAlign: "center" }}>Карта</Text>
                ) : (
                    <Text style={{ alignSelf: 'center' }}>Загрузка Карты...</Text>
                )}
            </View>
        </View>
    }

    const renderBlockDescription = () => {
        if (!villageData.description) return;
        return <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Описание</Text>
            <Text style={styles.descriptionText}>
                {villageData.description}
            </Text>
        </View>
    }

    const listSelectProperties = [
        { title: "Активные", value: "active", id: 1 },
        { title: "Закрытые", value: "closed", id: 2 },
    ]

    const renderSelectors = () => {
        return (
            <View style={styles.searchButtonsView}>
                {listSelectProperties.map((item) => (
                    <Pressable
                        key={`postsSelector-${item.id}`}
                        onPress={() => setSelectedList(item.value)}
                        style={[selectedList === item.value && styles.activeButton, styles.searchButtonsContent]}>
                        <Text style={[selectedList === item.value ? styles.activeButtonsText : styles.searchButtonsText]}>{item.title}</Text>
                    </Pressable>
                ))}
            </View>
        )
    }

    const renderTitleBlock = () => {
        return (
            <View style={styles.titleBlock}>
                {Object.keys(villageData).length === 0 ?
                    <ActivityIndicator size="large" color="#32322C" /> :
                    <View>
                        <Text style={styles.titleText}>
                            {villageData.name}
                        </Text>
                        <View style={{ width: 16 }} />
                        <Text style={styles.addressText}>
                            {villageData.city}, {villageData.full_address}
                        </Text>
                    </View>
                }
            </View>
        );
    };

    // TODO: прогружать страницами.
    // let hasMore = false;
    const renderHouseItem = () => {
        // hasMore = true;
        if (selectedList == "active" && activePost.length == 0
            || selectedList == "closed" && closedPost.length == 0) {
            // hasMore = false;
            return <View height={104}><Text style={{ textAlign: "center", marginVertical: 16 }}>Постов больше нет</Text></View>;
        }

        const selectedData = selectedList == "active" ? activePost : closedPost;
        return selectedData.map((item) => (
            <HouseCard
                key={`house-item-${item.id}`}
                item={item}
                navigation={navigation}
                isModal={true}
                handleSelected={handleSelected}
                itemWidth={width - 32}
            />))
    }

    const handleBack = () => {
        if (isModal) {
            route.setIsModalShow(false);
            return
        }

        const canGoBack = navigation.canGoBack();
        if (canGoBack) {
            navigation.goBack();
            return
        };

        navigation.navigate("Main");
    }

    const renderHeader = () => {
        return (
            <View style={{
                flexDirection: "row", justifyContent: "space-between", width, alignItems: "center",
                paddingBottom: 8, backgroundColor: "#F2F2F7", paddingHorizontal: 17
            }}>
                <Pressable onPress={handleBack}>
                    <ChevronLeft />
                </Pressable>
                <Pressable onPress={sharePost}>
                    <ShareIcon />
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
                scrollEnabled={!isInteractingWithMap}>
                {renderHeader()}
                <ImageCarousel postData={villageData} />
                {renderTitleBlock()}
                {renderHouseSpecs()}
                {renderBlockDescription()}
                {renderMap()}
                {renderSelectors()}
                {renderHouseItem()}
                {/* <Pressable style={[{ display: hasMore ? "flex" : "none" }, styles.button]}> */}
                <Pressable style={[{ display: "none" }, styles.button]}>
                    <Text style={styles.buttonText}>Показать все</Text>
                </Pressable>
            </ScrollView>
            {selectedPost && (
                <CustomModal
                    isVisible={isModalShow}
                    onClose={() => setIsModalShow(false)}
                >
                    <DynamicHousePostPage
                        navigation={navigation}
                        route={{
                            houseId: selectedPost,
                            isModal: true,
                            setIsModalShow,
                        }}
                    />
                </CustomModal>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5EA',
        height: height - 120,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 16
    },
    specView: {
        flexDirection: 'row',
        width: width - 32,
        marginTop: 16,
        columnGap: 5,
    },
    specElement: {
        alignItems: 'stretch',
        padding: 12,
        gap: 8,
        backgroundColor: "#F2F2F7",
        borderRadius: 12,
    },
    caption1: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "Sora400",
        lineHeight: 16,
        letterSpacing: -0.36,
        color: "#3E3E3E",
    },
    specText: {
        fontSize: 17,
        color: "#3E3E3E",
        letterSpacing: -0.48,
        lineHeight: 20,
        fontWeight: "600",
        fontFamily: "Sora700",
    },
    infoBlock: {
        width: width - 32,
        marginTop: 19
    },
    infoTitle: {
        fontSize: 16,
        fontFamily: "Sora700",
        fontStyle: "normal",
        color: "#3E3E3E",
        letterSpacing: -0.48,
        lineHeight: 20,
        fontWeight: 600,
        marginBottom: 4,
    },
    descriptionText: {
        color: "#3E3E3E",
        fontFamily: "Sora00",
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.42,
    },
    searchButtonsView: {
        flexDirection: "row",
        width: width - 32,
        borderRadius: 16,
        padding: 4,
        backgroundColor: "#F2F2F7",
        alignItems: "center",
        alignSelf: "stretch",
        justifyContent: "space-between",
        marginLeft: 16,
        marginTop: 32,
    },
    searchButtonsContent: {
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1
    },
    activeButton: {
        backgroundColor: '#2C88EC',
        borderRadius: 12,
    },
    searchButtonsText: {
        color: "#808080",
        fontWeight: "400",
        fontSize: 14,
        lineHeight: 17.6,
        letterSpacing: -0.43,
        fontFamily: "Sora400"
    },
    activeButtonsText: {
        fontWeight: "600",
        color: "#F2F2F7",
        fontFamily: "Sora700",
        fontSize: 14,
    },
    titleBlock: {
        flexDirection: 'row',
        width: width - 32,
        justifyContent: 'space-between',
        marginTop: 16,
        alignSelf: 'center'
    },
    imageMap: {
        width: width - 32,
        height: width * 0.34,
        borderRadius: 12,
        marginVertical: 8,
        marginLeft: 12,
        alignSelf: 'center'
    },
    titleText: {
        fontSize: 24,
        lineHeight: 25.2,
        letterSpacing: -0.6,
        fontWeight: "600",
        fontFamily: "Sora700",
        color: "#3E3E3E",
    },
    addressView: {
        width: width - 32,
        marginTop: 24,
        alignSelf: 'center'
    },
    addressText: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: -0.36,
        color: "#808080",
        fontFamily: "Sora400",
        fontWeight: 400
    },
    button: {
        marginTop: 16,
        backgroundColor: '#2C88EC',
        padding: 12,
        width: width - 32,
        borderRadius: 12,
        alignItems: 'center'
    },
    buttonText: {
        color: '#F2F2F7',
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: -0.48,
        fontWeight: "600",
        fontFamily: "Sora700",
    },
});