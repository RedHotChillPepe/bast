import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Image, Modal, TouchableOpacity, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

import ChevronRight from "../assets/svg/ChevronRight";
import EditPencil from "../assets/svg/EditPencil";
import Folders from "../assets/svg/Folders";
import ListUnordered from "../assets/svg/ListUnordered";
import TeamMembers from "../assets/svg/TeamMembers";
import UserRequestPage from './Requests/UserRequestPage';
import UserTeamsPage from './Teams/UserTeamsPage';
import { UserCardIcon } from '../assets/svg/UserCard';

const { width } = Dimensions.get('window');

const ProfileRealtorPage = ({ user }) => {
  const { logout, changePassword } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showModalTeams, setShowModalTeams] = useState(false)
  const [showModalRequest, setShowModalRequest] = useState(false)

  // TODO: это фикс с модалками(не кликабельность после navigate)
  useFocusEffect(
    React.useCallback(() => {
      setShowModalTeams(false);
      setShowModalRequest(false);

      return () => {
        setShowModalTeams(false);
        setShowModalRequest(false);
      };
    }, [])
  );

  // Массив данных для списков
  const sections = [
    {
      title: 'Основные',
      data: [
        { icon: <ListUnordered />, label: 'Мои документы', navigation: ['Error', { errorCode: 2004 }] },
      ],
    },
    {
      title: 'Команда',
      data: [
        { icon: <TeamMembers />, label: 'Работа в команде', handlePress: () => setShowModalTeams(true) },
      ],
    },
    {
      title: 'Заявки',
      data: [
        { icon: <Folders />, label: 'Заявки', handlePress: () => setShowModalRequest(true) },
      ],
    },
    {
      title: 'Мои действия',
      data: [
        // TODO: объявления компании, сейчас страница пользователя выводит только для пользователя
        { icon: <ListUnordered />, label: 'Мои объявления', navigation: ['UserPostsPage', { user_id: user.id, status: 1 }] },
        { icon: <ListUnordered />, label: 'Избранное', navigation: ['Favourites'] },
        { icon: <ListUnordered />, label: 'Закрытые объявления', navigation: ['UserPostsPage', { user_id: user.id, status: 3 }] },
        { icon: <ListUnordered />, label: 'Корзина объявлений', navigation: ['UserPostsPage', { user_id: user.id, status: -1 }] },
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
      <ChevronRight />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#9DC0F6' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.nameBlock}>
          <View style={{ height: 17, width: 28 }} />
          {
            Object.keys(user).length != 0 && user.photo != undefined
              ?
              <Image style={{ overflow: 'hidden', borderRadius: 150 / 2 }} width={100} height={100} source={{ uri: user.photo }} />
              :
              <FontAwesome6 name="face-tired" size={100} color="#fff" />
          }

          <TouchableOpacity onPress={() => navigation.navigate('ChangeAvatarPage', { userObject: user, usertype: 3 })}>
            <EditPencil />
          </TouchableOpacity>
        </View>

        <View style={{ marginLeft: 16, width: width - 32, alignItems: 'center', marginBottom: 32 }}>
          <Text style={styles.name}>{user.name != undefined && user.surname != undefined ? `${user.name} ${user.surname}` : "Name Surname"}</Text>
          <View style={{ rowGap: 4, alignItems: "center" }}>
            <Text style={styles.email}>{user.email != undefined ? user.email : "mail@example.com"}</Text>
            <Text style={styles.email}>{user.phone != undefined ? user.phone.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($2) $3-$4-$5') : "+ 7 (xxx) xxx xx xx"}</Text>
          </View>
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
          <Ionicons name="exit-outline" size={24} color="#3E3E3E" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changePassword(navigation, user.phone)}
          style={styles.logoutButton}
        >
          <Text style={[styles.itemText, styles.logoutText]}>Сменить пароль</Text>
          <UserCardIcon />
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={showModalRequest}><UserRequestPage user={user} handleClose={() => setShowModalRequest(false)} /></Modal>
      <Modal visible={showModalTeams}><UserTeamsPage handleClose={() => setShowModalTeams(false)} currentUser={user} /></Modal>
    </View >
  );
};

export default ProfileRealtorPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    paddingBottom: 64,
    flex: 1,
  },
  nameBlock: {
    flexDirection: 'row',
    width: width - 32,
    marginTop: 17,
    marginBottom: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#F2F2F7',
    padding: 8,
    gap: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 17.6,
    letterSpacing: -0.42,
    fontFamily: "Sora400",
    color: '#3E3E3E',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 16,
    alignItems: "center",
  },
  logoutText: {
    color: '#3E3E3E',
    fontFamily: "Sora500",
    fontWeight: '500',
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 25.2,
    letterSpacing: -0.6,
    fontFamily: "Sora700",
    color: '#3E3E3E',
    marginBottom: 8,
  },
  email: {
    fontWeight: 400,
    lineHeight: 16,
    letterSpacing: -0.36,
    fontFamily: "Sora400",
    fontSize: 12,
    color: '#808080',
  },
});
