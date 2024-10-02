import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import PagerView from 'react-native-pager-view'

export default function ImageCarouselComponent(props) {


    const handlePageSelection = (carposition) => {
        
        
        
    }

  return (
    <PagerView onPageSelected={(e) => handlePageSelection(e.nativeEvent.position)} on style={styles.container} initialPage={0}>

        
        {
            props.content.map((item,index)=>(
                <View style={styles.page} key={index}>
                    <View style={styles.imageWrapper}>
                        <Text style={styles.text}>
                            {item.text}
                        </Text>
                        <Image resizeMode='stretch' style={styles.image} source={{uri:item.imageSource}}/>

                    </View>
                </View>
            ))
        }
        
    </PagerView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    page: {
        
        justifyContent:'center',
        alignContent:"center",
        alignItems:'center',
        alignSelf:'center',
    },
    imageWrapper: {
        backgroundColor:"#F5F5F5"
        
    },
    image: {
        height:250,
        width:350, 
        opacity:0.65,
        elevation:1, // android 
        zIndex:1     // ios     
    },
    text: {
        position:'absolute',
        color:'#000',
        left:20,
        top:30,
        elevation:2, // android
        zIndex:2     // ios
    }
  });