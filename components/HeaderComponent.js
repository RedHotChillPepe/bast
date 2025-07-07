import Octicons from "@expo/vector-icons/Octicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApi } from "../context/ApiContext";
import { useTheme } from "../context/ThemeContext";
import UniversalHeader from "./UniversalHeaderComponent";
import SortAscIcon from "../assets/svg/SortAsc";
import SortDescIcon from "../assets/svg/SortDesc";

const { width } = Dimensions.get("window");

export default function HeaderComponent() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const { getCompanyByName } = useApi();

  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAscSort, setIsAscSort] = useState(true);

  // Дебаунс для поискового запроса (запускаем handleSubmit только после 500мс паузы)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Запускаем поиск при изменении debouncedQuery
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      handleSubmit(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const handleText = (query) => {
    setSearchQuery(query);
  };

  const handleSubmit = async (query) => {
    if (String(query).length === 0) return;

    try {
      setIsLoading(true);
      const result = await getCompanyByName(query);
      const resultJson = JSON.parse(await result.text());

      let foundResults = resultJson[1];

      // Применим сортировку сразу после получения
      foundResults.sort((a, b) => {
        const dateA = a.creation_date ? new Date(a.creation_date).getTime() : 0;
        const dateB = b.creation_date ? new Date(b.creation_date).getTime() : 0;
        return !isAscSort ? dateA - dateB : dateB - dateA;
      });

      setResults(foundResults);
    } catch (error) {
      console.error("Ошибка при поиске:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        navigation.navigate("ProfileCompanyPageView", { CompanyId: item.id });
        setModalVisible(false);
      }}
    >
      <Image
        style={{ height: 66, width: 66, borderRadius: 48 }}
        source={
          item.photo.length == 0
            ? require("../assets/placeholder.png")
            : { uri: item.photo }
        }
      />
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ rowGap: 4 }}>
          <Text style={[theme.typography.regularBold, { textAlign: "left" }]}>
            {item.name}
          </Text>
          <Text style={[theme.typography.regular(), { textAlign: "left" }]}>
            Агентство Недвижимости
          </Text>
        </View>
        <Text
          style={[theme.typography.regular("caption"), { textAlign: "left" }]}
        >
          На сайте с {new Date(item.creation_date).getFullYear()} года{" "}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleFilter = () => {
    setIsAscSort((prev) => {
      const newSort = !prev;

      setResults((prevResults) =>
        [...prevResults].sort((a, b) => {
          const dateA = a.creation_date
            ? new Date(a.creation_date).getTime()
            : 0;
          const dateB = b.creation_date
            ? new Date(b.creation_date).getTime()
            : 0;
          return !newSort ? dateA - dateB : dateB - dateA;
        })
      );

      return newSort;
    });
  };

  const filterButton = () => (
    <TouchableOpacity
      onPress={handleFilter}
      style={{ columnGap: 12, flexDirection: "row", alignItems: "center" }}
    >
      <Text style={theme.typography.regular("accent")}>По дате</Text>
      {isAscSort ? (
        <SortAscIcon width={24} height={24} />
      ) : (
        <SortDescIcon width={24} height={24} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>БАСТ</Text>
          <Octicons
            name="search"
            size={28}
            color="#2C88EC"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
          >
            <View style={styles.modalContent}>
              <UniversalHeader
                title="Поиск по застройщикам"
                handleClose={() => setModalVisible(false)}
                typography={"title2"}
                // rightButton={filterButton()}
              />
              <TextInput
                placeholder="Введите название организации..."
                value={searchQuery}
                onChangeText={handleText}
                style={styles.searchInput}
                autoFocus={true}
                returnKeyType="search"
              />

              {isLoading ? (
                <ActivityIndicator size={"large"} color={theme.colors.accent} />
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderResult}
                  style={styles.resultsList}
                  ListEmptyComponent={
                    debouncedQuery.length > 0 && (
                      <Text style={theme.typography.title3("caption")}>
                        Нет результатов
                      </Text>
                    )
                  }
                />
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
}

const makeStyles = (theme) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: theme.colors.background,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      width: width,
    },
    headerText: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: "600",
      color: "#3E3E3E",
      fontFamily: "Sora700",
    },
    modalOverlay: {
      position: "absolute",
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0)",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    modalContent: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      padding: 16,
    },
    searchInput: {
      borderRadius: 12,
      backgroundColor: theme.colors.block,
      padding: 16,
      marginBottom: 24,
    },
    resultsList: {
      flexGrow: 0,
      marginBottom: 12,
    },
    resultItem: {
      marginVertical: 8,
      backgroundColor: theme.colors.block,
      padding: 16,
      borderRadius: 12,
      flexDirection: "row",
      columnGap: 16,
    },
  });
