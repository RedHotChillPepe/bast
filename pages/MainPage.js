import { AntDesign, Octicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomModal from "../components/CustomModal";
import HouseCard from "../components/HouseCard";
import Banner from "../components/MainComponents/Banner";
import HeaderButton from "../components/MainComponents/HeaderButton";
import ServicesComponent from "../components/ServiciesComponent";
import VillageCard from "../components/VillageCard";
import { useApi } from "../context/ApiContext";
import AdvertisementModalPage from "../pages/AdvertisementModalPage";
import DynamicHousePostPage from "./DynamicHousePostPage";
import { DynamicVillagePostPage } from "./DynamicVillagePostPage";
import { Selectors } from "../components/Selectors";

const { width, height } = Dimensions.get("window");

const AD_FREQUENCY = 10;

const MainPage = ({ navigation }) => {
  const { getPaginatedPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [villages, setVillages] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [selectedList, setSelectedList] = useState("houses"); // "houses" или "villages"
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isVisibleModalBanner, setIsVisibleModalBanner] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  // Значения высоты, которые измерятся динамически
  const [houseHeight, setHouseHeight] = useState(180); // значение по умолчанию
  const [adHeight, setAdHeight] = useState(200); // значение по умолчанию

  const logAdEvent = (message, data = {}) => {
    console.log(`[AD-LOG] ${new Date().toISOString()} - ${message}`, data);
  };

  // Исходный пул рекламы
  // Объявление 5: должно доминировать благодаря бюджету+рейтингу
  // Объявление 2: баланс бюджета и недавней публикации
  // Объявление 4: проверка минимального веса
  // Объявление 1: тестирование cooldown
  // Объявление 3: проверка decay rate

  /**
   * Рекламное объявление: структура данных
   *
   * @typedef {Object} Advertisement
   * @property {number} id - Уникальный идентификатор объявления (обязательно)
   * @property {string} title - Заголовок объявления (макс. 60 символов)
   * @property {string} description - Текст объявления (макс. 160 символов)
   * @property {string} imageSrc - URL изображения (формат: WebP, размер: 600x400)
   *
   * // Таймстампы и временные параметры
   * @property {number} durationDate - Дата окончания показа (timestamp)
   * @property {number} publishTime - Дата публикации (timestamp)
   * @property {number} cooldown - Задержка между показами (мс)
   *
   * // Параметры ранжирования
   * @property {number} baseWeight - Базовый вес (1-10):
   *   1 - низкий приоритет, 10 - максимальный
   * @property {number} budget - Бюджет кампании (в руб.):
   *   Влияет на приоритет: бюджет 5000 = +50 к весу
   * @property {number} rating - Рейтинг (1-5):
   *   Рассчитывается из лайков/просмотров (4.2 = 84% положительных)
   * @property {number} decayRate - Коэф. затухания (0.01-0.05):
   *   Формула: weight -= decayRate * часы_с_публикации
   *
   * // Статистика
   * @property {number} impressions - Количество показов
   *
   * // Тип кампании (влияет на дизайн)
   * @property {'standard'|'premium'|'vip'} campaignType -
   *   premium: выделенный фон, vip: анимация
   *
   * @example
   * {
   *   id: 1,
   *   title: "Построим дом...",
   *   //...
   *   decayRate: 0.01 // Вес уменьшится на 0.24 через 24 часа
   * }
   */
  const [adPool, setAdPool] = useState([
    {
      id: 1,
      title: "Построим вам дом, а деньги потом!",
      description:
        "Мы предлагаем не откладывать мечты и готовы начать строить Ваш дом уже сейчас!",
      imageSrc:
        "https://i6.imageban.ru/out/2025/06/09/cf542dbf0c343de78f253851d8888de7.png",
      durationDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).getTime(), // +30 дней
      baseWeight: 3,
      budget: 5000, // Увеличено для тестирования влияния бюджета
      rating: 4.2,
      publishTime: new Date(Date.now() - 3 * 24 * 3600 * 1000).getTime(), // 3 дня назад
      impressions: 0,
      decayRate: 0.01, // Уменьшено для реалистичного затухания
      cooldown: 300_000, // 5 минут для частого тестирования
      campaignType: "premium",
    },
    {
      id: 2,
      title: "Уникальное предложение по Пазелы Village!",
      description:
        "Не упустите шанс стать владельцем земли на выгодных условиях!",
      imageSrc:
        "https://i4.imageban.ru/out/2025/06/09/4d5ad03143fd3c08f23a4be55b9f695c.png",
      durationDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).getTime(), // +14 дней
      baseWeight: 4,
      budget: 3000,
      rating: 4.7,
      publishTime: new Date(Date.now() - 24 * 3600 * 1000).getTime(), // 1 день назад
      impressions: 0,
      decayRate: 0.005,
      cooldown: 600_000, // 10 минут
      campaignType: "vip",
    },
    {
      id: 3,
      title: "Выкупим дом обратно!",
      description:
        "Мы предлагаем не откладывать мечты и готовы начать строить Ваш дом уже сейчас!",
      imageSrc:
        "https://i3.imageban.ru/out/2025/06/09/a77512793728ed5d570add24b0d8d422.png",
      durationDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).getTime(), // +7 дней
      baseWeight: 2,
      budget: 2000,
      rating: 4.0,
      publishTime: new Date(Date.now() - 48 * 3600 * 1000).getTime(), // 2 дня назад
      impressions: 0,
      decayRate: 0.02,
      cooldown: 180_000, // 3 минуты
      campaignType: "standard",
    },
    {
      id: 4,
      title: "Чистовая отделка в подарок!",
      description:
        "При покупке или заказе дома Вы получаете чистовую отделку в ПОДАРОК!",
      imageSrc:
        "https://i2.imageban.ru/out/2025/06/09/ece108e6d8f01b5d607768141040b4b6.png",
      durationDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).getTime(), // +60 дней
      baseWeight: 1,
      budget: 1000,
      rating: 4.3,
      publishTime: new Date(Date.now() - 6 * 3600 * 1000).getTime(), // 6 часов назад
      impressions: 0,
      decayRate: 0.015,
      cooldown: 240_000, // 4 минуты
      campaignType: "standard",
    },
    {
      id: 5,
      title: "Ипотека для IT от 6%",
      description:
        "Теперь у сотрудников it-компаний есть возможность купить наш готовый дом или заказать строительство по льготной ипотечной ставке от 6%!",
      imageSrc:
        "https://i4.imageban.ru/out/2025/06/09/0c192869f10160e472e3faae6009d331.png",
      durationDate: new Date(Date.now() + 45 * 24 * 3600 * 1000).getTime(), // +45 дней
      baseWeight: 5,
      budget: 7000, // Самый высокий бюджет
      rating: 4.9, // Самый высокий рейтинг
      publishTime: new Date(Date.now() - 12 * 3600 * 1000).getTime(), // 12 часов назад
      impressions: 0,
      decayRate: 0.008,
      cooldown: 900_000, // 3 часа
      campaignType: "vip",
    },
  ]);

  // Вычисляем количество рекламных блоков
  const numAdsNeeded = Math.floor(houses.length / AD_FREQUENCY);

  // TODO: вынести и сделать кеширование баланса, статистики.
  const calculateAdWeight = (ad) => {
    const now = Date.now();
    const timeSincePublish = (now - ad.publishTime) / (1000 * 60 * 60); // в часах

    logAdEvent("Calculating weight for ad", {
      adId: ad.id,
      baseWeight: ad.baseWeight,
      budget: ad.budget,
      publishTime: new Date(ad.publishTime).toISOString(),
      rating: ad.rating,
      impressions: ad.impressions,
      decayRate: ad.decayRate,
    });

    const budgetFactor = ad.budget / 100;
    const timeDecay = Math.exp(-ad.decayRate * timeSincePublish);
    const ratingFactor = ad.rating * 2;
    const impressionsFactor = Math.max(1 + 0.1 * ad.impressions, 1);

    const weight =
      (ad.baseWeight * budgetFactor * timeDecay + ratingFactor) /
      impressionsFactor;

    logAdEvent("Weight calculation details", {
      adId: ad.id,
      timeSincePublishHours: timeSincePublish.toFixed(2),
      budgetFactor: budgetFactor.toFixed(2),
      timeDecay: timeDecay.toFixed(4),
      ratingFactor: ratingFactor.toFixed(2),
      impressionsFactor: impressionsFactor.toFixed(2),
      finalWeight: weight.toFixed(2),
    });

    return weight;
  };

  const groupAndShuffle = (ads) => {
    const groups = new Map();
    ads.forEach((ad) => {
      const key = ad.weight.toFixed(2);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(ad);
    });

    return Array.from(groups.values())
      .map((group) => group.sort(() => Math.random() - 0.5))
      .flat();
  };

  // Формируем очередь рекламы
  const computeAdsQueue = (numAds, pool) => {
    const now = Date.now();
    logAdEvent("Starting ads selection", { requestedAds: numAds });

    const eligibleAds = pool
      .filter((ad) => {
        const isExpired = new Date(ad.durationDate).getTime() < now;
        const isInCooldown = ad.lastShown
          ? now - ad.lastShown < ad.cooldown
          : false;

        logAdEvent("Filtering ad", {
          adId: ad.id,
          isExpired,
          isInCooldown,
          cooldownRemaining: isInCooldown
            ? `${((ad.cooldown - (now - ad.lastShown)) / 1000).toFixed(0)}s`
            : "none",
        });

        return !isExpired && !isInCooldown;
      })
      .map((ad) => ({
        ...ad,
        weight: calculateAdWeight(ad),
      }))
      .sort((a, b) => b.weight - a.weight);

    logAdEvent("Eligible ads after filtering", {
      ads: eligibleAds.map((ad) => ({
        id: ad.id,
        weight: ad.weight.toFixed(2),
        campaignType: ad.campaignType,
      })),
    });

    const shuffledAds = groupAndShuffle(eligibleAds);
    const selectedAds = [];
    let lastAdId = null;

    for (let i = 0; i < numAds && i < shuffledAds.length; i++) {
      const available = shuffledAds.filter((ad) => ad.id !== lastAdId);
      if (available.length === 0) break;

      const selected = available[0];
      selectedAds.push(selected);
      lastAdId = selected.id;

      logAdEvent("Ad selected for display", {
        position: i + 1,
        adId: selected.id,
        weight: selected.weight.toFixed(2),
        campaignType: selected.campaignType,
      });
    }

    logAdEvent("Final selected ads", {
      selectedIds: selectedAds.map((ad) => ad.id),
      totalSelected: selectedAds.length,
    });

    // Обновляем статистику показов
    setAdPool((prev) =>
      prev.map((ad) => {
        const wasSelected = selectedAds.some((s) => s.id === ad.id);
        if (wasSelected) {
          logAdEvent("Updating ad impressions", {
            adId: ad.id,
            newImpressions: ad.impressions + 1,
            lastShown: new Date(now).toISOString(),
          });
        }
        return wasSelected
          ? {
              ...ad,
              impressions: ad.impressions + 1,
              lastShown: now,
            }
          : ad;
      })
    );

    return selectedAds;
  };

  const [adsQueue, setAdsQueue] = useState([]);
  const [prevNumAdsNeeded, setPrevNumAdsNeeded] = useState(0);

  const adPoolRef = useRef(adPool);
  useEffect(() => {
    adPoolRef.current = adPool;
  }, [adPool]);

  useEffect(() => {
    if (numAdsNeeded <= prevNumAdsNeeded) return;

    const needed = numAdsNeeded - prevNumAdsNeeded;
    const newAds = computeAdsQueue(needed, adPoolRef.current);

    setAdsQueue((prev) => [...prev, ...newAds]);
    setPrevNumAdsNeeded(numAdsNeeded);
  }, [numAdsNeeded, prevNumAdsNeeded]);

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getPaginatedPosts(page);
      if (tempHouses[0].id === undefined) {
        return;
      }
      setHouses([]);
      setHouses(tempHouses);
      setIsLoaded(true);
    };
    const villagesFetch = async () => {
      const villageData = await getAllVillages();
      if (!villageData) return;
      setVillages(villageData); // Используем spread для создания нового массива
    };

    const buildersFetch = async () => {
      // TODO: реализовать получение застройщиков
    };

    housesFetch();
    villagesFetch();
    buildersFetch();
  }, [getPaginatedPosts, getAllVillages, isFocused]);

  const fetchMoreData = useCallback(async () => {
    if (
      !(selectedList !== "villages" && selectedList !== "builders" && hasMore)
    ) {
      return;
    }
    const nextPage = page + 1;
    const newHouses = await getPaginatedPosts(nextPage);
    if (newHouses.length === 0) {
      setHasMore(false);
    } else {
      setHouses((prev) => [...prev, ...newHouses]);
      setPage(nextPage);
    }
  }, [page, selectedList, hasMore, getPaginatedPosts]);

  const handleSearchButton = useCallback(
    (value) => {
      setSelectedList(value);
      // TODO: загрулшка, что бы убрать загрузка вилл
      setHasMore(value !== "villages" && value !== "builders");
      // setHasMore(true);
      setPage(1);
      setHouses([]);
      fetchMoreData();
    },
    [fetchMoreData]
  );

  const SearchButtonsContent = [
    { title: "Все", value: "houses", id: 1 },
    { title: "Дома", value: "newHouses", id: 2 },
    { title: "Поселки", value: "villages", id: 3 },
    // { text: "Застройщики", value: "builders" },
  ];

  const FlatListHeaderComponent = () => {
    return (
      <View>
        <View style={styles.content}>
          <View>
            <ServicesComponent />
          </View>
          <View style={{ height: 8 }} />
          <View
            flexDirection="row"
            style={{
              width: width - 32,
              alignItems: "center",
              alignSelf: "center",
              columnGap: 8,
              justifyContent: "space-between",
            }}
          >
            <HeaderButton
              icon={<AntDesign name="home" size={20} color="#2C88EC" />}
              title="Добавить объявление"
              handleButton={() => navigation.navigate("CreateHousePostPage")}
            />
            <HeaderButton
              icon={<Octicons name="search" size={20} color="#2C88EC" />}
              title="Поиск дома"
              handleButton={() => navigation.navigate("Поиск")}
            />
          </View>
          <View style={{ height: 24 }} />
          <View style={{ marginLeft: 16 }}>
            <Selectors
              handleSelected={setSelectedList}
              selectedList={selectedList}
              listSelector={SearchButtonsContent}
            />
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

  const MemoizedHouseCard = memo(
    HouseCard,
    (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
  );
  const MemoizedVillageCard = memo(
    VillageCard,
    (prevProps, nextProps) => prevProps.village.id === nextProps.village.id
  );
  const MemoizedBanner = memo(
    (props) => {
      const { bannerData, openModal } = props;
      // Логирование показа баннера
      useEffect(() => {
        console.log("[AD-LOG] Banner displayed", {
          adId: bannerData.id,
          timestamp: Date.now(),
          campaignType: bannerData.campaignType,
          weight: bannerData.weight?.toFixed(2),
        });
      }, [bannerData.id]);

      // Логирование клика
      const handlePress = useCallback(() => {
        console.log("[AD-LOG] Banner clicked", {
          adId: bannerData.id,
          timestamp: Date.now(),
          position: "main_feed",
        });
        openModal();
      }, [bannerData.id, openModal]);

      return <Banner {...props} openModal={handlePress} />;
    },
    (prevProps, nextProps) => {
      // Сохраняем вашу оригинальную логику сравнения
      return prevProps.bannerData.id === nextProps.bannerData.id;
    }
  );

  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState();

  const handleSelected = (post) => {
    if (!post) return;
    setSelectedPost(post);
    setIsModalShow(true);
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <View>
        {selectedList === "villages" && (
          <MemoizedVillageCard
            isModal={true}
            navigation={navigation}
            village={item}
            handleSelected={handleSelected}
          />
        )}
        {(selectedList === "houses" || selectedList === "newHouses") && (
          <View onLayout={onHouseLayout}>
            <MemoizedHouseCard
              item={item}
              navigation={navigation}
              isModal={true}
              handleSelected={handleSelected}
              itemWidth={width - 32}
            />
          </View>
        )}
        {(index + 1) % AD_FREQUENCY === 0 &&
          adsQueue[Math.floor(index / AD_FREQUENCY)] && (
            <View onLayout={onAdLayout}>
              <MemoizedBanner
                bannerData={adsQueue[Math.floor(index / AD_FREQUENCY)]}
                openModal={() =>
                  openModal(adsQueue[Math.floor(index / AD_FREQUENCY)])
                }
              />
            </View>
          )}
      </View>
    ),
    [selectedList, adsQueue]
  );

  const ListFooter = () => {
    if (!hasMore)
      return (
        <Text style={styles.noMoreText}>Больше нет постов для загрузки</Text>
      );
    return (
      <View style={{ marginVertical: 16, height: 176 }}>
        <ActivityIndicator size="large" color="#32322C" />
      </View>
    );
  };

  // Функция, которая вызывается при измерении HouseCard
  const onHouseLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setHouseHeight(height);
  }, []);

  // Функция, которая вызывается при измерении Banner
  const onAdLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setAdHeight(height);
  }, []);

  // Функция для FlatList, вычисляющая смещение и длину элемента
  const getItemLayout = (data, index) => {
    // Если это рекламный элемент
    const isAd = (index + 1) % AD_FREQUENCY === 0;
    const itemHeight = isAd ? adHeight : houseHeight;
    // Число рекламных блоков, которые были до этого элемента
    const numAdsBefore = Math.floor(index / AD_FREQUENCY);
    // Смещение рассчитываем так: базовая высота всех элементов плюс дополнительная высота для рекламных блоков
    const offset =
      index * houseHeight + numAdsBefore * (adHeight - houseHeight);
    return { length: itemHeight, offset, index };
  };

  // TODO: удалить после разработки

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
      {selectedPost && (
        <CustomModal
          isVisible={isModalShow}
          onClose={() => setIsModalShow(false)}
        >
          {selectedList === "villages" ? (
            // <VillageCard village={selectedPost} />
            <DynamicVillagePostPage
              navigation={navigation}
              route={{
                villageId: selectedPost,
                isModal: true,
                setIsModalShow,
              }}
            />
          ) : (
            <DynamicHousePostPage
              navigation={navigation}
              route={{
                houseId: selectedPost,
                isModal: true,
                setIsModalShow,
              }}
            />
          )}
        </CustomModal>
      )}
      {isLoaded ? (
        <FlatList
          ListHeaderComponent={() => FlatListHeaderComponent()}
          data={
            selectedList === "villages"
              ? villages
              : selectedList === "houses" || selectedList === "newHouses"
              ? houses
              : builders
          }
          extraData={selectedList}
          style={styles.scrollView}
          keyExtractor={(item, index) => `item-${index}`}
          ListFooterComponent={ListFooter}
          initialNumToRender={3}
          getItemLayout={getItemLayout}
          onEndReached={() => {
            if (
              selectedList !== "villages" &&
              selectedList !== "builders" &&
              hasMore
            )
              fetchMoreData();
          }}
          onEndReachedThreshold={0.8}
          renderItem={renderItem}
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
    height,
    alignItems: "center",
    backgroundColor: "#E5E5EA",
  },
  content: {
    width: "100%",
  },
  scrollView: {
    paddingTop: 20,
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
  },
  searchButtonsContent: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeButton: {
    backgroundColor: "#2C88EC",
    borderRadius: 12,
  },
  searchButtonsText: {
    color: "#808080",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17.6,
    letterSpacing: -0.43,
    fontFamily: "Sora400",
  },
  activeButtonsText: {
    fontWeight: "600",
    color: "#F2F2F7",
    fontFamily: "Sora700",
    fontSize: 14,
  },
  housesTitleText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#32322C",
    marginLeft: 8,
    marginTop: 32,
  },
  noMoreText: {
    textAlign: "center",
    marginVertical: 16,
    fontSize: 16,
    color: "#32322C",
    height: 160,
  },
});

export default MainPage;
