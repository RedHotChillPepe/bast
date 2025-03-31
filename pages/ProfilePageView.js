import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApi } from '../context/ApiContext';

const { width } = Dimensions.get('window');



const ProfilePageView = ({ route, navigation }) => {
  const { posterId } = route.params
  const { getUserByID } = useApi();
  const [userr, setUser] = useState([])

  useEffect(() => {
    const init = async () => {
      const result = await getUserByID(posterId, "user")
      const resultJson = JSON.parse(await result.text())
      console.log(resultJson);

      setUser(resultJson[0])
    }
    init()
    return () => {

    }
  }, [getUserByID])




  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ width: width, flexDirection: 'row', alignSelf: 'flex-start', marginTop: 16, marginBottom: 16, alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 16 }} >
        {
          Object.keys(userr).length != 0
            ?
            <View>
              <Text style={styles.name}>{userr.name} {userr.surname}</Text>
              {/* <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.email}</Text> */}
              {/* <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.phone}</Text> */}
              <Text style={{ fontSize: 16, color: '#858585' }}>На сайте с мая 2024</Text>
            </View>
            :
            <ActivityIndicator size="large" color="#32322C" />
        }

        {
          Object.keys(userr).length != 0
            ?
            <Image style={{ overflow: 'hidden', borderRadius: 150 / 2 }} width={80} height={80} source={{ uri: userr.photo }} />
            :
            <FontAwesome6 name="face-tired" size={56} color="black" />
        }
      </View>

      <View style={styles.itemBlock}>
        <View style={styles.listItem}>
          <AntDesign name="check" size={17} color="black" />
          <Text style={styles.itemText}>Телефон подтвержден</Text>
        </View>
      </View>
      <View style={styles.itemBlock}>
        <View style={styles.listItem}>
          <AntDesign name="check" size={17} color="black" />
          <Text style={styles.itemText}>Почта подтверждена</Text>
        </View>
      </View>

      <Pressable style={{ backgroundColor: '#d6d6d6', width: width - 32, padding: 16, borderRadius: 20, marginTop: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Написать
        </Text>
      </Pressable>


      <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 16, marginTop: 40, marginBottom: 16 }}>
        Объявления
      </Text>
    </ScrollView>
  );


};

export default ProfilePageView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  nameBlock: {
    flexDirection: 'row',
    width: width - 32,
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#d6d6d6',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 17,
    color: '#14080E',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 32,
  },
  logoutText: {
    color: 'grey',
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14080E',
  },
  email: {
    fontSize: 18,
    color: '#858585',
  },
});


