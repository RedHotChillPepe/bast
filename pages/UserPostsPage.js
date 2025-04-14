import { useIsFocused, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import HouseCard from '../components/HouseCard.js'
import { useApi } from '../context/ApiContext.js'



const { width, height } = Dimensions.get('window');


const UserPostsPage = ({ route }) => {

  const navigation = useNavigation()
  const isFocused = useIsFocused()

  const [houses, setHouses] = useState([])
  const [isEmpty, setIsEmpty] = useState(false)

  const { user_id } = route.params
  let status = route.params.status;
  const [messageEmpty, setMessageEmpty] = useState("");

  const { getUserPostsByStatus } = useApi()

  useEffect(() => {
    const getHouses = async (status) => {
      const tempHouses = await getUserPostsByStatus(user_id, status)
      const tempHousesJson = JSON.parse(await tempHouses.text())

      if (Object.keys(tempHousesJson).length != 0) {
        setHouses(tempHousesJson)
      }
      if (Object.keys(tempHousesJson).length == 0) {
        setIsEmpty(true)
      }
    }

    let title = ""
    switch (status) {
      case 3:
        title = "Закрытые объявления";
        setMessageEmpty("У вас нет закрытых объявлений");
        break;
      case -1:
        title = "Корзина объявлений";
        setMessageEmpty("У вас нет удаленных объявлений");
        break;
      case 0:
        title = "Объявления на модерации";
        setMessageEmpty("У вас нет объявлений на модерации");
        break;
      case 1:
        title = "Мои объявления";
        setMessageEmpty("У вас нет активных объявлений");
        break;
      default:
        title = "Мои объявления";
        setMessageEmpty("У вас нет активных объявлений");
        status = 1;
        break;
    }

    navigation.setOptions({ headerTitle: title });
    getHouses(status)

  }, [isFocused]);


  return (
    <View style={styles.container}>
      {isEmpty ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.noFavsText}>{messageEmpty}</Text>
        </View>

        :
        <View style={styles.housesView}>
          <FlatList
            data={houses}
            style={{ paddingBottom: 512 }}
            ListEmptyComponent={<ActivityIndicator size="large" color="#32322C" />}
            renderItem={({ item }) => (
              <HouseCard
                item={item}
                navigation={navigation}
                itemWidth={width - 32}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>
      }
    </View>
  )
}

export default UserPostsPage

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: '#F2F2F7',
    alignItems: 'center'
  },

  housesView: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center'
  },

  noFavsText: {
    fontSize: 22,
    lineHeight: 25,
    fontWeight: 500,
    letterSpacing: -0.43
  },


})