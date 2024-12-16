import React from "react";
import { View, Text, Dimensions, SafeAreaView, Pressable } from "react-native";

const { width, height } = Dimensions.get('window');

const DynamicStoriesPage = () => {



    return (
        <SafeAreaView>

          {/* ЛОГО */}
          <Text style={{fontSize: 40, fontWeight:'bold'}}>
            БАСТ
          </Text>


          {/* Заголовок */}
          <Text style={{fontSize: 32, fontWeight:'bold'}}>
            Заголовок
          </Text>
          
          <Text>
          Текст новости
          </Text>

          <Text>
            Пункт 1
          </Text>

          <Text>
            Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1 Текст пункта 1
          </Text>

          <Pressable>
            <Text>Кнопка</Text>
        </Pressable>
        </SafeAreaView>


    )
}

export default DynamicStoriesPage