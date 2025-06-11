import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Geocoder, Marker, YaMap } from "react-native-yamap";
import BackIcon from "../assets/svg/ChevronLeft";
import ShareIcon from "../assets/svg/Share";
import CustomModal from "../components/CustomModal";
import ImageCarousel from "../components/ImageCarousel";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";
import { useLogger } from "../context/LoggerContext";
import { useToast } from "../context/ToastProvider";
import ChatScreen from "./Chats/ChatScreen";
import EditHousePostPage from "./EditHousePostPage";
import MortgageCalculator from "./MortgageCalculator";
import ProfilePageView from "./ProfilePageView";
import ServicesPage from "./Services/ServicesPage";
import { useShare } from "../context/ShareContext";

const { width, height } = Dimensions.get("window");

export default function DynamicHousePostPage({ navigation, route }) {
  const { sharePost, shareProfile } = useShare();

  const houseId = route.houseId || route.params.houseId;
  const timestamp = route.params?.timestamp || 0;
  const isModal = route.isModal || false;
  const {
    getPost,
    getIsOwner,
    getUserByID,
    updateStatus,
    getCurrentUser,
    createChat,
  } = useApi();
  const { getAuth } = useAuth();
  const showToast = useToast();

  const { toggleFavorite, isFavorite } = useFavorites();

  const [postData, setPostData] = useState({});
  const [isGeoLoaded, setIsGeoLoaded] = useState(false);
  const [geoState, setGeoState] = useState({ lat: 0, lon: 0 });
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [ownerUser, setOwnerUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [isInteractingWithMap, setIsInteractingWithMap] = useState(false);
  const [showModalSeller, setShowNodalSeller] = useState(false);
  const [isShowChatModal, setIsShowChatModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [chatData, setChatData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isMapFullScreen, setIsMapFullScreen] = useState(false); // State for full-screen map

  const { logError } = useLogger();

  const [selectedItem, setSelectedItem] = useState();
  const [isShowModal, setIsShowModal] = useState(false);

  const handleSelected = (item) => {
    setSelectedItem(item);
    setIsShowModal(true);
  };

  const mapRef = useRef(null);
  const fullScreenMapRef = useRef(null); // Ref for full-screen map

  // Получение данных объявления и пользователя
  useEffect(() => {
    const fetchData = async () => {
      if (!houseId) {
        return;
      }

      const result = await getPost(houseId);
      const post = result[0];
      setPostData(result[0]);

      // Получаем пользователя-автора объявления
      let ownerTypeStr = "user";
      switch (post.poster_type) {
        case 2:
          ownerTypeStr = "company";
          break;
        case 3:
          ownerTypeStr = "realtor";
          break;
        default:
          break;
      }
      const tempUser = await getUserByID(post.poster_id, ownerTypeStr);
      setOwnerUser(tempUser);
      // Геокодирование, если координаты не заданы
      const addressString = `${post.city} ${post.full_address}`;
      if (!post.latitude || !post.longitude) {
        Geocoder.addressToGeo(addressString)
          .then(({ lat, lon }) => {
            setGeoState({ lat, lon });
          })
          .finally(() => setIsGeoLoaded(true));
      } else {
        setGeoState({
          lat: parseFloat(post.latitude),
          lon: parseFloat(post.longitude),
        });
        setIsGeoLoaded(true);
      }
    };

    const checkUser = async () => {
      if (!houseId) {
        return;
      }
      const auth = await getAuth();
      if (!auth) {
        return;
      }
      setIsLoggedIn(true);
      const result = await getIsOwner(houseId);
      const resultJson = JSON.parse(await result.text());
      setIsOwner(resultJson.result);
    };

    const checkFavorite = async () => {
      const favs = JSON.parse(await SecureStore.getItemAsync("favs")) || [];
      if (favs.includes(houseId)) {
        setIsFavorite(true);
      }
    };

    fetchData();
    checkUser();
    checkFavorite();
  }, [houseId, timestamp]);

  const handleCallButton = async () => {
    setShowModal(true);
    const result = await getUserByID(postData.poster_id);
    setPhone(result.phone);
  };

  const handleChatButton = async () => {
    try {
      // Создаем чат
      const chatData = await createChat(postData.id);
      console.info(chatData);

      setChatData({
        ...chatData.chat,
        post: chatData.post,
        opponent_user: chatData.opponent_user,
      });

      setCurrentUser(chatData.current_user);
      setIsShowChatModal(true);
    } catch (error) {
      console.error("Ошибка при создании чата:", error);
      showToast(error.message || "Не удалось создать чат", "error");
    }
  };

  // Функция изменения статуса объявления
  const changeStatus = async ({ post_id, post_status }) => {
    try {
      const result = await updateStatus({ post_id, post_status });
    } catch (error) {
      showToast(error.message, "error");
      logError(navigation.getState().routes[0].name, error, {
        postData,
        handleName: "changeStatus",
      });
    }
  };

  const confirmClose = async () => {
    try {
      await changeStatus({ post_id, post_status: 3 });
      setPostData((prev) => ({ ...prev, status: 3 }));
      setShowCloseConfirm(false);
      showToast("Ваше объявление закрыто", "success");
      navigation.navigate("UserPostsPage", {
        user_id: ownerUser?.id,
        status: 3,
      });
    } catch (error) {
      logError(navigation.getState().routes[0].name, error, {
        postData,
        handleName: "confirmClose",
      });
    }
  };

  const confirmDelete = async () => {
    await changeStatus({ post_id: houseId, post_status: -1 });
    setPostData((prev) => ({ ...prev, status: -1 }));
    setShowDeleteConfirm(false);
    showToast("Ваше объявление удалено!", "success");
    navigation.navigate("UserPostsPage", {
      user_id: ownerUser?.id,
      status: -1,
    });
  };

  const confirmRestore = async () => {
    await changeStatus({ post_id: houseId, post_status: 0 });
    setPostData((prev) => ({ ...prev, status: 0 }));
    setShowRestoreConfirm(false);
    showToast("Объявление успешно восстановлено", "success");
  };

  // Массив для отображения свойств объявления
  const propertyItems = [
    { label: "Кадастровый номер", value: postData.kad_number },
    { label: "Площадь дома", value: postData.house_area, suffix: " м²" },
    { label: "Этажи", value: postData.num_floors },
    { label: "Площадь участка", value: postData.plot_area, suffix: " сот" },
    { label: "Материал несущих стен", value: postData.walls_lb },
    { label: "Материал внутренних стен", value: postData.walls_part },
    { label: "Кровля", value: postData.roof },
    { label: "Фундамент", value: postData.base },
    {
      label: "Электричество (льготный тариф)",
      value: postData.electricity_bill,
    },
    { label: "Водоснабжение", value: postData.water },
    { label: "Водоотведение", value: postData.sewage },
    {
      label: "Газ",
      value: postData.gas === "true" ? "Подключен" : "Не подключен",
    },
    { label: "Отопление", value: postData.heating },
    { label: "Тип дома", value: postData.house_type },
    { label: "Год постройки", value: postData.year_built },
    { label: "Количество спален", value: postData.bedrooms },
    { label: "Состояние дома", value: postData.house_status },
    { label: "Дополнительно", value: postData.additions },
  ];

  // Кнопки внизу в зависимости от статуса объявления
  const renderActionButtons = () => {
    // Статусы:
    // 1 или 4: активное или незавершённое – показываем "Удалить" и "Закрыть"
    // 3 (закрыто) или -1 (удалено): показываем кнопку "Восстановить"
    if (isOwner) {
      if (
        postData.status === 1 ||
        postData.status === 4 ||
        postData.status === 0
      ) {
        return (
          <View
            style={{
              flexDirection: "row",
              width,
              justifyContent: "space-between",
              paddingHorizontal: 16,
              alignItems: "flex-end",
              marginTop: 32,
            }}
          >
            <Pressable
              style={[
                styles.button_1,
                { backgroundColor: "#FF8680", paddingVertical: 8 },
              ]}
              onPress={() => setShowDeleteConfirm(true)}
            >
              <Text style={styles.buttonText}>Удалить</Text>
            </Pressable>
            <Pressable
              style={[styles.button_1, { paddingVertical: 8 }]}
              onPress={() => setShowCloseConfirm(true)}
            >
              <Text style={styles.buttonText}>Закрыть</Text>
            </Pressable>
          </View>
        );
      } else if (postData.status === 3 || postData.status === -1) {
        return (
          <View
            style={{ width: width - 32, alignItems: "center", marginTop: 32 }}
          >
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "#007AFF", paddingVertical: 8 },
              ]}
              onPress={() => setShowRestoreConfirm(true)}
            >
              <Text style={styles.buttonText}>Восстановить</Text>
            </Pressable>
          </View>
        );
      }
    }

    return (
      <View
        style={{
          flexDirection: "row",
          width,
          justifyContent: "space-between",
          paddingHorizontal: 16,
          alignItems: "flex-end",
          marginTop: 32,
        }}
      >
        <TouchableOpacity
          onPress={() => handleChatButton()}
          style={[styles.button_1, { paddingVertical: 8 }]}
        >
          <Text style={styles.buttonText}>Написать</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleCallButton()}
          style={[styles.button_2, { paddingVertical: 8 }]}
        >
          <Text style={styles.buttonText2}>Позвонить</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPostStatus = () => {
    let text = "";
    switch (postData.status) {
      case 0:
        text = "На модерации";
        break;
      case 3:
        text = "Закрыто";
        break;
      case -1:
        text = "Удалено";
        break;
    }

    if (!text) return;

    return (
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "600",
          color: "#2C88EC",
          fontFamily: "Sora700",
          paddingLeft: isOwner ? 0 : postData.status == 1 && 24,
          paddingRight: isOwner ? 0 : postData.status !== 1 && 26,
        }}
      >
        {text}
      </Text>
    );
  };

  const renderPriceBlock = () => {
    return (
      <View style={styles.priceBlock}>
        {Object.keys(postData).length === 0 ? (
          <ActivityIndicator size="large" color="#32322C" />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text style={styles.priceText}>
              {postData.price &&
                postData.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              ₽
            </Text>
            <View style={{ width: 16 }} />
            <Text style={styles.priceMeter}>
              {Math.floor(postData.price / postData.house_area)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              ₽/м²
            </Text>
          </View>
        )}
      </View>
    );
  };

  const specsList = [
    // Этажи - всегда отображаем если значение есть
    postData.num_floors != null && {
      value: postData.num_floors,
      suffix: "-эт.",
      caption: "дом",
    },
    // Комнаты - отображаем только если значение указано и не равно 0
    postData.bedrooms != null &&
      postData.bedrooms !== 0 && {
        value: postData.bedrooms,
        suffix: "-комн.",
        caption: "планировка",
      },
    // Метраж - всегда отображаем если значение есть
    postData.house_area != null && {
      value: postData.house_area,
      suffix: " м²",
      caption: "общая",
    },
    // Участок - отображаем только если значение есть и больше 0
    postData.plot_area != null &&
      postData.plot_area > 0 && {
        value: postData.plot_area,
        suffix: " сот",
        caption: "участок",
      },
  ].filter(Boolean); // Убираем все ложные значения из массива

  const renderHouseSpecs = () => {
    if (Object.keys(postData).length === 0) {
      return <ActivityIndicator size="large" color="#32322C" />;
    }

    return (
      <View style={[styles.specView, { paddingHorizontal: 16 }]}>
        {specsList.map((spec, index) => (
          <View style={styles.specElement} key={index}>
            <Text style={styles.specText}>
              {spec.value}
              {spec.suffix}
            </Text>
            <Text style={styles.caption1}>{spec.caption}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMap = () => {
    return (
      <View style={styles.addressView}>
        <View style={{ borderRadius: 16, width, alignSelf: "center" }}>
          {isGeoLoaded ? (
            process.env.NODE_ENV === "development" ? (
              <Text style={{ color: "red", fontSize: 24, textAlign: "center" }}>
                Карта
              </Text>
            ) : (
              <View
                onTouchStart={() => setIsInteractingWithMap(true)}
                onTouchEnd={() => setIsInteractingWithMap(false)}
                style={{ position: "relative" }}
              >
                <YaMap
                  ref={mapRef}
                  style={styles.map}
                  onMapLoaded={() => {
                    mapRef.current.setCenter(
                      { lon: geoState.lon, lat: geoState.lat },
                      10
                    );
                  }}
                >
                  <Marker
                    point={{ lat: geoState.lat, lon: geoState.lon }}
                    scale={0.75}
                    source={require("../assets/marker.png")}
                  />
                </YaMap>
                <TouchableOpacity
                  style={styles.fullScreenButton}
                  onPress={() => setIsMapFullScreen(true)}
                >
                  <MaterialIcons name="fullscreen" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )
          ) : (
            <Text style={{ alignSelf: "center" }}>Загрузка Карты...</Text>
          )}
        </View>
        <View>
          <Text style={styles.addressText}>
            {postData.city}, {postData.full_address}
          </Text>
        </View>
      </View>
    );
  };

  const renderBlockSeller = () => {
    return (
      <View style={{ marginTop: 32, alignSelf: "flex-start", marginLeft: 16 }}>
        <Text style={styles.infoTitle}>Продавец</Text>
        {Object.keys(ownerUser).length !== 0 && (
          <Pressable onPress={() => setShowNodalSeller(true)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#F2F2F7",
                width: width - 32,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 12,
              }}
            >
              {ownerUser.photo ? (
                <Image
                  source={
                    ownerUser.status == -1
                      ? require("../assets/deleted_user.jpg")
                      : { uri: ownerUser.photo }
                  }
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 54,
                    aspectRatio: 1,
                  }}
                />
              ) : (
                <FontAwesome6
                  name="face-meh"
                  size={42}
                  color="black"
                  opacity={0.6}
                />
              )}
              <View style={{ width: 12 }} />
              <View style={{ rowGap: 6 }}>
                <Text
                  style={[
                    styles.serviciesText,
                    { color: "#3E3E3E", fontWeight: "600" },
                  ]}
                >
                  {ownerUser.name} {ownerUser.surname}
                </Text>
                <Text
                  style={{
                    color: "#808080",
                    fontSize: 14,
                    fontFamily: "Sora400",
                  }}
                >
                  Риэлтор
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  const renderAboutHouse = () => {
    return (
      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>Об объекте</Text>
        {propertyItems
          .filter((item) => item.value !== null && item.value !== "")
          .map((item, index) => (
            <Pressable
              key={`property-${index}`}
              onPress={() => {
                if (item.label === "Кадастровый номер") {
                  Clipboard.setStringAsync(item.value);
                  showToast("Кадастровый номер скопирован", "info");
                }
              }}
            >
              <View style={styles.infoSpecRow}>
                <Text style={styles.infoSpec}>{item.label}</Text>
                <View
                  style={{
                    columnGap: 4,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.infoValue,
                      item.label === "Кадастровый номер" &&
                        styles.copyableValue,
                    ]}
                  >
                    {item.value}
                    {item.suffix ? item.suffix : ""}
                  </Text>
                  {item.label === "Кадастровый номер" && (
                    <Octicons name="copy" size={12} color="#2C88EC" />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
      </View>
    );
  };

  const renderBlockDescription = () => {
    if (!postData.text) return;
    return (
      <View style={styles.infoBlock}>
        <Text style={styles.infoTitle}>Описание</Text>
        <Text
          style={{
            color: "#3E3E3E",
            fontFamily: "Sora400",
            fontWeight: "400",
            fontSize: 14,
          }}
        >
          {postData.text}
        </Text>
      </View>
    );
  };

  const servicesList = [
    {
      buttonTitle: "Страхование",
      title: "Страхование жилья",
      serviceId: 1,
      subTitle: "Страхование жилья",
      subText: `Поможем Вам застраховать ваше недвижимое имущество. Наш менеджер сам свяжется с вами.`,
    },
    {
      buttonTitle: "Сопровождение сделки",
      title: "Сопровождение сделки",
      serviceId: 2,
      subTitle: "Сопровождение ипотеки",
      subText: "Поможем Вам получить одобрение ипотеки.",
    },
    {
      buttonTitle: "Оценка",
      title: "Оценка недвижимости",
      serviceId: 3,
      subTitle: "Оценка недвижимости",
      subText:
        "Поможем Вам застраховать ваше недвижимое имущество. Наш менеджер сам свяжется с вами.",
    },
  ];

  const renderServicesBlock = () => {
    return (
      <View style={styles.serviciesBlock}>
        <Text style={styles.infoTitle}>Услуги</Text>
        <View style={styles.serviciesView}>
          {servicesList.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviciesPressable}
              onPress={() => {
                handleSelected(service);
              }}
            >
              <Text numberOfLines={2} style={styles.serviciesText}>
                {service.buttonTitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const modalDefinitions = [
    {
      // Модальное окно для подтверждения закрытия
      condition: showCloseConfirm,
      props: {
        visible: showCloseConfirm,
        title: "Подтверждение",
        message: "Вы действительно хотите закрыть объявление?",
        onCancel: () => setShowCloseConfirm(false),
        onConfirm: confirmClose,
      },
    },
    {
      // Модальное окно для подтверждения удаления
      condition: showDeleteConfirm,
      props: {
        visible: showDeleteConfirm,
        title: "Подтверждение",
        message: "Вы действительно хотите удалить объявление?",
        onCancel: () => setShowDeleteConfirm(false),
        onConfirm: confirmDelete,
      },
    },
    {
      // Модальное окно для подтверждения восстановления
      condition: showRestoreConfirm,
      props: {
        visible: showRestoreConfirm,
        title: "Подтверждение",
        message: "Вы действительно хотите восстановить объявление?",
        onCancel: () => setShowRestoreConfirm(false),
        onConfirm: confirmRestore,
        confirmText: "Да",
        cancelText: "Нет",
      },
    },
    {
      // Модальное окно для вызова номера
      condition: showModal,
      props: {
        visible: showModal,
        title:
          Object.keys(ownerUser).length === 0
            ? ""
            : `${ownerUser.name} ${ownerUser.surname}`,
        message: isLoggedIn
          ? phone
          : "Пожалуйста зарегистрируйтесь чтобы посмотреть номер телефона",
        onConfirm: () => {
          Linking.openURL(`tel:${phone}`);
          setShowModal(false);
        },
        onCancel: () => setShowModal(false),
        confirmText: "Позвонить",
        cancelText: "Закрыть",
      },
    },
    {
      // Модальное окно для полноэкранной карты
      condition: isMapFullScreen,
      props: {
        visible: isMapFullScreen,
        title: "Карта",
        onCancel: () => setIsMapFullScreen(false),
        cancelText: "Закрыть",
      },
    },
  ];

  const UniversalModal = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
  }) => {
    return (
      <Modal
        visible={visible}
        transparent={title !== "Карта"} // Полноэкранная карта не должна быть прозрачной
        animationType="slide"
        onRequestClose={onCancel}
      >
        <View
          style={
            title === "Карта"
              ? styles.fullScreenModalOverlay
              : styles.modalOverlay
          }
        >
          {title === "Карта" ? (
            <View style={styles.fullScreenModalContent}>
              <View style={styles.fullScreenMapContainer}>
                <YaMap
                  ref={fullScreenMapRef}
                  style={styles.fullScreenMap}
                  onMapLoaded={() => {
                    fullScreenMapRef.current.setCenter(
                      { lon: geoState.lon, lat: geoState.lat },
                      10
                    );
                  }}
                >
                  <Marker
                    point={{ lat: geoState.lat, lon: geoState.lon }}
                    scale={0.75}
                    source={require("../assets/marker.png")}
                  />
                </YaMap>
                <TouchableOpacity
                  style={styles.fullScreenButton}
                  onPress={onCancel}
                >
                  <MaterialIcons
                    name="fullscreen-exit"
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.modalContent}>
              {title && <Text style={styles.modalTitle}>{title}</Text>}
              {message && <Text style={styles.modalMessage}>{message}</Text>}
              <View style={styles.modalButtonContainer}>
                <Pressable style={styles.modalButtonCancel} onPress={onCancel}>
                  <Text style={styles.modalButtonText}>{cancelText}</Text>
                </Pressable>
                {onConfirm && (
                  <Pressable
                    style={styles.modalButtonConfirm}
                    onPress={onConfirm}
                  >
                    <Text style={styles.modalButtonText}>{confirmText}</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  const renderModal = () => {
    return modalDefinitions.map((modalDef, index) =>
      modalDef.condition ? (
        <UniversalModal key={index} {...modalDef.props} />
      ) : null
    );
  };

  const handleBack = () => {
    if (isModal) {
      route.setIsModalShow(false);
      return;
    }

    const canGoBack = navigation.canGoBack();
    if (canGoBack) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main");
  };

  const renderBackButton = () => (
    <Pressable onPress={handleBack}>
      <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
    </Pressable>
  );

  const renderEditAndFavoriteButtons = () => (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
      <Pressable onPress={() => setIsShowEditModal(true)}>
        <Feather name="edit" size={24} color="#007AFF" />
      </Pressable>
      {postData.status == 1 && (
        <Pressable Pressable onPress={() => sharePost(postData)}>
          <MaterialIcons name="share" size={24} color="#007Aff" />
        </Pressable>
      )}
    </View>
  );

  const renderFavoriteAndShareButtons = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        columnGap: 4,
      }}
    >
      <Pressable onPress={() => toggleFavorite(houseId)}>
        <MaterialIcons
          name={isFavorite(houseId) ? "favorite" : "favorite-border"}
          size={24}
          color={isFavorite(houseId) ? "red" : "#007AFF"}
        />
      </Pressable>
      <Pressable onPress={() => sharePost(postData)}>
        <MaterialIcons name="share" size={24} color="#007Aff" />
      </Pressable>
    </View>
  );

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width,
          alignItems: "center",
          paddingBottom: 8,
          backgroundColor: "#F2F2F7",
          paddingHorizontal: 17,
          paddingTop: isModal ? 0 : 42,
        }}
      >
        {renderBackButton()}
        {renderPostStatus()}
        {isOwner ? (
          renderEditAndFavoriteButtons()
        ) : postData.status == 1 ? (
          renderFavoriteAndShareButtons()
        ) : (
          <View />
        )}
      </View>
    );
  };

  const shareProfileButton = () => {
    if (!ownerUser) return null;

    const options = {
      type: "profile",
      id: ownerUser.id,
      user: ownerUser,
    };

    return (
      <Pressable onPress={() => shareProfile(options)}>
        <ShareIcon />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEnabled={!isInteractingWithMap}
      >
        {renderHeader()}
        <ImageCarousel postData={postData} />
        {renderPriceBlock()}
        {renderHouseSpecs()}
        {renderActionButtons()}
        {renderMap()}
        {renderBlockSeller()}
        {renderBlockDescription()}
        {renderAboutHouse()}
        {renderServicesBlock()}
        <MortgageCalculator price={postData.price} />
        <View style={{ height: 134 }} />
      </ScrollView>

      <CustomModal
        isVisible={showModalSeller}
        onClose={() => setShowNodalSeller(false)}
        buttonLeft={<BackIcon />}
        buttonRight={shareProfileButton()}
      >
        <ProfilePageView
          route={{
            params: { posterId: ownerUser?.id, posterType: ownerUser.usertype },
          }}
        />
      </CustomModal>

      {renderModal()}
      <Modal visible={isShowChatModal}>
        <ChatScreen
          handleClose={() => setIsShowChatModal(false)}
          selectedChat={chatData}
          currentUser={currentUser}
        />
      </Modal>
      <Modal visible={isShowModal} animationType="slide">
        <ServicesPage
          handleClose={() => setIsShowModal(false)}
          selectedItem={selectedItem}
        />
      </Modal>
      <Modal
        visible={isShowEditModal}
        onRequestClose={() => setIsShowEditModal(false)}
      >
        <EditHousePostPage
          postData={postData}
          setPostData={setPostData}
          handleClose={() => setIsShowEditModal(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5EA",
    height: height - 120,
  },
  scrollContainer: {
    alignItems: "center",
  },
  priceBlock: {
    flexDirection: "row",
    width: width - 32,
    justifyContent: "space-between",
    marginTop: 16,
    alignSelf: "center",
  },
  imageMap: {
    width: width - 32,
    height: width * 0.34,
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: 12,
    alignSelf: "center",
  },
  priceText: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.38,
    fontWeight: "600",
    fontFamily: "Sora700",
    color: "#3E3E3E",
  },
  priceMeter: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 17,
    letterSpacing: -0.43,
    fontStyle: "normal",
    fontFamily: "Sora400",
    color: "#808080",
  },
  specView: {
    flexDirection: "row",
    width: width - 32,
    justifyContent: "space-between",
    marginTop: 16,
    alignSelf: "center",
  },
  specElement: {
    alignItems: "center",
  },
  specText: {
    fontSize: 17,
    color: "#3E3E3E",
    letterSpacing: -0.43,
    lineHeight: 20,
    fontWeight: "600",
    fontFamily: "Sora700",
  },
  caption1: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Sora500",
    lineHeight: 15,
    letterSpacing: -0.23,
    color: "#808080",
  },
  addressView: {
    width: width - 32,
    marginTop: 24,
    alignSelf: "center",
  },
  addressText: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 20,
    color: "#808080",
    fontFamily: "Sora400",
  },
  infoBlock: {
    width: width - 32,
    marginTop: 32,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: "Sora700",
    fontStyle: "normal",
    color: "#3E3E3E",
    fontWeight: "600",
    marginBottom: 16,
  },
  infoSpecRow: {
    flexDirection: "row",
    width: width - 32,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  infoSpec: {
    width: width * 0.4,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.43,
    color: "#808080",
    fontFamily: "Sora400",
  },
  infoValue: {
    textAlign: "right",
    width: width * 0.4,
    fontSize: 14,
    color: "#3E3E3E",
    lineHeight: 18,
    fontWeight: "400",
    letterSpacing: -0.43,
    fontStyle: "normal",
    fontFamily: "Sora400",
  },
  copyableValue: {
    letterSpacing: -0.42,
    lineHeight: 18,
    color: "#2C88EC",
    fontSize: 14,
    fontWeight: "400",
    fontStyle: "normal",
  },
  serviciesBlock: {
    width: width - 32,
    marginTop: 16,
    alignItems: "flex-start",
  },
  serviciesView: {
    width: width - 32,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    flex: 1,
  },
  serviciesPressable: {
    alignSelf: "stretch",
    width: (width - 32 - 16) / 3,
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
  },
  serviciesText: {
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: -0.42,
    fontFamily: "Sora400",
    color: "#3E3E3E",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    width: width - 32,
    borderRadius: 8,
    alignItems: "center",
  },
  button_1: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    width: (width - 48) / 2,
    borderRadius: 8,
    alignItems: "center",
  },
  button_2: {
    paddingVertical: 12,
    width: (width - 48) / 2,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#2C88EC",
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: "400",
    fontFamily: "Sora700",
  },
  buttonText2: {
    color: "#2C88EC",
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight: "400",
    fontFamily: "Sora700",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenModalOverlay: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: width - 32,
    borderRadius: 16,
    padding: 16,
  },
  fullScreenModalContent: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenMapContainer: {
    flex: 1,
    width: "100%",
  },
  fullScreenMap: {
    width: "100%",
    height: "100%",
  },
  fullScreenCloseButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButtonCancel: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonConfirm: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  map: {
    width,
    height: width * 0.6,
  },
  fullScreenButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#007AFF90",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
