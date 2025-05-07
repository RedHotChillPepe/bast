import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import TeamPage from './Teams/TeamPage';
import { UserCardIcon } from '../assets/svg/UserCard';

const { width } = Dimensions.get('window');

const ProfileRealtorPage = () => {
  const { logout, changePassword } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { getUser, getCurrentUser } = useApi()

  const [userr, setUser] = useState([])

  const [showTeamModal, setShowTeamModal] = useState(false)

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
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Текущие проекты', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Документы', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Компания', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Команда', handlePress: () => setShowTeamModal(true) },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Контрагенты', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Клиенты', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Сделки', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        // TODO: объявления компании, сейчас страница пользователя выводит только для пользователя
        { icon: <FontAwesome6 name="list-alt" size={17} color="black" />, label: 'Мои объявления', navigation: ['UserPostsPage', { user_id: userr.id, status: 1 }] },
        { icon: <Ionicons name="lock-closed-outline" size={20} color="black" />, label: 'Закрытые объявления', navigation: ['UserPostsPage', { user_id: userr.id, status: 3 }] },
        { icon: <Ionicons name="trash-bin-outline" size={20} color="black" />, label: 'Корзина объявлений', navigation: ['UserPostsPage', { user_id: userr.id, status: -1 }] },
        { icon: <AntDesign name="hearto" size={17} color="black" />, label: 'Избранное', navigation: ['Favourites'] },
        { icon: <Ionicons name="search" size={17} color="black" />, label: 'Поиски', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="man-outline" size={17} color="black" />, label: 'Риэлторы', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={17} color="black" />, label: 'Уведомления', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="chatbox-outline" size={17} color="black" />, label: 'Чат с поддержкой', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="calculator-outline" size={17} color="black" />, label: 'Ипотечный калькулятор', navigation: 'MortgageCalculator' },
        { icon: <Ionicons name="help-buoy-outline" size={17} color="black" />, label: 'Справочный центр', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="help-circle-outline" size={17} color="black" />, label: 'О приложении', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Настройки',
      data: [
        { icon: <Ionicons name="settings-outline" size={17} color="black" />, label: 'Настройки', navigation: 'SettingsPage' },
      ],
    },
  ];

  const renderItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.listItem}
      onPress={() => {
        if (!item.navigation) {
          item.handlePress()
        }
        else if (Array.isArray(item.navigation)) {
          navigation.navigate(item.navigation[0], item.navigation[1]);
        } else {
          navigation.navigate(item.navigation);
        }
      }}
    >
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#9DC0F6' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.nameBlock}>
          <View style={{ height: 17, width: 28 }} />
          {
            Object.keys(userr).length != 0 && userr.photo != undefined
              ?
              <Image style={{ overflow: 'hidden', borderRadius: 150 / 2 }} width={100} height={100} source={{ uri: userr.photo }} />
              :
              <FontAwesome6 name="face-tired" size={100} color="#fff" />
          }

          <TouchableOpacity onPress={() => navigation.navigate('ChangeAvatarPage', { userObject: userr, usertype: 3 })}>
            <FontAwesome name="edit" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ marginLeft: 16, width: width - 32, alignItems: 'center' }}>
          <Text style={styles.name}>{userr.name != undefined && userr.surname != undefined ? userr.name + " " + userr.surname : "Name Surname"}</Text>
          <Text style={styles.email}>{userr.email != undefined ? userr.email : "mail@example.com"}</Text>
        </View>

        <View style={{ flexDirection: 'row', width: width - 32, justifyContent: 'space-between' }}>
          <View style={[styles.itemBlock, { width: (width - 16 * 3) / 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[styles.itemText, { marginLeft: 0, }]}>
              Уведомления
            </Text>
            <View style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 18 + 8, width: 18 + 8, borderRadius: 13 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>9</Text>
            </View>
          </View>

          <View style={[styles.itemBlock, { width: (width - 16 * 3) / 2, flexDirection: 'row', justifyContent: 'space-between' }]}>
            <Text style={[styles.itemText, { marginLeft: 0, }]}>
              Акции
            </Text>
            <View style={{ backgroundColor: 'red', alignItems: 'center', justifyContent: 'center', height: 18 + 8, width: 18 + 8, borderRadius: 13 }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>9</Text>
            </View>
          </View>
        </View>

        <View style={[styles.itemBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
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

        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changePassword(navigation, userr.phone)}
          style={styles.logoutButton}
        >
          <Text style={[styles.itemText, styles.logoutText]}>Сменить пароль</Text>
          <UserCardIcon />
        </TouchableOpacity>
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
        <Button title="404" onPress={() => navigation.navigate('Error404')} />
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
