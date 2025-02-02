import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

const { width } = Dimensions.get('window');

export default function SearchHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // Получаем отступы безопасной зоны

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
      <Icon name="menu" size={32} color="black" />
      <Text style={styles.headerText}>J,zdktybt</Text>
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: width,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14080E',
  },
  headerButton: {
    backgroundColor: '#73AB84',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    color: '#EFEFEF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 18, // Улучшает перенос строки
  },
});
