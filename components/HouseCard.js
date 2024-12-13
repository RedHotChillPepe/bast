import React from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HouseCard = ({ data, navigation, itemWidth, onEndReached }) => {
  const renderHouseItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("House", { houseId: item.id })}>
      <View style={[styles.houseItem, {width: itemWidth}]}>
        <View style={styles.houseImageView}>
          <Image style={styles.houseImage} width={100} height={100} source={{ uri: item.photos[0] }} />
        </View>
        <View>
          <View style={styles.priceRow}>
            <Text style={styles.houseItemText}>
              {item.price != null & item.price != undefined && item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽
            </Text>
            <Text style={styles.pricePerSquare}>{Math.floor(item.price / item.house_area)}₽/м²</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>{item.bedrooms}-комн.</Text>
            <Text style={styles.detailsText}>{item.house_area} м²</Text>
            <Text style={styles.detailsText}>{item.num_floors} этаж</Text>
          </View>
          <Text style={styles.addressText}>{item.city}, {item.full_address}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <FlatList
      data={data}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderHouseItem}
      keyExtractor={(item) => item.id != null & item.id != undefined ? item.id.toString() : "lmao"}
      onEndReached={onEndReached}
    />
  );
};

const styles = StyleSheet.create({
  houseItem: {
    borderRadius: 24,
    backgroundColor: '#FFF',
    marginLeft: 8,
    marginBottom: 12
  },
  houseImageView: {
    height: 280,
  },
  houseImage: {
    flex: 1,
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  houseItemText: {
    color: '#32322C',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    marginTop: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pricePerSquare: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '200',
  },
  detailsRow: {
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 2,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '200',
    marginTop: 2,
    marginBottom: 12,
  },
});

export default HouseCard;
