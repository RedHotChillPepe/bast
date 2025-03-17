import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddPostButton from "../components/AddPostButton";
import Banner from "../components/Banner";
import HouseCard from "../components/HouseCard";
import HouseSearchButton from "../components/HouseSearchButton";
import ServicesComponent from "../components/ServiciesComponent";
import VillageCard from "../components/VillageCard";
import { useApi } from "../context/ApiContext";
import AdvertisementModalPage from "../pages/AdvertisementModalPage";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const AD_FREQUENCY = 10;
const MainPage = ({ navigation }) => {
  const { getPaginatedPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const isFocused = useIsFocused();
  const [selectedList, setSelectedList] = useState("houses"); // houses или villages
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisibleModalBanner, setIsVisibleModalBanner] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Исходный пул рекламы
  const [adPool] = useState([
    {
      id: 1,
      title: "Построим вам дом, а деньги потом!",
      description:
        "Мы предлагаем не откладывать мечты и готовы начать строить Ваш дом уже сейчас!",
      imageSrc:
        "https://s3-alpha-sig.figma.com/img/33ce/bca7/45ebfe6fd1a1a99301b2f402cebc21c6?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=qaZKXY2hQh8z7lSK-TU8rduOOtKrg-fcK6Nz8GqWlPIGR1kJSVJqcOgBng4qQSWiEoKOS6wlfCIP6MxlM5jPlV7Xoz-QU-9jtBkk77PLO3WIuOWeQ9A4YM9RX7WIANspLGvYSpszBjaOlFnW1~1k7BqKSFiSpHA4qnMJO8TGSzycKOBroRpy3BkrnArdXe4M~ReJmm~ZehRMuf841iJQ5FvVTUWD8jtGQP5sEo939gj7m9p6PyP6ceqHQaKrZPXZwgNARRV2c-X76o2PNYs0Om0TgXlP7JuoeDyY1pnelufoJeFkGKziniZ47bi1KR7ftxVMSn5N~uuqqilIag6qXw__",
      durationDate: "2025-03-30",
      weight: 3,
    },
    {
      id: 2,
      title: "Уникальное предложение по Пазелы Village!",
      description:
        "Не упустите шанс стать владельцем земли на выгодных условиях!",
      imageSrc:
        "https://s3-alpha-sig.figma.com/img/0f0c/f69e/74d1f38d30cbc4995662ef3ccd25d296?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QJQuiMCZ29DphL3wkufcx4JopTBKi8zrzn7Xo6DnbosE-eyEhmHZJxGzEBuwfnJZnO5gNcQulCXTULCwb4H1T9I5ua2DPVVftVAnxLqNU8nHMmPbVRM8NdMgl0bCFrqgqtXHo7VlHTlL5viM9nvIIrWgT5bOYLc7zJtRcky3603yY~3eeD6b7ypZ5TltI~xLRAanBq-8JMGAQ6S8nxDokus~docKjzCd2DwVnhzO2orpl8Ik-o7dD6eGtV1Oq5r-C~78MVl~aLfNLPV5LGqAD71D2d4rcL7LoL5OzTBWXTh0UnbWT-69jvNz1WdT061bs6b3SKBzLc6nf3y1~W06JA__",
      durationDate: "2025-03-30",
      weight: 4,
    },
    {
      id: 3,
      title: "Выкупим дом обратно!",
      description:
        "Мы предлагаем не откладывать мечты и готовы начать строить Ваш дом уже сейчас!",
      imageSrc:
        "https://s3-alpha-sig.figma.com/img/60e2/34eb/dd8103f677ad9fc1d6757e2ccd7e45ac?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=JrUmZ8xs6jZlGZwjGcj87ZT7C6dlKLdH-YpLjmTCPswj~angnek7EJvJ~6HP2tH6YKyOU5~wdQLGVuVEQ-T2FBnC0wrrBz6yTtEp01m4XVmEcTlC5-QGz52c9UD4ibHQsY5IsoQyouIUwWIHpuk7bBuBAactLxlR7J5QxKXIK0Ha2KKptMzSKpuWI1-URKZezfut8SEw~JKrnyeSVssu0cNtq2O8Ewx00OXkTXwHNaXy0ynrKuywo3zACvdNuiX5Whu-VylYKF7e6CSikZvtkveN8MfG8DKpxI2vPWhsSjYHAk~~gSjQNwtXOnDtOT2KpvilnDBuzDOZS3NZ-WLDGQ__",
      durationDate: "2025-03-30",
      weight: 2,
    },
    {
      id: 4,
      title: "Чистовая отделка в подарок!",
      description:
        "При покупке или заказе дома Вы получаете чистовую отделку в ПОДАРОК!",
      imageSrc:
        "https://s3-alpha-sig.figma.com/img/1112/21cc/82cbd0109784aca47dd2339eadd49496?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iOAzNf~ZFVuf8wNHZa4yHFU6dwIw~QYZkye1GSdD0k9p0vsyOKULJVO~Jp37U-fwiwx8jg5dGnw~MhDqml5mpAw6NHaGJdRIrNaMhfac~C6dP5JWSD9SyhcbxJNv4R3JVNmlQjFxkQ0lTv7iX95xi803nS7QpBDxR7~99--x9xikHrau2oe0mKlWGCJG0O452qzxmfT7PpzMYLGPQBC9jr4g5LzCNg0~TFBGtl6Y-j8OlL94WMBu~5JmgUFfISRz2q6cyEN1Xht7oW4~-0hDNlReDXzz6hM28PZe8tQEhJu8VJus9nOdHFOcwLO~GMpTMzpW-GShK5NyswKiVjr7rg__",
      durationDate: "2025-03-30",
      weight: 1,
    },
    {
      id: 5,
      title: "Ипотека для IT от 6%",
      description:
        "Теперь у сотрудников it-компаний есть возможность купить наш готовый дом или заказать строительство по льготной ипотечной ставке от 6%!",
      imageSrc:
        "https://s3-alpha-sig.figma.com/img/67ce/ef51/db0c6d6b4f8ff147e0badd5e7ecd890c?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=G~r1q~wnB-7fXJYWqPhco2HdOCBaOWc8lzX3~9Xll0z0JEH6Ea1GjFaI78RY5PeJKn-0vStSlwNL0YXO4je99AzXzCQ1fAqsE0i7hfl0G4N4SccQTvtx7W3uD4qSM7DKeMlbItZrFf3BKdVV3v93gqrQNwVv451yvStedezRnXpmILepg6I-teOQcmbrDG7vblg8ySpgYfAlZIeyUKGfgKd1lr4oo0KDHDO9CnifHw7Z1UMsAiHgPEHnw9M7oqG1U-p~pgRbFosNALNQOCudn8lXVNB~sCrBHXW4X8PlHEMSWBEMgX9l6TQN9KOTnOqAVnEJOCp4QgUU2Z7-cmU6tA__",
      durationDate: "2025-03-30",
      weight: 5,
    },
  ]);

  // Вычисляем количество рекламных блоков, которые понадобятся
  const numAdsNeeded = Math.floor(houses.length / AD_FREQUENCY);

  // Вычисляем очередь реклам (без изменения состояния внутри цикла)
  const computeAdsQueue = (numAds, pool) => {
    let available = [...pool];
    let last = null;
    let result = [];
    for (let i = 0; i < numAds; i++) {
      if (available.length === 0) {
        available = [...pool];
        if (last) {
          const filtered = available.filter((ad) => ad.id !== last.id);
          if (filtered.length > 0) available = filtered;
        }
      }
      let weighted = [];
      available.forEach((ad) => {
        for (let j = 0; j < ad.weight; j++) {
          weighted.push(ad);
        }
      });
      if (weighted.length === 0) break;
      let selected = null; let attempts = 0;
      do {
        selected = weighted[Math.floor(Math.random() * weighted.length)];
        attempts++;
      } while (selected && last && selected.id === last.id && attempts < 10);
      if (!selected) break;
      last = selected;
      available = available.filter((ad) => ad.id !== selected.id);
      result.push(selected);
    } return result;
  };

  const [adsQueue, setAdsQueue] = useState([]);

  useEffect(() => {
    const ads = computeAdsQueue(numAdsNeeded, adPool);
    setAdsQueue(ads);
  }, [houses.length, villages.length, adPool]);

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getPaginatedPosts(page);
      if (tempHouses[0][0].id !== undefined) {
        setHouses([]);
        setHouses(tempHouses[0]);
        setIsLoaded(true);
      }
    };

    const villagesFetch = async () => {
      const villageData = await getAllVillages();
      if (villageData) {
        setVillages([]);
        setVillages(villageData);
      }
    };

    housesFetch();
    villagesFetch();
  }, [getPaginatedPosts, getAllVillages, isFocused]);

  const getMoreData = async (var_page) => {
    if (selectedList !== "villages" && hasMore) {
      const tempPage = var_page !== undefined ? var_page : page + 1;
      if (var_page === 1) {
        setHouses([]);
      }
      try {
        setPage(tempPage);
        const result = await getPaginatedPosts(tempPage);
        if (result[0].length === 0) {
          setHasMore(false);
          return;
        }
        if (houses.length === 0) {
          setHouses(result[0]);
        } else {
          setHouses((prev) => [...prev, ...result[0]]);
        }
      } catch (error) {
        throw error;
      }
    }
  };

  const handleSearchButton = async (value) => {
    setSelectedList(value);
    setHasMore(true);
    getMoreData(1);
  };

  const SearchButtonsContent = [
    { text: "Для вас", value: "houses" },
    { text: "Дома", value: "newHouses" },
    { text: "Коттеджные поселки", value: "villages" },
  ];

  const FlatListHeaderComponent = () => {
    return (
      <View>
        <View style={styles.content}>
          <ServicesComponent />
          <View style={{ height: 16 }} />
          <View
            flexDirection="row"
            style={{ width: width - 32, alignItems: "center", alignSelf: "center" }}
          >
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => navigation.navigate("Поиск")}>
                <HouseSearchButton readOnly={true} />
              </TouchableOpacity>
              <View style={{ width: 16 }} />
              <TouchableOpacity onPress={() => navigation.navigate("CreateHousePostPage")}>
                <AddPostButton />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 24 }} />
          <View style={styles.searchButtonsView}>
            {SearchButtonsContent.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => handleSearchButton(item.value)}
                style={[
                  styles.searchButtonsContent,
                  selectedList === item.value && styles.activeButton,
                ]}
              >
                <Text
                  style={[
                    styles.searchButtonsText,
                    selectedList === item.value && styles.activeButtonsText,
                  ]}
                >
                  {item.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const openModal = (banner) => {
    setSelectedBanner(banner);
    setIsVisibleModalBanner(true);
  };

  const closeModal = () => {
    setSelectedBanner(null);
    setIsVisibleModalBanner(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#9DC0F6" barStyle="light-content" />
      {isLoaded ? (
        <FlatList
          ListHeaderComponent={() => FlatListHeaderComponent()}
          ListEmptyComponent={<ActivityIndicator size="large" color="#32322C" />}
          data={selectedList === "villages" ? villages : houses}
          extraData={selectedList}
          style={styles.scrollView}
          keyExtractor={(item, index) => `item-${item.id}-${index}`}
          ListFooterComponent={<View style={{ height: 256 }} />}
          initialNumToRender={3}
          getItemLayout={(data, index) => ({ length: 250, offset: 250 * index, index })}
          onEndReached={() => {
            if (selectedList === "villages" || !hasMore) {
              return;
            } else {
              houses.length === 0 ? getMoreData(1) : getMoreData();
            }
          }}
          onEndReachedThreshold={0.8}
          renderItem={({ item, index }) => (
            <View>
              {selectedList === "villages" && hasMore ? (
                <VillageCard village={item} />
              ) : (
                <HouseCard item={item} navigation={navigation} itemWidth={width - 32} />

              )}
              {((index + 1) % AD_FREQUENCY === 0) && adsQueue[Math.floor(index / AD_FREQUENCY)] && (
                <Banner
                  key={`banner-${adsQueue[Math.floor(index / AD_FREQUENCY)].id}-${index}`}
                  bannerData={adsQueue[Math.floor(index / AD_FREQUENCY)]}
                  openModal={() => openModal(adsQueue[Math.floor(index / AD_FREQUENCY)])}
                />
              )}
            </View>
          )}
        />
      ) : (
        <ActivityIndicator size="large" color="#32322C" />
      )}
      <AdvertisementModalPage
        isVisible={isVisibleModalBanner}
        closeModal={closeModal}
        selectedBannerData={selectedBanner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    alignItems: "center",
    backgroundColor: "#9DC0F6",
  },
  content: {
    width: "100%",
  },
  scrollView: {
    paddingTop: 20,
  },
  searchButtonsView: {
    flexDirection: "row",
    marginHorizontal: 4,
  },
  searchButtonsContent: {
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  activeButton: {
    // backgroundColor: '#007AFF', // Изменение цвета для активной кнопки
  },
  searchButtonsText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.43,
    opacity: 0.6
  },
  activeButtonsText: {
    fontWeight: '600',
    opacity: 1
  },
  housesTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#32322C',
    marginLeft: 8,
    marginTop: 32,
  },
});

export default MainPage;
