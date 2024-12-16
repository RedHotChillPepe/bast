import React from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const ProfileCompanyPage = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  // Массив данных для списков
  const sections = [
    {
      title: 'Основные',
      data: [
        { icon: <Ionicons name="document-outline" size={20} color="black" />, label: 'Документы' },
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

  const renderItem = ({ item }) => (
    <Pressable style={styles.listItem}>
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
          <FontAwesome6 name="face-tired" size={56} color="black" />
          <View style={{ marginLeft: 16, width: width -32 }}>
            <Text style={styles.name}>Пеликан</Text>
            <Text style={styles.email}>Проверенная компания</Text>
          </View>
        </View>
        <Ionicons name="settings-outline" size={32} color="black" />
      </View>

      {sections.map((section, index) => (
        <View style={styles.itemBlock} key={index}>
          <FlatList
            data={section.data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => idx.toString()}
          />
        </View>
      ))}

      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
        <Ionicons name="exit-outline" size={24} color="grey" />
      </Pressable>

      <View style={styles.buttonsRow}>
        <Button title="Пользователь" onPress={() => navigation.navigate('ProfilePage')} />
        <Button title="Сотрудник" onPress={() => navigation.navigate('ProfileEmployeePage')} />
        <Button title="Компания" onPress={() => navigation.navigate('ProfileCompanyPage')} />
      </View>
      <View style={styles.buttonsRow}>
        <Button title="Logout" onPress={logout} />
        <Button title="404" onPress={() => navigation.navigate('Error404')} />
        <Button title="403" onPress={() => navigation.navigate('Error403')} />
        <Button title="500" onPress={() => navigation.navigate('Error500')} />
        <Button title="503" onPress={() => navigation.navigate('Error503')} />
      </View>
    </ScrollView>
  );
};

export default ProfileCompanyPage;

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
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
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
