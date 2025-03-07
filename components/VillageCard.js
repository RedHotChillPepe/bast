import React from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const VillageCard = ({ village }) => {
  return (
    <View style={styles.housesView}>
      
            <View style={styles.houseItem}>
              <View style={styles.houseImageView}>
                <Image
                  style={styles.houseImage}
                  width={100}
                  height={100}
                  source={{ uri: village.photos[0] }}
                />
              </View>
              <View>
                <Text style={styles.houseName}>{village.name}</Text>
                <Text style={styles.housePrice}>от 1 200 000 ₽</Text>
                <Text style={styles.houseLocation}>
                  г. Ижевск, Октябрьский район
                </Text>
              </View>
            </View>
          
    </View>
  );
};

const styles = StyleSheet.create({
  housesView: {
    marginTop: 8,
  },
  houseItem: {
    width: width-32,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    marginLeft: 16,
    marginTop: 12,
  },
  houseImageView: {
    height: 180,

  },
  houseImage: {
    flex: 1,
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  houseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 8,
  },
  housePrice: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  houseLocation: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2,
    marginBottom: 12,
    color: '#7A7A7A',
  },
});

export default VillageCard;
