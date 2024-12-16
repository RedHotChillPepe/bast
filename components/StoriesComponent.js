import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';



const { width } = Dimensions.get('window');

const StoriesComponent = () => {
  const navigation = useNavigation();
  
  // Переносим данные в сам компонент
  const ImageCarouselContent = [
    {
      imageSource: "https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
      text: "House1 самый лучший"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/styles/54-original.jpg",
      text: "House2 супер элегантный"
    },
    {
      imageSource: "https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
      text: "House3 покажет ваш характер"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/plans/25535/elevations/57911-768.jpg",
      text: "House1 самый лучший"
    },
    {
      imageSource: "https://www.houseplans.net/uploads/styles/54-original.jpg",
      text: "House2 супер элегантный"
    },
    {
      imageSource: "https://www.houseplans.net/news/wp-content/uploads/2023/07/57260-768.jpeg",
      text: "House3 покажет ваш характер"
    }
  ];

  return (
    <FlatList
      data={ImageCarouselContent}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('DynamicStoriesPage')} style={styles.storyItem}>
          <Text style={styles.storyItemText}>{item.text}</Text>
        </Pressable>
      )}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  storyItem: {
    height: 80,
    width: 80,
    borderRadius: 48,
    backgroundColor: "#d6d6d6",
    alignItems:'center',
    justifyContent:'center',
    marginLeft: 8,
    marginRight: 8,
    padding: 8
  },
  storyItemText: {
    color: '#14080E',
    fontSize: 12,
    textAlign:'center'
  },
});

export default StoriesComponent;
