import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useApi } from '../context/ApiContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ProfileRealtorPage = () => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();

  const {getUser} =useApi()
  
    const [userr, setUser]=useState([])
  
    useEffect(() => {
      const init = async () => {
        const auth = JSON.parse(await getAuth())
        const user = await getUser(await auth[0].phone, "realtor")
        /* console.log(await user.text()); */
        
        const userJson = JSON.parse(await user.text())
        console.log(await userJson[1]); 
        if (userJson.result != false) {
          setUser(await userJson[1])
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
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Текущие проекты' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Документы' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Компания' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Комнада' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Контрагенты' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Клиенты' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Сделки' },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        { icon: <FontAwesome6 name="list-alt" size={17} color="black" />, label: 'Мои объявления' },
        { icon: <AntDesign name="hearto" size={17} color="black" />, label: 'Избранное' },
        { icon: <Ionicons name="search" size={17} color="black" />, label: 'Поиски' },
        { icon: <Ionicons name="man-outline" size={17} color="black" />, label: 'Риэлторы' },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={17} color="black" />, label: 'Уведомления' },
        { icon: <Ionicons name="chatbox-outline" size={17} color="black" />, label: 'Чат с поддержкой' },
        { icon: <Ionicons name="calculator-outline" size={17} color="black" />, label: 'Ипотечный калькулятор' },
        { icon: <Ionicons name="help-buoy-outline" size={17} color="black" />, label: 'Справочный центр' },
        { icon: <Ionicons name="help-circle-outline" size={17} color="black" />, label: 'О приложении' },
      ],
    },
  ];

  const renderItem = ( item, index ) => (
    <Pressable key={index} style={styles.listItem}>
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </Pressable>
  );

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.nameBlock}>
        <View style={{ flexDirection: 'row' }}>
          {
            Object.keys(userr).length != 0 && userr.photo != undefined
            ?
            <Image style={{overflow:'hidden',  borderRadius: 150 / 2}} width={56} height={56} source={{uri:userr.photo}}/>
            :
            <FontAwesome6 name="face-tired" size={56} color="black" />
          }
          <View style={{ marginLeft: 16, width:'60%' }}>
            <Text style={styles.name}>{userr.name != undefined && userr.surname != undefined ? userr.name + " " + userr.surname : "Name Surname"}</Text>
            <Text style={styles.email}>{userr.email != undefined ? userr.email : "mail@example.com"}</Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={32} color="black" />
      </View>

    <View style={{flexDirection:'row', width:width-32, justifyContent:'space-between'}}>   
      <View style={[styles.itemBlock, {width: (width-16*3)/2, flexDirection:'row', justifyContent:'space-between'}]}>
        <Text style={[styles.itemText, {marginLeft: 0, }]}>
         Уведомления
        </Text>
        <View style={{backgroundColor: 'red', alignItems:'center', justifyContent:'center', height: 18+8, width: 18+8, borderRadius: 13}}>
         <Text style={{color:'#fff', fontSize: 18, fontWeight:'bold'}}>9</Text>
        </View>
      </View>

      <View style={[styles.itemBlock, {width: (width-16*3)/2, flexDirection:'row', justifyContent:'space-between'}]}>
        <Text style={[styles.itemText, {marginLeft: 0, }]}>
         Акции
        </Text>
        <View style={{backgroundColor: 'red', alignItems:'center', justifyContent:'center', height: 18+8, width: 18+8, borderRadius: 13}}>
         <Text style={{color:'#fff', fontSize: 18, fontWeight:'bold'}}>9</Text>
        </View>
      </View>
    </View>

    <View style={[styles.itemBlock, {flexDirection: 'row'}]}>
      <Text style={styles.itemText}>
        Баланс
      </Text>
      <Text style={styles.itemText}>
        9222 руб
      </Text>
    </View>

      {sections.map((section, index) => (
        <View style={styles.itemBlock} key={index}>
          {/* <FlatList
            data={section.data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => idx.toString()}
          /> */}

          {
            section.data.map((item, index) => 
              renderItem(item, index)
            )
          }

        </View>
      ))}

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
        <Button title="Риэлтор внеш" onPress={() => navigation.navigate('ProfileEmployeePageView')} />
      </View>
      
      {/* <View style={styles.buttonsRow}>
        <Button title="Logout" onPress={logout} />
        <Button title="404" onPress={() => navigation.navigate('Error404')} />
        <Button title="403" onPress={() => navigation.navigate('Error403')} />
        <Button title="500" onPress={() => navigation.navigate('Error500')} />
        <Button title="503" onPress={() => navigation.navigate('Error503')} />
      </View>  */}
    </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileRealtorPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
    backgroundColor: '#fff',
    paddingTop: 11,
    paddingBottom: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 20,
    borderColor: '#54545630',
    borderWidth: 1,
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
    marginTop: 8
  },
});
