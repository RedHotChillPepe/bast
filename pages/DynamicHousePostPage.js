import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const DynamicHousePostPage = ({route}) => {
    const {house} = route.params
  return (
    <View>
      <Text>{JSON.stringify(house)}</Text>
    </View>
  )
}

export default DynamicHousePostPage

const styles = StyleSheet.create({})