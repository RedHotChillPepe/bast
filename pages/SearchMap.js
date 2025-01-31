import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import  { YaMap, Marker } from 'react-native-yamap';

export default function DynamicHousePostPage ({ navigation, route }) {
    return (
        <SafeAreaView>
               <YaMap  style={{ flex: 1}}
                    initialRegion={{
                        lat: 50,
                        lon: 50,
                        zoom: 10,
                        azimuth: 80,
                        tilt: 100
                      }}
               >
                 {/* Добавление круга на карту */}
                 <Marker point={{ lat: 50, lon: 50 }} source={require('../assets/marker.png')} />
               </YaMap> 
        </SafeAreaView>
        )
}