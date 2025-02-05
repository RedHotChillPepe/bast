import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useApi } from '../context/ApiContext';
import ProfileBuilderPage from './ProfileCompanyPage.js';
import ProfileRealtorPage from './ProfileEmployeePage.js';
import FontAwesome5 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HouseCard from '../components/HouseCard.js';

const { width } = Dimensions.get('window');



const ProfileCompanyPageView = ({route, navigation}) => {
  const {CompanyId} = route.params
  const { getUserByID } = useApi();

  const [userr, setUser]=useState([])

  

  useEffect(() => {
    const init = async () => {
      const result = await getUserByID(CompanyId, "company")
      const resultJson = JSON.parse(await result.text())

      console.log(resultJson);
      
      setUser(resultJson[0])
    }
    init()
  
    return () => {
      
    }
  }, [getUserByID])
  




      return (
        <ScrollView contentContainerStyle={styles.container}>

          <View style={{flexDirection:'row', alignSelf:'flex-start', marginLeft: 16, marginTop: 32, alignItems:'flex-start'}} >

            {
              Object.keys(userr).length != 0
              ?
              <Image style={{overflow:'hidden',  borderRadius: 150 / 2}} width={80} height={80} source={{uri:userr.photo}}/>
              :
              <FontAwesome6 name="face-tired" size={56} color="black" />
            }

            


            <View style={{marginLeft: 16}}>
              {
                Object.keys(userr).length != 0
                ?
                <View>
                  <Text style={styles.name}>{userr.name}</Text>
                  <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.email}</Text>
                  <Text style={[styles.name, {fontSize:18, color:'grey'}]}>{userr.phone}</Text>
                </View>
                
                :
                <ActivityIndicator size="large" color="#32322C" />
              }

              


              <View style={{flexDirection: 'row', marginTop: 8}}>
                <FontAwesome name="star" size={20} color="#858585" />
                <FontAwesome name="star" size={20} color="#858585" />
                <FontAwesome name="star" size={20} color="#858585" />
                <FontAwesome name="star" size={20} color="#858585" />  
              </View>
              <Text style={{fontSize: 16, marginTop: 12, color:'#858585'}}>На сайте с мая 2024</Text>

              <Pressable style={{backgroundColor: '#d6d6d6', padding: 16, 
                borderRadius: 12, marginTop: 24, flexDirection: 'row', 
                alignItems: 'center', alignSelf:'flex-start'}} onPress={()=>{navigation.navigate("NotExistPage")}}>

                <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                  Написать
                </Text>

              </Pressable>

            </View>
          </View>



          <Text style={{fontSize: 24, fontWeight:'bold', alignSelf:'flex-start', marginLeft: 16, marginTop: 40, marginBottom: 16}}>
            Объявления
          </Text>

          <Pressable style={{backgroundColor: '#d6d6d6', padding: 16, 
            borderRadius: 12, marginTop: 24, flexDirection: 'row', 
            alignItems: 'center', alignSelf:'flex-start'}} onPress={()=>{navigation.navigate("NotExistPage")}}>

            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Посмотреть
            </Text>

          </Pressable>

          {/* <HouseCard data={houses} navigation={navigation} itemWidth={width -32} /> */}

    
{/*           <View style={styles.buttonsRow}>
            <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
            <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
            <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
          </View> */}
          <View style={styles.buttonsRow}>
            <Button title="404" onPress={() => navigation.navigate('Error404')} />
            <Button title="403" onPress={() => navigation.navigate('Error403')} />
            <Button title="500" onPress={() => navigation.navigate('Error500')} />
            <Button title="503" onPress={() => navigation.navigate('Error503')} />
          </View>
        </ScrollView>
      );

  
};

export default ProfileCompanyPageView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#efefef',
  },
  nameBlock: {
    flexDirection: 'row',
    width: width - 32,
    marginTop: 32,
    marginBottom: 24,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: '#d6d6d6',
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    color: '#14080E',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 32,
  },
  logoutText: {
    color: 'grey',
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#14080E',
  },
  email: {
    fontSize: 18,
    color: '#858585',
  },
});
