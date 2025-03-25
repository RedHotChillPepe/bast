import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useApi } from '../context/ApiContext';
import ProfileBuilderPage from './ProfileCompanyPage.js';
import ProfileRealtorPage from './ProfileEmployeePage.js';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HouseCard from '../components/HouseCard.js';

const { width } = Dimensions.get('window');



const ProfileCompanyPageView = ({ route, navigation }) => {
  const { CompanyId } = route.params
  const { getUserByID } = useApi();

  const [userr, setUser] = useState([])



  useEffect(() => {
    const init = async () => {
      const result = await getUserByID(CompanyId, "company")
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

      <View style={{ flexDirection: 'row', alignSelf: 'flex-start', marginTop: 32, width: width - 32, alignSelf: 'center', justifyContent: 'space-between' }} >
        {
          Object.keys(userr).length != 0
            ?
            <View>
              <Text style={styles.name}>{userr.name}</Text>
              <Text style={styles.email}>Надежная компания</Text>
              <Text style={styles.email}>На сайте с 2025 года</Text>
              {/* <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.email}</Text>
                <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.phone}</Text> */}
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

      <Pressable style={{
        backgroundColor: '#d6d6d6',
        width: width - 32,
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 24,
        alignItems: 'center',
        alignSelf: 'center'
      }}
        onPress={() => { navigation.navigate('Error', { errorCode: 503 }) }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Написать
        </Text>
      </Pressable>


      <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 16, marginTop: 40, marginBottom: 16 }}>
        Объявления
      </Text>

      <Pressable style={{
        backgroundColor: '#d6d6d6', padding: 16,
        borderRadius: 12, marginTop: 24, flexDirection: 'row',
        alignItems: 'center', alignSelf: 'flex-start'
      }} onPress={() => { navigation.navigate('Error', { errorCode: 503 }) }}>

        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Посмотреть
        </Text>

      </Pressable>

    </ScrollView>
  );


};

export default ProfileCompanyPageView;

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
