import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useApi } from '../context/ApiContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const ProfileRealtorPage = () => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

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
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Текущие проекты', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Документы', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Компания', navigation:'NotExistPage' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Комнада', navigation:'NotExistPage' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Контрагенты', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Клиенты', navigation:'NotExistPage' },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Сделки', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        { icon: <FontAwesome6 name="list-alt" size={17} color="black" />, label: 'Мои объявления', navigation:'UserPostsPage' },
        { icon: <Ionicons name="lock-closed-outline" size={20} color="black" />, label: 'Закрытые объявления', navigation:['UserPostsClosed'] },
        { icon: <Ionicons name="trash-bin-outline" size={20} color="black" />, label: 'Корзина объявлений', navigation:['UserRecycleBin'] },
        { icon: <AntDesign name="hearto" size={17} color="black" />, label: 'Избранное', navigation:'NotExistPage' },
        { icon: <Ionicons name="search" size={17} color="black" />, label: 'Поиски', navigation:'NotExistPage' },
        { icon: <Ionicons name="man-outline" size={17} color="black" />, label: 'Риэлторы', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={17} color="black" />, label: 'Уведомления', navigation:'NotExistPage' },
        { icon: <Ionicons name="chatbox-outline" size={17} color="black" />, label: 'Чат с поддержкой', navigation:'NotExistPage' },
        { icon: <Ionicons name="calculator-outline" size={17} color="black" />, label: 'Ипотечный калькулятор', navigation:'MortgageCalculator' },
        { icon: <Ionicons name="help-buoy-outline" size={17} color="black" />, label: 'Справочный центр', navigation:'NotExistPage' },
        { icon: <Ionicons name="help-circle-outline" size={17} color="black" />, label: 'О приложении', navigation:'NotExistPage' },
      ],
    },
    {
      title: 'Настройки',
      data: [
        { icon: <Ionicons name="settings-outline" size={17} color="black" />, label: 'Настройки', navigation:'SettingsPage' },
      ],
    },
  ];

  const renderItem = ( item, index ) => (
    <Pressable key={index} style={styles.listItem}
      onPress={() => navigation.navigate(item.navigation)}>
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </Pressable>
  );

  return (
    <View style={{flex: 1, paddingTop: insets.top, backgroundColor: '#9DC0F6' }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.nameBlock}>
        <View style={{height: 17, width: 28}} />
          {
            Object.keys(userr).length != 0 && userr.photo != undefined
            ?
            <Image style={{overflow:'hidden',  borderRadius: 150 / 2}} width={100} height={100} source={{uri:userr.photo}}/>
            :
            <FontAwesome6 name="face-tired" size={100} color="#fff" />
          }

      <Pressable onPress={() => navigation.navigate('ChangeAvatarPage')}> 
        <FontAwesome name="edit" size={28} color="#fff" />
      </Pressable>   
      </View>

      <View style={{ marginLeft: 16, width:width-32, alignItems: 'center'}}>
            <Text style={styles.name}>{userr.name != undefined && userr.surname != undefined ? userr.name + " " + userr.surname : "Name Surname"}</Text>
            <Text style={styles.email}>{userr.email != undefined ? userr.email : "mail@example.com"}</Text>
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

    <View style={[styles.itemBlock, {flexDirection: 'row', justifyContent:'space-between'}]}>
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
        <Ionicons name="exit-outline" size={24} color="#fff" />
      </Pressable>

    {/* <View style={styles.buttonsRow}>
        <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
        <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
        <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
      </View> */}


      {/* <View style={styles.buttonsRow}>
        <Button title="Риэлтор внеш" onPress={() => navigation.navigate('ProfileEmployeePageView')} />
      </View> */}
      
      {/* <View style={styles.buttonsRow}>
        <Button title="Logout" onPress={logout} />
        <Button title="404" onPress={() => navigation.navigate('Error404')} />
        <Button title="403" onPress={() => navigation.navigate('Error403')} />
        <Button title="500" onPress={() => navigation.navigate('Error500')} />
        <Button title="503" onPress={() => navigation.navigate('Error503')} />
      </View>  */}
    </ScrollView>
    </View>
  );
};

export default ProfileRealtorPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#9DC0F6',
    paddingBottom: 64
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
    paddingTop: 11,
    paddingBottom: 11,
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
    color: '#fff',
    fontWeight: '500',
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.6
  },
});
