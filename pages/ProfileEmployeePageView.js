import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import HouseCard from '../components/HouseCard.js';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const ProfileEmployeePageView = () => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();

  const { getUser, getCurrentUser } = useApi()

  const { getAllPosts, getAllVillages } = useApi();
  const [houses, setHouses] = useState([]);
  const [selectedList, setSelectedList] = useState('houses');

  const [userr, setUser] = useState([])

  useEffect(() => {
    const housesFetch = async () => {
      const tempHouses = await getAllPosts();
      if (tempHouses) {
        const tempSetHouses = [];
        const tempSetNewHouses = [];
        tempHouses.forEach((house) => {
          if (house.newbuild) {
            tempSetNewHouses.push(house);
          } else {
            tempSetHouses.push(house);
          }
        });
        setHouses(tempSetHouses);
        setNewHouses(tempSetNewHouses);
      }
    };

    const villagesFetch = async () => {
      const villageData = await getAllVillages();
      if (villageData) {
        setVillages(villageData);
      }
    };

    housesFetch();
    villagesFetch();
  }, []);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser)
      }


    }
    init()

    return () => {

    }
  }, [])

  // Массив данных для списков
  const sections = [
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Текущие проекты' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Документы' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Компания' },
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Комнада' },
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Контрагенты' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Клиенты' },
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Сделки' },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        { icon: <FontAwesome6 name="list-alt" size={20} color="black" />, label: 'Мои объявления' },
        { icon: <AntDesign name="hearto" size={20} color="black" />, label: 'Избранное' },
        { icon: <Ionicons name="search" size={20} color="black" />, label: 'Поиски' },
        { icon: <Ionicons name="man-outline" size={20} color="black" />, label: 'Риэлторы' },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={20} color="black" />, label: 'Уведомления' },
        { icon: <Ionicons name="chatbox-outline" size={20} color="black" />, label: 'Чат с поддержкой' },
        { icon: <Ionicons name="calculator-outline" size={20} color="black" />, label: 'Ипотечный калькулятор' },
        { icon: <Ionicons name="help-buoy-outline" size={20} color="black" />, label: 'Справочный центр' },
        { icon: <Ionicons name="help-circle-outline" size={20} color="black" />, label: 'О приложении' },
      ],
    },
  ];

  const renderItem = (item, index) => (
    <Pressable key={index} style={styles.listItem}>
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.nameBlock}>
        <View style={{ flexDirection: 'row' }}>
          {
            Object.keys(userr).length != 0 && userr.photo != undefined
              ?
              <Image style={{ overflow: 'hidden', borderRadius: 150 / 2 }} width={56} height={56} source={{ uri: userr.photo }} />
              :
              <FontAwesome6 name="face-tired" size={56} color="black" />
          }
          <View style={{ marginLeft: 16, width: '60%' }}>
            <Text style={styles.name}>{userr.name != undefined && userr.surname != undefined ? userr.name + " " + userr.surname : "Name Surname"}</Text>
            <Text style={styles.email}>{userr.email != undefined ? userr.email : "mail@example.com"}</Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={32} color="black" />
      </View>

      <Text style={{ fontSize: 24, fontWeight: 'bold', alignSelf: 'flex-start', marginLeft: 16, marginTop: 40, marginBottom: 16 }}>Объявления</Text>
      <HouseCard data={houses} navigation={navigation} itemWidth={width - 32} />





      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
        <Ionicons name="exit-outline" size={24} color="grey" />
      </Pressable>

      {/* <View style={styles.buttonsRow}>
        <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
        <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
        <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
      </View> */}


      <View style={styles.buttonsRow}>
        <Button title="Logout" onPress={logout} />
        <Button title="404" onPress={() => navigation.navigate('Error', { errorCode: 404 })} />
        <Button title="403" onPress={() => navigation.navigate('Error', { errorCode: 403 })} />
        <Button title="500" onPress={() => navigation.navigate('Error', { errorCode: 500 })} />
        <Button title="503" onPress={() => navigation.navigate('Error', { errorCode: 2004 })} />
      </View>
    </ScrollView>
  );
};

export default ProfileEmployeePageView;

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
    paddingTop: 11,
    paddingBottom: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 11,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    color: '#14080E',
    marginLeft: 11,
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
    marginTop: 8
  },
});
