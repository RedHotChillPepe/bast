import React from "react";
import { View, Text, Dimensions, SafeAreaView, Pressable } from "react-native";

const { width, height } = Dimensions.get('window');

const DynamicStoriesPage = () => {
 const margin = 16


    return (
        <SafeAreaView style={{ flex: 1, width: width- 2*margin, marginLeft: margin}}>

          {/* ЛОГО */}
          <Text style={{fontSize: 28, fontWeight:'bold'}}>
            БАСТ
          </Text>

         <View style={{marginTop: 56}}>
          {/* Заголовок */}
            <Text style={{fontSize: 40, fontWeight:'bold', marginBottom: 16}}>
              Заголовок
            </Text>
          
            <Text style={{fontSize: 20}}>
              Текст новости Текст новости Текст новости Текст новости Текст новости Текст новости Текст новости
            </Text>
          </View>
         <View>

         <View style={{marginTop: 60}}>
            <Text style={{fontSize: 24, fontWeight:'bold'}}>
              Пункт 1
            </Text>

            <Text style={{fontSize: 16, marginTop: 12}}>
              Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1
            </Text>
          </View>

          <View>
          <Text style={{fontSize: 24, fontWeight:'bold', marginTop: 32}}>
            Пункт 1
          </Text>

          <Text style={{fontSize: 16, marginTop: 12}}>
            Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1
          </Text>
          </View>

          <View>
          <Text style={{fontSize: 24, fontWeight:'bold', marginTop: 32}}>
            Пункт 1
          </Text>

          <Text style={{fontSize: 16, marginTop: 12}}>
            Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1
          </Text>
          </View>
          </View>

        <Pressable style={{backgroundColor:'grey', paddingHorizontal: 12, width: width*0.3, alignItems:'center', paddingVertical: 12, borderRadius: 12, marginBottom: 40, alignSelf: 'flex-end', marginTop: 56}}>
            <Text style={{fontSize: 18}}>Кнопка</Text>
        </Pressable>


        </SafeAreaView>


    )
}

export default DynamicStoriesPage