import React, { useRef, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const ImageCarousel = ({ postData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Конфигурация для определения, какой элемент виден на экране
  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Обработчик изменения видимых элементов
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // Если postData пустой — выводим индикатор загрузки
  if (Object.keys(postData).length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', height: width * 0.6 }]}>
        <ActivityIndicator size="large" color="#32322C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={postData.photos}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
          />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Индикаторы (точки) */}
      {postData.photos.length > 1 && (
        <View style={styles.pagination}>
          {postData.photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#32322C' : '#ccc' },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width
  },
  image: {
    width: width,          // Изображение занимает всю ширину экрана
    height: width * 0.56,    // Высота определяется от ширины экрана
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageCarousel;
