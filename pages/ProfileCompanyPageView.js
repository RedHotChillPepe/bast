import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import CheckCircle from "../assets/svg/CheckCircle.js";
import CheckHouse from "../assets/svg/CheckHouse.js";
import Star from "../assets/svg/Star";
import StarOutline from "../assets/svg/StarOutline";
import CustomModal from '../components/CustomModal.js';
import HouseCard from '../components/HouseCard.js';
import { useApi } from '../context/ApiContext';
import DynamicHousePostPage from './DynamicHousePostPage.js';
import { Selectors } from '../components/Selectors.js';

const { width } = Dimensions.get('window');

const ProfilePageView = ({ route, navigation }) => {
  const { posterId } = route.params
  const { getUserByID } = useApi();
  const [userr, setUser] = useState([])
  const [selectedList, setSelectedList] = useState("active");
  const { getUserPostsByStatus } = useApi();
  const isFocused = useIsFocused();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState();

  const [activePost, setActivePost] = useState([]);
  const [closedPost, setClosedPost] = useState([]);

  const { CompanyId } = route.params

  useEffect(() => {
    const init = async () => {
      const result = await getUserByID(CompanyId, "company")
      // TODO: у компаний нт созданных постов
      // TODO: сделать вывод что документы проверены или нет
      setActivePost(result.posts);
      setClosedPost(result.posts);
      setUser(result)
      setIsLoaded(true);
    }
    init()
  }, [getUserByID, isFocused])

  const handleSelected = (post) => {
    if (!post) return;
    setSelectedPost(post);
    setIsModalShow(true);
  };

  const listProperties = [
    { icon: CheckCircle(), title: "Телефон подтвержден", id: 1 },
    { icon: CheckCircle(), title: "Компания проверена", id: 2 },
    { icon: CheckCircle(), title: "Документы проверены", id: 3 },
  ]

  const renderProperties = () => {
    return <View style={styles.itemContainer}>
      {listProperties.map((item) => (
        <View key={`property-${item.id}`} style={styles.itemBlock}>
          <View style={styles.listItem}>
            {item.icon}
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        </View>))}
    </View>
  }

  const listSelectProperties = [
    { title: "Активные", value: "active", id: 1 },
    { title: "Закрытые", value: "closed", id: 2 },
  ]

  const ListHeader = () => {
    return (
      <View>
        <View style={{
          width, flexDirection: 'row', alignSelf: 'flex-start', marginVertical: 16,
          alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 16
        }} >
          {
            Object.keys(userr).length == 0
              ?
              <ActivityIndicator size="large" color="#32322C" />
              :
              <View style={{ rowGap: 4 }}>
                <Text style={styles.name}>{userr.name} {userr.surname}</Text>
                <View style={{ flexDirection: "row", columnGap: 8 }}>
                  <Text style={{ fontSize: 14, color: '#000', fontFamily: "Sora700", fontWeight: 600, lineHeight: 17.6, letterSpacing: -0.42 }}>4,0</Text>
                  <View style={{ flexDirection: "row", columnGap: 4, alignItems: "center" }}>
                    <Star />
                    <Star />
                    <Star />
                    <Star />
                    <StarOutline />
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: '#808080', fontFamily: "Sora500", fontWeight: 400, lineHeight: 15, letterSpacing: -0.36 }}>1 подписчик, 1 подписка</Text>
                <Text style={{ fontSize: 12, color: '#808080', fontFamily: "Sora500", fontWeight: 400, lineHeight: 15, letterSpacing: -0.36 }}>На сайте с мая 2024</Text>
              </View>
          }

          {
            Object.keys(userr).length === 0
              ?
              <FontAwesome6 name="face-tired" size={85} color="black" />
              :
              <Image style={{ overflow: 'hidden', borderRadius: 150 / 2 }} width={80} height={80} source={{ uri: userr.photo }} />
            // <Image style={{ overflow: 'hidden', borderRadius: 100 }} width={85} height={85} source={{ uri: "https://s3-alpha-sig.figma.com/img/c142/04c5/bad6f6e3f1a41d5d0962f534a877b279?Expires=1744588800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=QgEtDMMpy~t4NPkf9gyMEvgTj-qye8Mpf-W1G~mK4nJ~SxuhGkf5ZWLyPT7e7ByDbEnhNFQe1DHbnaipuNRsqeMu7NXX~tPIhOAJ-ynT6UnEbH9egIyU2PMmYtZDaMckJjEOQljsK~TFCaYMvhfHbFXouHv~Sh~AYEYtUg6rwJSaG285mv83VXeU-HmB1oK6f~k5FLCG4ZtI-~LnKBrXBoHYIXJNftIjZC8NvkiIlqJc2f-75oNWWmUHvDEBDFbEearxN71ZJXdhk8DxJRXWr0YjQ7SdBvzTuT~F1OIFtfCTXr-yaBD8E176aablV8~XZBg51qGocV0OLXpwpb0mRA__" }} />
          }
        </View>

        <Pressable style={{ backgroundColor: "#2C88EC66", padding: 12, borderRadius: 12, alignSelf: "flex-start", marginHorizontal: 16 }}>
          <Text style={{ color: "#F2F2F7", fontSize: 16, fontFamily: "Sora700", fontWeight: 600, lineHeight: 20, letterSpacing: -0.48, textAlign: "center" }}>
            Подписаться
          </Text>
        </Pressable>

        {renderProperties()}

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Написать
          </Text>
        </Pressable>
        <View style={{ marginLeft: 16 }}>
          <Selectors handleSelected={setSelectedList} selectedList={selectedList} listSelector={listSelectProperties} />
        </View>
      </View>
    )
  }

  return (<View style={styles.container}>
    <StatusBar backgroundColor="#E5E5EA" barStyle="dark-content" />
    <FlatList
      ListHeaderComponent={ListHeader}
      data={selectedList == "active" ? activePost : closedPost}
      renderItem={({ item }) => (
        <HouseCard
          item={item}
          navigation={navigation}
          isModal={true}
          handleSelected={handleSelected}
          itemWidth={width - 32}
        />
      )}
      ListFooterComponent={isLoaded ?
        <View height={104}><Text style={{ textAlign: "center", marginVertical: 16 }}>Постов больше нет</Text></View> :
        <ActivityIndicator size="large" style={{ marginTop: 16 }} color="#32322C" />}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
    />
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
  </View>)
};

export default ProfilePageView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    height: '100%',
  },
  nameBlock: {
    flexDirection: 'row',
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemContainer: {
    rowGap: 4,
    marginTop: 16,
    marginHorizontal: 16,
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#F2F2F7',
    padding: 8,
    borderRadius: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    marginLeft: 10,
    fontFamily: "Sora400",
    fontWeight: 400,
    lineHeight: 17.6,
    letterSpacing: -0.42
  },
  name: {
    fontSize: 20,
    letterSpacing: -0.6,
    fontWeight: 600,
    color: '#3E3E3E',
    fontFamily: "Sora700",
    lineHeight: 20,
  },
  button: {
    padding: 12,
    marginTop: 16,
    marginBottom: 32,
    marginHorizontal: 16,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#2C88EC",
  },
  buttonText: {
    fontWeight: 600,
    fontFamily: "Sora500",
    fontSize: 16,
    lineHeight: 20,
    color: "#F2F2F7",
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
});


