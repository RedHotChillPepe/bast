import { StyleSheet, Text, View, Dimensions, Pressable } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';


const { width } = Dimensions.get('window');

const SettingsPage = () => {
  return (
    <View style={styles.container}>
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

        <Pressable style={styles.itemBlock}>
            <View style={styles.listItemContent}>
            <Text style={styles.itemText}>Settings Page</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
        </Pressable>
      
    </View>
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


})