import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function HeaderComponent() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // Получаем отступы безопасной зоны

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
      <Ionicons name="menu" size={32} color="black" />
        <Text style={styles.headerText}>БАСТ</Text>
        {/* <Pressable
          style={styles.headerButton}
          onPress={() => navigation.navigate('CreateHousePostPage')}
        >
          <Text style={styles.headerButtonText}>Создать{'\n'}объявление</Text>
        </Pressable> */}
        <Ionicons name="add-circle-outline" size={32} color="black" onPress={() => navigation.navigate('CreateHousePostPage')}/>
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
