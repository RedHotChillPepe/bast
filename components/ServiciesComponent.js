import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const ServicesComponent = () => {
  const navigation = useNavigation();

  // Массив данных для сервисов
  const ServicesContent = [
    {
      text: 'Все сервисы',
      subtext: 'Наши юристы позаботятся о вашей безопасности',
      navigation: ['Error', { errorCode: 503 }]
    },
    {
      text: 'Продать дом',
      subtext: 'Наши юристы позаботятся о вашей безопасности',
      navigation: ['Error', { errorCode: 503 }]
    },
    {
      text: 'Оценка',
      subtext: 'Бесплатно узнайте рыночную стоимость',
      navigation: ['Error', { errorCode: 503 }]
    },
    {
      text: 'Ипотечный калькулятор',
      subtext: 'Подберите удобный ежемесячный платеж',
      navigation: ['MortgageCalculator']
    },
  ];

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.functionCards}>
      {ServicesContent.map((item, index) => (
        <Pressable
          onPress={() => navigation.navigate(item.navigation[0], item.navigation[1])}
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
    width: width,
    paddingHorizontal: 16,
    flexDirection: 'row', // Ряд
    alignItems: 'center', // Выравнивание по центру
    gap: 8,
  },
  functionCard: {
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    padding: 12,
  },
  functionCardView: {
    flex: 1,
  },
  functionCardText: {
    fontSize: 14,
    fontFamily: "Sora400",
    lineHeight: 17.7,
    letterSpacing: -0.43,
    fontWeight: '400',
    color: '#3E3E3E',
  },
});

export default ServicesComponent;
