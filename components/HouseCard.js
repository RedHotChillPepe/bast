import React from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HouseCard = ({ item, navigation, itemWidth }) => {
  if (!item) return null;

  return (
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
};

const styles = StyleSheet.create({
  houseItem: {
    borderRadius: 24,
    backgroundColor: '#FFF',
    marginTop: 16,
    alignSelf: 'center',
    borderColor: '#54545630',
    borderWidth: 1,
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
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '600',
    marginTop: 16,
    marginLeft: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  pricePerSquare: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    opacity: 0.6,
    marginLeft: 12,
    fontWeight: '400',
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 12,
  },
  detailsText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.45,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.23,
    opacity: 0.6,
    marginLeft: 12,
    fontWeight: '400',
    marginTop: 12,
    marginBottom: 12,
  },
});

export default HouseCard;
