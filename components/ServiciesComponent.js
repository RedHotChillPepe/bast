import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import ServicesPage from '../pages/Services/ServicesPage';

const { width } = Dimensions.get('window');

const ServicesComponent = () => {
  const navigation = useNavigation();

  const { theme } = useTheme();
  const styles = makeStyle(theme);

  const [selectedItem, setSelectedItem] = useState();
  const [isShowModal, setIsShowModal] = useState(false);

  const handleSelected = (item) => {
    if (item.navigation) {
      navigation.navigate(item.navigation[0], item.navigation[1]);
    }

    setSelectedItem(item);
    setIsShowModal(true);
  }

  // Массив данных для сервисов
  const ServicesContent = [
    {
      buttonTitle: "Все сервисы",
      navigation: ['Error', { errorCode: 2004 }]
    },
    // {
    //   title: 'Страхование жилья',
    //   serviceId: "housingInsurance",
    //   subTitle: "Страхование жилья",
    //   subText: `Поможем Вам застраховать ваше недвижимое имущество. Наш менеджер сам свяжется с вами.`,
    // },
    // {
    //   title: 'Сопровождение сделки',
    //   serviceId: "transactionSupport",
    //   subTitle: "Сопровождение ипотеки",
    //   subText: 'Поможем Вам получить одобрение ипотеки.',
    // },
    {
      buttonTitle: "Продать дом",
      title: 'Продажа недвижимости',
      serviceId: 4,
      subTitle: "Продажа недвижимости",
      subText: `Поможем Вам продать ваше недвижимое имущество. Наш менеджер сам свяжется с вами.`,
    },
    {
      buttonTitle: "Оценка",
      title: 'Оценка недвижимости',
      serviceId: 3,
      subTitle: "Оценка недвижимости",
      subText: 'Поможем Вам застраховать ваше недвижимое имущество. Наш менеджер сам свяжется с вами.',
    },
    {
      buttonTitle: "Ипотечный калькулятор",
      navigation: ['MortgageCalculator']
    },
  ];

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.functionCards}
    >
      {ServicesContent.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleSelected(item)}
          style={styles.functionCard}
          key={index}
        >
          <View style={styles.functionCardView}>
            <Text style={styles.functionCardText}>{item.buttonTitle.split(' ').join('\n')}</Text>
          </View>
        </TouchableOpacity>
      ))
      }
      <Modal visible={isShowModal} animationType='slide'><ServicesPage handleClose={() => setIsShowModal(false)} selectedItem={selectedItem} /></Modal>
    </ScrollView >
  );
};

const makeStyle = (theme) => StyleSheet.create({
  functionCards: {
    // paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.medium,
    gap: theme.spacing.small,
  },
  functionCard: {
    borderRadius: 12,
    backgroundColor: theme.colors.block,
    padding: 12,
    minWidth: 120, // Фиксированная минимальная ширина
    height: 60, // Фиксированная высота для единообразия
  },
  functionCardView: {
    // height: '100%',
  },
  functionCardText: {
    ...theme.typography.regular(),
    textAlign: "left",
  },
});

export default ServicesComponent;
