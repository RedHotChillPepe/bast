import { StyleSheet, Text, TextInput, View, Dimensions } from 'react-native'
import React from 'react'

const {width} = Dimensions.get('window');

const TextInputSearch = (props) => {
  return (
    <View style={styles.searchContainer}>
        <Text>Начать поиск</Text>
        <TextInput
            readOnly={props.readOnly}
            editable={props.readOnly}
            style={styles.inputSearchStyle}
            placeholder='Поиск'
            // value={props.value}
            // onChangeText={(value) => {
            //   console.log(`ValueName: ${props.valueName}, Value: ${value}`);
            //   props.handleInputChange(props.valueName, value);
            // }}
        />
    </View>
  )
}

export default TextInputSearch

const styles = StyleSheet.create({
    searchContainer: {
        width: width - 32,
        alignSelf: 'center',
        backgroundColor: '#d6d6d6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    inputSearchStyle: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10
    }
})