import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Geocoder } from "react-native-yamap";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";

import InputImage from "../components/PostComponents/InputImage";
import InputProperty from "../components/PostComponents/InputProperty";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLogger } from "../context/LoggerContext";
import { useToast } from "../context/ToastProvider";

const { width, height } = Dimensions.get("window");

export default function CreateHousePostPage({ navigation }) {
  const { getAuth } = useAuth();

  const showToast = useToast();

  const userId = useRef();
  const usertype = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const { sendPost, getCurrentUser } = useApi();
  const { logError } = useLogger();
  const [formData, setFormData] = useState({
    title: "",
    houseType: "",
    wallMaterial: "",
    partitionMaterial: "",
    price: "",
    area: "",
    floors: "",
    rooms: "",
    location: "",
    settlement: "",
    plotSize: "",
    description: "",
    roof: "",
    basement: "",
    landArea: "",
    kadastr: "",
    houseCondition: "",
    constructionYear: "",
    gas: "",
    water: "",
    sewerege: "",
    electricity: "",
    heating: "",
    photos: [],
    poster_id: "",
    lat: "",
    lon: "",
  });

  useEffect(() => {
    const getUserID = async () => {
      const result = await getCurrentUser();
      userId.current = result.id;
      usertype.current = result.usertype;
      setFormData((prevData) => ({ ...prevData, poster_id: userId.current }));
    };
    getUserID();
    return () => {};
  }, [userId.current]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value.value || value }));
  };

  const handleSubmit = async () => {
    // TODO: вернуть
    // if (!formData.price || !formData.settlement || !formData.location) {
    //   showToast('Пожалуйста, заполните все обязательные поля.', "warn");
    // setPage(1);
    //   return;
    // }

    setIsLoading(true);
    setIsButtonDisabled(true);
    const addressString = `${formData.settlement} ${formData.location}`;
    // const addressString = `г. Ижвеск, Улица Кирова, 32`;
    try {
      // Получаем результат геокодирования
      const geoResult = await Geocoder.addressToGeo(addressString);

      if (!geoResult?.lat || !geoResult?.lon) {
        showToast("Ошибка, неправильный адрес", "error");
        setPage(1);
        setIsLoading(false);
        setIsButtonDisabled(false);
        return;
      }
      const { lat, lon } = geoResult;
      const antiStaleFormData = {
        ...formData,
        lat,
        lon,
        usertype: usertype.current,
        photos: formData.photos.map((photo) => photo.base64),
      };
      const result = await sendPost(antiStaleFormData);

      const resultJson = JSON.parse(await result.text());
      console.log(resultJson);
      if (!result.ok) throw new Error(resultJson.message);
      Alert.alert(
        "Успех",
        "Ваше объявление отправлено на модерацию. Оно будет опубликовано после проверки модератором.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsLoading(false);
              setIsButtonDisabled(false);
              navigation.navigate("House", { houseId: resultJson[0].id });
            },
          },
        ]
      );
    } catch (error) {
      showToast(`Произошла ошибка: ${error.message}`, "error");
      setIsLoading(false);
      setIsButtonDisabled(false);
      // TODO: Вернуть
      // logError(navigation.getState().routes[0].name, error, { formData, handleName: "handleSubmit" });
    }
  };

  const [page, setPage] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const inputListLocation = [
    {
      text: "Населённый пункт*",
      placeholder: "Название населённого пункта",
      valueName: "settlement",
    },
    { text: "Адрес*", placeholder: "Улица, Дом", valueName: "location" },
    {
      text: "Кадастровые номер",
      placeholder: "Кадастровый Номер",
      valueName: "kadastr",
    },
  ];

  const LocationOfTheHouse = () => {
    return (
      <View>
        <Text style={propertyStyle.title}>Местоположение</Text>
        <View style={propertyStyle.container}>
          {inputListLocation.map((item, index) => (
            <View View key={index} style={propertyStyle.row}>
              <InputProperty
                title={item.text}
                placeholder={item.placeholder}
                value={formData[item.valueName]}
                valueName={item.valueName}
                handleInputChange={handleInputChange}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const currentYear = new Date().getFullYear();
  const constructionYear = Array.from(
    { length: currentYear - 1949 },
    (_, i) => {
      const year = currentYear - i;
      return { label: `${year}`, value: `${year}` };
    }
  );

  const inputListHouseinfo = [
    {
      keyboardType: "numeric",
      text: "Тип дома",
      placeholder: "Выберите тип дома",
      valueName: "houseType",
      type: "select",
    },
    {
      keyboardType: "numeric",
      text: "Год постройки",
      placeholder: "2000",
      valueName: "constructionYear",
      type: "select",
    },
    {
      keyboardType: "numeric",
      text: "Этажи",
      placeholder: "Количество этажей",
      valueName: "floors",
      type: "select",
    },
    {
      keyboardType: "numeric",
      text: "Комнаты",
      placeholder: "Количество комнат",
      valueName: "rooms",
      type: "select",
    },
    {
      keyboardType: "numeric",
      text: "Площадь",
      placeholder: "Жилплощадь (м²)",
      valueName: "area",
    },
    {
      keyboardType: "numeric",
      text: "Площадь Участка",
      placeholder: "Площадь участка (сот.)",
      valueName: "plotSize",
    },
  ];

  const aboutHomePickerList = {
    houseType: [
      { label: "ИЖС", value: "ИЖС" },
      { label: "неИЖС", value: "неИЖС" },
    ],
    constructionYear,
    floors: [
      { label: "1 этаж", value: "1" },
      { label: "2 этажа", value: "2" },
      { label: "3 этажа", value: "3" },
      { label: "4 этажа", value: "4" },
      { label: "5 этажей", value: "5" },
    ],
    rooms: [
      { label: "1 комната", value: "1" },
      { label: "2 комнаты", value: "2" },
      { label: "3 комнаты", value: "3" },
      { label: "4 комнаты", value: "4" },
      { label: "5 комнат", value: "5" },
      { label: "6 комнат", value: "6" },
      { label: "7 комнат", value: "7" },
      { label: "8 комнат", value: "8" },
      { label: "9 комнат", value: "9" },
      { label: "10 комнат", value: "10" },
    ],
    area: [
      { label: "30 м²", value: "30" },
      { label: "50 м²", value: "50" },
      { label: "70 м²", value: "70" },
      { label: "100 м²", value: "100" },
      { label: "150 м²", value: "150" },
      { label: "200 м²", value: "200" },
      { label: "300 м²", value: "300" },
      { label: "500 м²", value: "500" },
      { label: "800 м²", value: "800" },
      { label: "1000 м²", value: "1000" },
    ],
    plotSize: [
      { label: "5 соток", value: "5" },
      { label: "10 соток", value: "10" },
      { label: "15 соток", value: "15" },
      { label: "20 соток", value: "20" },
      { label: "25 соток", value: "25" },
      { label: "30 соток", value: "30" },
      { label: "40 соток", value: "40" },
      { label: "50 соток", value: "50" },
    ],
  };

  const AboutHouse = () => {
    const otherItems = inputListHouseinfo.slice(
      0,
      inputListHouseinfo.length - 4
    );
    const lastFourItems = inputListHouseinfo.slice(-4);

    const groupedLastFour = [];
    for (let i = 0; i < lastFourItems.length; i += 2) {
      groupedLastFour.push(lastFourItems.slice(i, i + 2));
    }

    return (
      <View>
        <Text style={propertyStyle.title}>О доме</Text>
        <View style={propertyStyle.container}>
          {otherItems.map((item, index) => (
            <View key={`other-${index}`} style={propertyStyle.row}>
              <InputProperty
                title={item.text}
                placeholder={item.placeholder}
                options={aboutHomePickerList[item.valueName]}
                value={formData[item.valueName]}
                valueName={item.valueName}
                handleInputChange={handleInputChange}
                type={item.type}
              />
            </View>
          ))}
          {groupedLastFour.map((group, groupIndex) => (
            <View key={`group-${groupIndex}`} style={propertyStyle.row}>
              {group.map((item, index) => (
                <InputProperty
                  key={`last-${groupIndex}-${index}`}
                  title={item.text}
                  placeholder={item.placeholder}
                  options={aboutHomePickerList[item.valueName]}
                  value={formData[item.valueName]}
                  valueName={item.valueName}
                  handleInputChange={handleInputChange}
                  type={item.type}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const inputListConstruction = [
    { text: "Стены", placeholder: "Материал", valueName: "wallMaterial" },
    {
      text: "Перегородки",
      placeholder: "Материал",
      valueName: "partitionMaterial",
    },
    { text: "Фундамент", placeholder: "Тип фундамента", valueName: "basement" },
    { text: "Кровля", placeholder: "Тип кровли", valueName: "roof" },
  ];

  const constructiveHousePickerList = {
    wallMaterial: [
      { label: "Кирпич", value: "Кирпич" },
      { label: "Газоблок", value: "Газоблок" },
      { label: "Пеноблок", value: "Пеноблок" },
      { label: "Брус", value: "Брус" },
      { label: "Доска", value: "Доска" },
      { label: "Каркасный", value: "Каркасный" },
    ],
    partitionMaterial: [
      { label: "Дерево", value: "Дерево" },
      { label: "Гипсокартон", value: "Гипсокартон" },
      { label: "Газобетон", value: "Газобетон" },
      { label: "Керамзитоблоки", value: "Керамзитоблоки" },
      { label: "Кирпич", value: "Кирпич" },
    ],
    basement: [
      { label: "Ленточный", value: "Ленточный" },
      { label: "Плитный", value: "Плитный" },
      { label: "Столбчатый", value: "Столбчатый" },
      { label: "На сваях", value: "На сваях" },
    ],
    roof: [
      { label: "Металлочерепица", value: "Металлочерепица" },
      { label: "Битумная черепица", value: "Битумная черепица" },
      { label: "Керамическая черепица", value: "Керамическая черепица" },
      { label: "Шифер", value: "Шифер" },
      { label: "Ондулин", value: "Ондулин" },
    ],
  };

  const ConstructiveHouses = () => {
    return (
      <View>
        <Text style={propertyStyle.title}>Конструктив дома</Text>
        <View style={propertyStyle.container}>
          {inputListConstruction.map((item, index) => (
            <View key={index} style={propertyStyle.row}>
              <InputProperty
                title={item.text}
                placeholder={item.placeholder}
                options={constructiveHousePickerList[item.valueName]}
                value={formData[item.valueName]}
                valueName={item.valueName}
                handleInputChange={handleInputChange}
                type="select"
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const inputListCommunications = [
    {
      text: "Тариф на электроэнергию",
      placeholder: "Выбрать тариф",
      valueName: "electricity",
    },
    {
      text: "Водоснабжение",
      placeholder: "Тип водоснабжения",
      valueName: "water",
    },
    { text: "Газ", placeholder: "Подключение", valueName: "gas" },
    {
      text: "Отопление",
      placeholder: "Тип системы отопления",
      valueName: "heating",
    },
    {
      text: "Канализация",
      placeholder: "Тип системы канализации",
      valueName: "sewerege",
    },
  ];

  const communicationsPickerDataList = {
    electricity: [
      { label: "Льготный тариф", value: "Льготный" },
      { label: "Социальный тариф", value: "Социальный" },
      { label: "Обычный тариф", value: "Обычный" },
      { label: "Повышенный тариф", value: "Повышенный" },
    ],
    water: [
      {
        label: "Центральное водоснабжение",
        value: "Центральное водоснабжение",
      },
      { label: "Скважина", value: "Скважина" },
    ],
    gas: [
      { label: "Подключен", value: "true" },
      { label: "Не подключен", value: "false" },
    ],
    heating: [
      { label: "Газовый котел", value: "Газовый котел" },
      { label: "Электрический котел", value: "Электрический котел" },
      { label: "Печь", value: "Печь" },
      { label: "Нет", value: "Нет" },
    ],
    sewerege: [
      { label: "Центральная канализация", value: "Центральная канализация" },
      { label: "Септик", value: "Септик" },
      { label: "Нет", value: "Нет" },
    ],
  };

  const Communications = () => {
    return (
      <View>
        <Text style={propertyStyle.title}>Коммуникации</Text>
        <View style={propertyStyle.container}>
          {inputListCommunications.map((item, index) => (
            <View key={index} style={propertyStyle.row}>
              <InputProperty
                title={item.text}
                options={communicationsPickerDataList[item.valueName]}
                value={formData[item.valueName]}
                valueName={item.valueName}
                placeholder={item.placeholder}
                handleInputChange={handleInputChange}
                type="select"
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const DescriptionOfTheHouse = () => {
    return (
      <View>
        <Text style={propertyStyle.title}>Описание дома</Text>
        <View style={propertyStyle.container}>
          <View style={propertyStyle.row}>
            <InputProperty
              title="Описание"
              value={formData.description}
              valueName={"description"}
              handleInputChange={handleInputChange}
              placeholder="Максимум 2 000 символов"
              type="textarea"
            />
          </View>
          <View>
            <Text style={[propertyStyle.title, { marginTop: 16 }]}>Цена</Text>
            <View style={propertyStyle.row}>
              <InputProperty
                title="Цена, руб*"
                handleInputChange={handleInputChange}
                value={formData.price}
                valueName={"price"}
                placeholder="2 000 000"
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const propertyStyle = StyleSheet.create({
    title: {
      color: "#000",
      fontSize: 16,
      fontWeight: 600,
      textAlign: "center",
      marginBottom: 24,
    },
    container: {
      gap: 16,
      width: width - 16,
    },
    row: {
      columnGap: 16,
      flexDirection: "row",
    },
  });

  // formData.price || !formData.settlement || !formData.location
  // TODO: вернуть
  const requiredFieldsByPage = {
    // 0: ['photos'],
    // 1: ['settlement', 'location', 'kadastr'],
    // 2: ['houseType', 'constructionYear', 'floors', 'rooms', 'area'],
    // 3: ['wallMaterial', 'partitionMaterial', 'basement', 'roof'],
    // 4: ['electricity', 'water', 'gas', 'heating', 'sewerege'],
    // 5: ['description', 'price'],
  };

  const isPageValid = () => {
    if (isButtonDisabled) return false;

    const requiredFields = requiredFieldsByPage[page] || [];
    for (const field of requiredFields) {
      const value = formData[field];
      if (Array.isArray(value)) {
        if (value.length === 0) return false;
      } else if (!value || (typeof value === "string" && value.trim() === "")) {
        return false;
      }
    }
    return true;
  };

  // Добавляем анимацию переключения страниц (сдвиг вправо)
  const translateX = React.useRef(new Animated.Value(0)).current;

  const handlePageTransition = () => {
    // Сдвигаем текущую страницу влево
    Animated.timing(translateX, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Обновляем страницу
      setPage((current) => (current === 5 ? 0 : current + 1));
      // Устанавливаем новую страницу справа за экраном
      translateX.setValue(width);
      // Анимируем появление новой страницы (сдвиг в центр)
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const getPage = () => {
    switch (page) {
      case 0:
        return (
          <InputImage setFormData={setFormData} photos={formData.photos} />
        );
      case 1:
        return LocationOfTheHouse();
      case 2:
        return AboutHouse();
      case 3:
        return ConstructiveHouses();
      case 4:
        return Communications();
      case 5:
        return DescriptionOfTheHouse();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        extraScrollHeight={100}
        // enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={styles.header}>Создание объявления</Text>
          <Animated.View style={{ transform: [{ translateX }] }}>
            {getPage()}
          </Animated.View>
          <View style={styles.container__button}>
            <Pressable
              disabled={!isPageValid()}
              onPress={page === 5 ? handleSubmit : handlePageTransition}
              style={isPageValid() ? styles.button : styles.buttonDisabled}
            >
              <Text
                style={
                  isPageValid() ? styles.buttonText : styles.buttonDisabledText
                }
              >
                {page === 5 ? "Создать объявление" : "Далее"}
              </Text>
            </Pressable>
          </View>
        </View>
        <Modal animationType="fade" visible={isLoading}>
          <View
            style={{
              rowGap: 16,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={50} color={"#2C88EC"} />
            <Text style={{ fontSize: 16, fontFamily: "Sora500" }}>
              Объявление создается
            </Text>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 600,
    marginTop: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  header2: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 32,
    textAlign: "left",
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: "center",
  },
  inputPhoto: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  inputPhoto2: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingBottom: 8,
  },
  container__button: {
    marginTop: 44,
    marginBottom: 44,
    alignSelf: "stretch",
    marginHorizontal: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#2C88EC",
    padding: 12,
    borderRadius: 12,
    alignSelf: "stretch",
  },
  buttonDisabled: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    alignSelf: "stretch",
    backgroundColor: "#2C88EC66",
  },
  buttonDisabledText: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: 600,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: 600,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    justifyContent: "space-between",
  },
  thumbnail: {
    width: (width - 32 - 8 * 4) / 3,
    height: (width - 32 - 8 * 4) / 3,
    borderRadius: 16,
    marginLeft: 8,
    marginTop: 8,
  },
});
