import React, { useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Geocoder, Marker, YaMap } from "react-native-yamap";
import CustomModal from "../components/CustomModal";
import HouseCard from "../components/HouseCard";
import { useApi } from "../context/ApiContext";
import DynamicHousePostPage from "./DynamicHousePostPage";

const { width } = Dimensions.get("window");

export default function SearchMap({ navigation, route }) {
  const { getAllPosts, getPaginatedPosts } = useApi();
  const { query = {} } = route.params || {};

  const [posts, setPosts] = useState([]);
  const [debugHouse, setDebugHouse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSelected = useCallback((post) => {
    if (!post) return;
    setSelectedPost(post);
    setIsModalShow(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadMarkers = async () => {
      try {
        const tempHouses =
          Object.keys(query).length === 0
            ? await getAllPosts()
            : await getPaginatedPosts(1, query);

        if (!isMounted || !tempHouses?.length) return;

        const newPosts = [];
        const newDebugHouses = [];

        for (const house of tempHouses) {
          if (house?.longitude != null && house?.latitude != null) {
            newDebugHouses.push(house);
            newPosts.push({
              point: {
                lon: parseFloat(house.longitude),
                lat: parseFloat(house.latitude),
              },
              id: house.id,
              ...house, // сохраняем все данные дома для отладки
            });
            continue;
          }

          const addressString = `${house.city || ""} ${
            house.full_address || ""
          }`.trim();
          if (!addressString) continue;

          try {
            const { lat, lon } = await Geocoder.addressToGeo(addressString);
            newDebugHouses.push({ ...house, point: { lon, lat } });
            newPosts.push({
              point: { lon, lat },
              id: house.id,
              ...house,
            });
          } catch (geoError) {
            console.warn(
              `Geocoding failed for address: ${addressString}`,
              geoError
            );
          }
        }

        if (isMounted) {
          setDebugHouse(newDebugHouses);
          setPosts(newPosts);
        }
      } catch (error) {
        console.error("Error loading markers:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMarkers();

    return () => {
      isMounted = false;
    };
  }, [query, getAllPosts, getPaginatedPosts]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {process.env.NODE_ENV === "development" ? (
        <ScrollView>
          <Text style={{ fontSize: 24, textAlign: "center", color: "red" }}>
            Режим разработчика: карта
          </Text>
          {debugHouse.map((house, index) => (
            <HouseCard
              key={`debug-${house.id || index}`}
              item={house}
              navigation={navigation}
              isModal={true}
              handleSelected={() => handleSelected(house.id)}
              itemWidth={width - 32}
            />
          ))}
        </ScrollView>
      ) : (
        <YaMap
          style={{ width: "100%", height: "100%", alignSelf: "center" }}
          initialRegion={{ lat: 56.84976, lon: 53.20448, zoom: 10 }}
          onMapReady={() => console.log("Карта готова!")}
        >
          {posts.map((post) => (
            <Marker
              key={post.id}
              onPress={() => handleSelected(post.id)}
              point={post.point}
              source={require("../assets/marker.png")}
              scale={Platform.OS === "ios" ? 0.4 : 0.25}
            />
          ))}
        </YaMap>
      )}

      <CustomModal
        isVisible={isModalShow}
        onClose={() => setIsModalShow(false)}
      >
        {selectedPost && (
          <DynamicHousePostPage
            navigation={navigation}
            route={{
              params: {
                houseId: selectedPost,
                isModal: true,
              },
              setIsModalShow,
            }}
          />
        )}
      </CustomModal>
    </SafeAreaView>
  );
}
