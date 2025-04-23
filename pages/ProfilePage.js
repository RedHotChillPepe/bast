import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import ProfileCompanyPage from './ProfileCompanyPage.js';
import ProfileRealtorPage from './ProfileEmployeePage.js';
import Loader from '../components/Loader';

const { width } = Dimensions.get('window');

const ProfilePage = ({ route }) => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();
  const { getUser, getCurrentUser } = useApi()
  const insets = useSafeAreaInsets();

  const [usertype, setUsertype] = useState()

  const [user, setUser] = useState([])

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return navigation.navigate("Error", { messageProp: "Ошибка! Не удалось загрузить профиль" })
      setUser(currentUser);
      setUsertype(currentUser.usertype)
    }
    init()
  }, [usertype, getAuth, getUser])

  useEffect(() => {
    if (route.params?.updatedUser) {
      setUser((prevUser) => ({
        ...prevUser,
        ...route.params.updatedUser,
        photo: route.params.updatedUser.photo !== null ? route.params.updatedUser.photo : prevUser.photo,
      }));
    }
  }, [route.params?.updatedUser]);


  // Массив данных для списков
  const sections = [
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={17} color="black" />, label: 'Документы', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        { icon: <AntDesign name="hearto" size={20} color="black" />, label: 'Избранное', navigation: ['Favourites'] },
        { icon: <Ionicons name="search" size={20} color="black" />, label: 'Поиски', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <FontAwesome6 name="list-alt" size={20} color="black" />, label: 'Мои объявления', navigation: ['UserPostsPage', { user_id: user.id, status: 1 }] },
        { icon: <Ionicons name="lock-closed-outline" size={20} color="black" />, label: 'Закрытые объявления', navigation: ['UserPostsPage', { user_id: user.id, status: 3 }] },
        { icon: <Ionicons name="trash-bin-outline" size={20} color="black" />, label: 'Корзина объявлений', navigation: ['UserPostsPage', { user_id: user.id, status: -1 }] },
        { icon: <Ionicons name="alert-circle-outline" size={20} color="black" />, label: 'Объявления на модерации', navigation: ['UserPostsPage', { user_id: user.id, status: 0 }] },
        { icon: <Ionicons name="man-outline" size={20} color="black" />, label: 'Риелторы', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="notifications-outline" size={20} color="black" />, label: 'Уведомления', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="chatbox-outline" size={20} color="black" />, label: 'Чат с поддержкой', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="calculator-outline" size={20} color="black" />, label: 'Ипотечный калькулятор', navigation: ['MortgageCalculator'] },
        { icon: <Ionicons name="help-buoy-outline" size={20} color="black" />, label: 'Справочный центр', navigation: ['Error', { errorCode: 2004 }] },
        { icon: <Ionicons name="help-circle-outline" size={20} color="black" />, label: 'О приложении', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },

    {
      title: 'Дополнительные',
      data: [
        { icon: <Ionicons name="settings-outline" size={20} color="black" />, label: 'Настройки', navigation: ['SettingsPage', { userObject: user, usertype }] },
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

  if (!usertype) {
    return <Loader />
  }

  switch (usertype) {
    case 2:
      return <ProfileCompanyPage user={user} />;
    case 3:
      return <ProfileRealtorPage user={user} />;
    case 1:
      return (
        <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#9DC0F6' }}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.nameBlock}>
              <View style={{ flexDirection: 'row', width: width - 32, justifyContent: 'space-between' }}>
                <View style={{ height: 17, width: 16 }} />

                {
                  Object.keys(user).length != 0 && user.photo != undefined
                    ?
                    <Image style={{ overflow: 'hidden', borderRadius: 150 / 2, alignSelf: 'center' }} width={100} height={100} source={{ uri: user.photo }} />
                    :
                    <FontAwesome6 name="face-tired" size={56} color="black" />
                }

                <Pressable onPress={() => navigation.navigate('ChangeAvatarPage', { userObject: user, usertype })}>
                  <FontAwesome name="edit" size={24} color="#fff" />
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row' }}>

                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.name}>{user.name != undefined && user.surname != undefined ? `${user.name} ${user.surname}` : "Name Surname"}</Text>
                  <Text style={styles.email}>{user.email ?? "mail@example.com"}</Text>
                  <Text style={styles.email}>
                    {user.phone != undefined ? user.phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($2) $3-$4-$5') : "+ 7 (xxx) xxx xx xx"}
                  </Text>
                </View>
              </View>

            </View>



            {sections.map((section, index) => (
              <View style={styles.itemBlock} key={index}>
                {section.data.map((item, idx) => renderItem(item, idx, section.data))}
              </View>
            ))
            }

            <Pressable onPress={logout} style={styles.logoutButton}>
              <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
              <Ionicons name="exit-outline" size={24} color="#fff" />
            </Pressable>

            <Pressable onPress={() => { navigation.navigate("ProfileCompanyPageView", { CompanyId: 1 }) }} style={styles.logoutButton}>
              <Text style={[styles.itemText, styles.logoutText]}>Профиль компании</Text>
              <Ionicons name="exit-outline" size={24} color="#fff" />
            </Pressable>
            <View style={{ height: 128 }} />
          </ScrollView>
        </View>
      );
  }
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#9DC0F6',
    paddingBottom: 64
  },
  nameBlock: {
    width: width - 32,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#fff',
    paddingBottom: 11,
    paddingTop: 11,
    paddingHorizontal: 16,
    borderRadius: 20,
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
    fontSize: 15,
    letterSpacing: -0.43,
    lineHeight: 18,
    color: '#fff',
    opacity: 0.6
  },
});
