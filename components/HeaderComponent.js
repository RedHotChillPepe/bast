import { View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function HeaderComponent() {
  return (
    <View style={styles.headerStyle}>
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>БАСТ</Text>
        <Pressable style={styles.headerButton}>
          <Text style={styles.headerButtonText}>
            Создать объявление
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerStyle:{
    backgroundColor:"#F5F5F5",
    marginBottom: 16,
    marginHorizontal: 8
  },
  headerText:{
    fontSize:48,
    fontFamily:"Inter700",
    //fontWeight:"700",
    color:"black"
  },
  headerContent:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:'center'
  },
  headerButton:{
    backgroundColor:"rgba(50, 50, 44, 0.8)",
    borderRadius:16,
    width:120,
    height:48,
    alignItems:'center',
    justifyContent:'center'
  },
  headerButtonText:{
    color:"#FFF",

    fontSize:16,
    //fontWeight:"400"
  }
})