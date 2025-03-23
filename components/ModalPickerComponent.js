// import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
// import React from 'react'
// import { Picker } from '@react-native-picker/picker'

// const ModalPickerComponent = (props) => {
//   return (
//     <Modal
//           visible={props.visible}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => props.onRequestClose(false)}
//           onDismiss={() => props.onRequestClose(false)}
//         >
//           <TouchableOpacity style={styles.modalContainer} onPressOut={() => props.onRequestClose(false)}>
//             <View>
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalContent}>
//                   <Text style={styles.modalHeader}>{props.headerText}</Text>
//                   <Picker
//                     selectedValue={props.pickerSelectedValue}
//                     onValueChange={(value) => props.handlePickerSelect(`${props.valueName}`, value)}
//                   >
//                     {/* <Picker.Item label="ИЖС" value="ИЖС" />
//                     <Picker.Item label="неИЖС" value="неИЖС" /> */}
//                     {
//                       props.pickerData.map((item, index)=>{
//                         return(
//                           <Picker.Item
//                           key={index}
//                           label={item.label}
//                           value={item.value}/>
//                         )
//                       })
//                     }
//                   </Picker>
//                   <Pressable style={styles.closeButton} onPress={() => props.onRequestClose(false)}>
//                     <Text style={styles.closeButtonText}>Выбрать</Text>
//                   </Pressable>
//                 </View>
//               </TouchableWithoutFeedback>
//             </View>
//           </TouchableOpacity>
//     </Modal>
//   )
// }



// export default ModalPickerComponent

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     marginHorizontal: 20,
//     padding: 20,
//     borderRadius: 8,
//     elevation: 5,
//   },
//   modalHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   closeButton: {
//     marginTop: 20,
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
// })