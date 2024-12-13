import { Dimensions, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';

const {width} = Dimensions.get('window');

const UserLoginPage = () => {
    const {getLogin} = useApi()
    const {setAuth} = useAuth()

    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')


    const [isPhoneLabelShown, setIsPhoneLabelShown] = useState(false)
    const [isAuthLabelShown, setIsAuthLabelShown] = useState(false)

    const handleSubmit = async () => {
        const phonePattern = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g

        if (!phonePattern.test(phoneNumber)) {
            console.log(phonePattern.test(phoneNumber));
            console.log(phoneNumber);
            
            setIsPhoneLabelShown(true)
        } else {
            setIsPhoneLabelShown(false)
            if (phoneNumber != "" && password != "") {
                const response = await getLogin(phoneNumber, password)
                const responseJson = JSON.parse([await response.text()])
                console.log(await response);
                
                
                if (await response.status == 200) {
                    console.log(responseJson);
                    
                    if (await responseJson.result ) {
                        
                        
                        const authResp = await setAuth([{
                            status:true,
                            onboarded:false,
                            phone:phoneNumber,
                            password:responseJson.hash,
                            id: responseJson.id
                        }])
                    } else {
                        setIsAuthLabelShown(true)
                    }

                }
            }
        }
    }

  return (
    <SafeAreaView>
        <View style={styles.block}>
            <View style={styles.title}>
            <Text style={styles.titleText} >Телефон:</Text>
            </View>

            <TextInput
            style={styles.input}
            placeholder="+7 (912) 444-22-11"
            keyboardType='phone-pad'
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            />
            {
            isPhoneLabelShown
            &&
            <Text style={styles.inputLabel}>Неверный номер телефона</Text>
            }
        </View>

        <View style={styles.block}>
            <View style={styles.title}>
            <Text style={styles.titleText} >Пароль:</Text>
            </View>

            <TextInput
            style={styles.input}
            placeholder="Пароль"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            maxLength={20}
            />
        </View>

        <Pressable style={{backgroundColor: 'black', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginTop: 44}} 
                    //  onPress={() => setIsAuth(true)}
                    onPress={() => handleSubmit()}>
            <Text style={{fontSize: 20, color:'white'}}>
                Подтвердить
            </Text>
        </Pressable>
    
        {
            isAuthLabelShown
            &&
            <Text style={styles.inputLabel}>Неверные данные</Text>
        }
        

    </SafeAreaView>
  )
}

export default UserLoginPage

const styles = StyleSheet.create({
    block: {
        paddingHorizontal: 32,
        width: width, 
      },
    
      h1: {
        fontSize: 32,
        fontWeight: '600'
      },
    
      title: {
        marginBottom:4
      },
    
      titleText: {
        fontSize:18,
        fontWeight: '500',
      },
    
      input: {
        height: 40,
        marginBottom: 12,
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
      },
      inputLabel:{
        color:"red"
      }
})