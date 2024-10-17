import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HeaderComponent() {
  return (
    <SafeAreaView style={styles.headerStyle}>
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>БАСТ</Text>
        <Pressable style={styles.headerButton}>
          <Text style={styles.headerButtonText}>
            Создать объявление
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  headerStyle:{
    height:80,
    paddingVertical:20,
    backgroundColor:"#F5F5F5"
  },
  headerText:{
    fontSize:40,
    fontFamily:"Inter700",
    //fontWeight:"700",
    color:"rgba(50, 50, 44, 0.8)"
  },
  headerContent:{
    marginHorizontal:9,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  headerButton:{
    backgroundColor:"rgba(50, 50, 44, 0.8)",
    borderRadius:12,
    width:120,
    height:48,
    alignItems:'center'
  },
  headerButtonText:{
    color:"#FFF",
    fontFamily:"Montserrat400",
    fontSize:16,
    //fontWeight:"400"
  }
})