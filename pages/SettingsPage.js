import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '../components/CustomModal';


const { width } = Dimensions.get('window');

const SettingsPage = ({ navigation, route }) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const { userObject, usertype } = route.params

  const userObjectt = {
    id: userObject.id,
    usertype: usertype,
    phoneNumber: userObject.phone,
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Регион поиска</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Уведомления</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Оформление</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable onPress={() => setIsModalVisible(true)} style={styles.itemBlockDelete}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemTextDelete}>Удалить профиль</Text>
          <Ionicons name="trash" size={24} color="white" />
        </View>
      </Pressable>

      <CustomModal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
        <View style={{ gap: 5, marginBottom: 32 }}>
          <Text>
            Вы пытаетесь удалить профиль. Вы точно это хотите сделать? За этим последует:
          </Text>
          <Text>Удаление Профиля</Text>
          <Text>Удаление Профиля</Text>
          <Text>Удаление Профиля</Text>
          <Text>Удаление Профиля</Text>
          <Text>Удаление Профиля</Text>
          <Text>Удаление Профиля</Text>
          <Text>Смерть</Text>
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <Pressable onPress={() => setIsModalVisible(false)} style={styles.buttonSuccess}>
            <Text>
              Нет
            </Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("ConfirmDeletion", {
            regData: {
              userObjectt
            }
          })} style={styles.buttonDanger}>
            <Text>
              Да
            </Text>
          </Pressable>
        </View>





      </CustomModal>

    </SafeAreaView>
  )
}

export default SettingsPage

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
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  itemBlockDelete: {
    width: width - 32,
    backgroundColor: '#d9534f',
    paddingTop: 16,
    paddingBottom: 16,
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
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 20,
    color: '#14080E'
  },
  itemTextDelete: {
    fontSize: 20,
    color: 'white'
  },
  buttonDanger: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#d9534f',
    width: 80,
    justifyContent: 'center',
    borderRadius: 5
  },
  buttonSuccess: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#5cb85c',
    width: 80,
    justifyContent: 'center',
    borderRadius: 5
  }

})