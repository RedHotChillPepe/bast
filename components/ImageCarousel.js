import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const TARGET_RATIO = 16 / 9;

const ImageCarousel = ({ postData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const [fullScreenActiveIndex, setFullScreenActiveIndex] = useState(0);

  const flatListRef = useRef(null);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Callback для обычного режима
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // Callback для полноэкранного режима
  const onViewableItemsChangedFullScreen = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setFullScreenActiveIndex(viewableItems[0].index);
    }
  }).current;

  if (!postData || Object.keys(postData).length === 0) {
    return (
      <View
        style={[
          styles.carouselContainer,
          { justifyContent: 'center', alignItems: 'center', height: width * 0.6 },
        ]}
      >
        <ActivityIndicator size="large" color="#32322C" />
      </View>
    );
  }

  const openFullScreen = () => {
    setFullScreenActiveIndex(activeIndex);
    setFullScreen(true);
  };

  const closeFullScreen = () => {
    setFullScreen(false);
  };

  // Универсальная функция для отрисовки FlatList
  const renderCarousel = (containerStyle, onViewableItemsChangedCallback) => (
    <FlatList
      ref={flatListRef}
      data={postData.photos}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={0.9} onPress={openFullScreen}>
          <Image source={{ uri: item }} style={[styles.image, containerStyle]} />
        </TouchableOpacity>
      )}
      onViewableItemsChanged={onViewableItemsChangedCallback}
      viewabilityConfig={viewabilityConfig}
    />
  );

  return (
    <View style={styles.carouselContainer}>
      {/* Обычный режим */}
      {renderCarousel({ width: width, height: width / TARGET_RATIO }, onViewableItemsChanged)}

      {/* Пагинация (точки) в обычном режиме */}
      {postData.photos.length > 1 && (
        <View style={styles.paginationContainer}>
          <View style={styles.paginationBackground}>
            {postData.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === activeIndex ? '#FFFFFF' : 'transparent' },
                ]}
              />
            ))}
          </View>
        </View>
      )}

      {/* Полноэкранный режим */}
      <Modal visible={fullScreen} transparent={false} animationType="slide">
        <View style={styles.fullScreenContainer}>
          <View style={styles.fullScreenHeader}>
            <Text style={styles.fullScreenCounter}>
              {fullScreenActiveIndex + 1}/{postData.photos.length}
            </Text>
            <Pressable style={styles.fullScreenClose} onPress={closeFullScreen}>
              <AntDesign name="close" size={24} color="#3E3E3E" />
            </Pressable>
          </View>
          {renderCarousel({ width: width, height: height }, onViewableItemsChangedFullScreen)}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    width: width,
    aspectRatio: TARGET_RATIO,
    backgroundColor: '#F2F2F7',
  },
  image: {
    resizeMode: 'contain',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  paginationBackground: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 32,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  fullScreenCounter: {
    color: '#3E3E3E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullScreenClose: {
    padding: 10,
  },
});

export default ImageCarousel;
