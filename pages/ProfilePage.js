import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useApi } from '../context/ApiContext';
import ProfileCompanyPage from './ProfileCompanyPage.js';
import ProfileRealtorPage from './ProfileEmployeePage.js';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');



const ProfilePage = () => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();
  const {getUser} =useApi()

  const [usertype, setUsertype] = useState(1) 

  const [userr, setUser]=useState([])

  useEffect(() => {
    const init = async () => {
      const auth = JSON.parse(await getAuth())
      const user = await getUser(await auth[0].phone, "user")
      /* console.log(await user.text()); */
      
      const userJson = JSON.parse(await user.text()) 
      if (userJson.result != false) {
        setUser(await userJson[1])
      }
      
      setUsertype(await auth[0].usertype)
      
    }
    init()
  
    return () => {
      
    }
  }, [usertype, getAuth, getUser])
  
  
  

  // Массив данных для списков
  const sections = [
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Документы', navigation:['Errors',{screen:"NotExistPage"}] },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        { icon: <FontAwesome6 name="list-alt" size={20} color="black" />, label: 'Мои объявления', navigation:['Errors',{screen:"NotExistPage"}] },
        { icon: <AntDesign name="hearto" size={20} color="black" />, label: 'Избранное', navigation:'Избранное' },
        { icon: <Ionicons name="search" size={20} color="black" />, label: 'Поиски', navigation:'Поиск' },
        { icon: <Ionicons name="man-outline" size={20} color="black" />, label: 'Риэлторы', navigation:['Errors',{screen:"NotExistPage"}] },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={20} color="black" />, label: 'Уведомления', navigation:['Errors',{screen:"NotExistPage"}] },
        { icon: <Ionicons name="chatbox-outline" size={20} color="black" />, label: 'Чат с поддержкой', navigation:['Errors',{screen:"NotExistPage"}] },
        { icon: <Ionicons name="calculator-outline" size={20} color="black" />, label: 'Ипотечный калькулятор', navigation:['MortgageCalculator'] },
        { icon: <Ionicons name="help-buoy-outline" size={20} color="black" />, label: 'Справочный центр', navigation:['Errors',{screen:"NotExistPage"}] },
        { icon: <Ionicons name="help-circle-outline" size={20} color="black" />, label: 'О приложении', navigation:['Errors',{screen:"NotExistPage"}] },
      ],
    },
  ];

  const renderItem = (item, index, sectionData) => (
    <Pressable
      onPress={() => navigation.navigate(item.navigation[0], item.navigation[1])}
      key={index}
      style={styles.listItem}>
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color="black" />
    </Pressable>
  );

  switch (usertype) {
    case 2:
      return <ProfileCompanyPage/>;
    case 3:
      return <ProfileRealtorPage/>;
    default:
      return (
        <SafeAreaView>
        <View style={styles.nameBlock}>        
        <View style={{ flexDirection: 'row' }}>
          {
            Object.keys(userr).length != 0 && userr.photo != undefined
            ?
            <Image style={{overflow:'hidden',  borderRadius: 150 / 2}} width={80} height={80} source={{uri:userr.photo}}/>
            :
            <FontAwesome6 name="face-tired" size={56} color="black" />
          }
          
          
          
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.name}>{userr.name != undefined && userr.surname != undefined ? userr.name + " " + userr.surname : "Name Surname"}</Text>
            <Text style={styles.email}>{userr.email != undefined ? userr.email : "mail@example.com"}</Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={32} color="black" onPress={() => navigation.navigate('SettingsPage')} />
      </View>
        <ScrollView contentContainerStyle={styles.container}>

    
          {sections.map((section, index) => (
              <View style={styles.itemBlock} key={index}>
                {section.data.map((item, idx) => renderItem(item, idx, section.data))}
              </View>
            ))
          }

    
          <Pressable onPress={logout} style={styles.logoutButton}>
            <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
            <Ionicons name="exit-outline" size={24} color="grey" />
          </Pressable>
    
{/*           <View style={styles.buttonsRow}>
            <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
            <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
            <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
          </View> */}

          {/* <View style={styles.buttonsRow}>
            <Button title="Пользователь внеш" onPress={() => navigation.navigate('ProfilePageView', { posterId: userr.id })} />
            
          </View> */}

          {/* <View style={styles.buttonsRow}>
            <Button title="Logout" onPress={logout} />
            <Button title="404" onPress={() => navigation.navigate('Error404')} />
            <Button title="403" onPress={() => navigation.navigate('Error403')} />
            <Button title="500" onPress={() => navigation.navigate('Error500')} />
            <Button title="503" onPress={() => navigation.navigate('Error503')} />
          </View> */}
          <View style={{height: 128}} />
        </ScrollView>
        </SafeAreaView>
      );
  }

  
};

export default ProfilePage;

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
    alignSelf: 'center',
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#fff',
    paddingBottom: 11,
    paddingTop: 11,
    paddingHorizontal: 16,
    borderRadius: 16,
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
    letterSpacing: -0.43,
    lineHeight: 22,
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
    fontSize: 28,
    letterSpacing: -0.43,
    lineHeight: 34,
    fontWeight: 'bold',
    color: '#14080E',
  },
  email: {
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 16,
    color: '#858585',
  },
  // withBorder: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#b0b0b0',
  //   paddingBottom: 12,
  // },
});
