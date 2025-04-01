import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Geocoder, Marker, YaMap } from "react-native-yamap";
import CustomModal from "../components/CustomModal";
import HouseCard from "../components/HouseCard";
import { useApi } from "../context/ApiContext";
import DynamicHousePostPage from "./DynamicHousePostPage";

const { width } = Dimensions.get("window");

export default function SearchMap({ navigation, route }) {
  const { getAllPosts, getPaginatedPosts } = useApi();
  const { query } = route.params;

  const [posts, setPosts] = useState([]);

  const [debugHouse, setDebugHouse] = useState([]);

  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState();

  const handleSelected = (post) => {
    if (!post) return;
    console.log(post);
    setSelectedPost(post);
    setIsModalShow(true);
  };

  useEffect(() => {
    // FIXME Крайне неоптимальный код, срочно поменять
    const loadMarkers = async () => {
      console.log(query);

      const tempHouses =
        query.length == 0
          ? await getAllPosts()
          : await getPaginatedPosts("undefined", query); // FIXME
      if ((await tempHouses[0][0].id) != undefined) {
        tempHouses[0].forEach((house) => {
          if (house.longitude != null || house.latitude != null) {
            setDebugHouse((prevData) => [...prevData, house]);
            setPosts((prevData) => [
              ...prevData,
              {
                point: {
                  lon: parseFloat(house.longitude),
                  lat: parseFloat(house.latitude),
                },
                id: house.id,
              },
            ]);
          } else {
            const addressString = house.city + " " + house.full_address;
            Geocoder.addressToGeo(addressString).then(({ lat, lon }) => {
              setPosts((prevData) => [
                ...prevData,
                { point: { lon: lon, lat: lat }, id: house.id },
              ]);
            });
          }
        });
      }
    };
    loadMarkers();
    return () => { };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {process.env.NODE_ENV !== "development" ? (
        <YaMap
          style={{ width: "100%", height: "100%", alignSelf: "center" }}
          initialRegion={{ lat: 56.84976, lon: 53.20448, zoom: 10 }}
        >
          {Object.keys(posts).length != 0 &&
            posts.map((post, index) => (
              <Marker
                key={index}
                onPress={() => handleSelected(post.id)}
                point={post.point}
                source={require("../assets/marker.png")}
                scale={0.4}
              />
            ))}

          {/* <Marker onPress={() => navigation.navigate('Error404')} point={{ lat: 56.84976,lon: 53.20448 }} source={require('../assets/marker.png')} scale={0.4}/> */}
        </YaMap>
      ) : (
        <ScrollView>
          <Text style={{ fontSize: 24, textAlign: "center", color: "red" }}>
            Режим разработчика: карта
          </Text>
          {debugHouse.map((house, index) => (
            <HouseCard
              key={`debug-${index}`}
              item={house}
              navigation={navigation}
              isModal={true}
              handleSelected={handleSelected}
              itemWidth={width - 32}
            />
          ))}
        </ScrollView>
      )}
      <CustomModal isVisible={isModalShow} onClose={() => setIsModalShow(false)}>
        <DynamicHousePostPage
          navigation={navigation}
          route={{
            houseId: selectedPost,
            isModal: true,
            setIsModalShow,
          }}
        />
      </CustomModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
});
