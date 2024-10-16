import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const DynamicHousePostPage = ({route}) => {
    const {house} = route.params
  return (
    <SafeAreaView>
      <Text>{JSON.stringify(house)}</Text>
    </SafeAreaView>
  )
}

export default DynamicHousePostPage

const styles = StyleSheet.create({})