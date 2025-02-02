import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ServicesComponent = () => {
  const navigation = useNavigation();

  // Массив данных для сервисов
  const ServicesContent = [
    {
      text: 'Все сервисы',
      subtext: 'Наши юристы позаботятся о вашей безопасности',
      navigation:'NotExistPage'
    },
    {
      text: 'Продать дом',
      subtext: 'Наши юристы позаботятся о вашей безопасности',
      navigation:'NotExistPage'
    },
    {
      text: 'Оценка',
      subtext: 'Бесплатно узнайте рыночную стоимость',
      navigation:'NotExistPage'
    },
    {
      text: 'Ипотечный калькулятор',
      subtext: 'Подберите удобный ежемесячный платеж',
      navigation:'MortgageCalculator'
    },
  ];

  return (
    <ScrollView 
      horizontal={true} 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.functionCards}>
      {ServicesContent.map((item, index) => (
        <Pressable
          onPress={() => navigation.navigate(item.navigation)}
          style={styles.functionCard}
          key={index}
        >
          <View style={styles.functionCardView}>
            <Text style={styles.functionCardText}>{item.text.split(' ').join('\n')}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  functionCards: {
    paddingLeft: 16,
    flexDirection: 'row', // Ряд
    alignItems: 'center', // Выравнивание по центру
  },
  functionCard: {
    borderRadius: 16,
    backgroundColor: '#d6d6d6',
    marginRight: 16, // Отступ между карточками
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 12,
  },
  functionCardView: {
    flex: 1,
  },
  functionCardText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    fontWeight:'400',
    color: '#14080E',
  },
});

export default ServicesComponent;
