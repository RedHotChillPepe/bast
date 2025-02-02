import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native-elements';



const { width } = Dimensions.get('window');

const StoriesComponent = () => {
  const navigation = useNavigation();
  
  // Переносим данные в сам компонент
  const ImageCarouselContent = [
    {
      imageSource: "https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
      text: "Урок 1"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/styles/54-original.jpg",
      text: "Урок 2"
    },
    {
      imageSource: "https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
      text: "Урок 3"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
      text: "Урок 4"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/styles/54-original.jpg",
      text: "Урок 5"
    },
    {
      imageSource: "https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
      text: "Урок 6"
    }
  ];

  return (
    <FlatList
      data={ImageCarouselContent}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('DynamicStoriesPage')} style={styles.storyItem}>
          <Text style={styles.caption1}>{item.text}</Text>
        </Pressable>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  storyItem: {
    height: 72,
    width: 72,
    borderRadius: 42,
    backgroundColor: "#d6d6d6",
    alignItems:'center',
    justifyContent:'center',
    marginLeft: 8,
    padding: 8
  },
  caption1: {
    color: '#14080E',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign:'center'
  },
});

export default StoriesComponent;
