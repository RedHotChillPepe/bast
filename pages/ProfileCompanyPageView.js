import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Dimensions, Pressable, ScrollView, FlatList, Image } from 'react-native';
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



const ProfileCompanyPageView = () => {
  const { logout, getAuth } = useAuth();
  const navigation = useNavigation();
  const {getUser} =useApi()

   const { getAllPosts, getAllVillages } = useApi();
   const [houses, setHouses] = useState([]);
    const [selectedList, setSelectedList] = useState('houses');

  const [usertype, setUsertype] = useState(1) 

  const [userr, setUser]=useState([])

    useEffect(() => {
      const housesFetch = async () => {
        const tempHouses = await getAllPosts();
        if (tempHouses) {
          const tempSetHouses = [];
          const tempSetNewHouses = [];
          tempHouses.forEach((house) => {
            if (house.newbuild) {
              tempSetNewHouses.push(house);
            } else {
              tempSetHouses.push(house);
            }
          });
          setHouses(tempSetHouses);
          setNewHouses(tempSetNewHouses);
        }
      };
  
      const villagesFetch = async () => {
        const villageData = await getAllVillages();
        if (villageData) {
          setVillages(villageData);
        }
      };
  
      housesFetch();
      villagesFetch();
    }, []);

  useEffect(() => {
    const init = async () => {
      const auth = JSON.parse(await getAuth())
      const user = await getUser(await auth[0].phone, "user")
      /* console.log(await user.text()); */
      
      const userJson = JSON.parse(await user.text()) 
      if (userJson.result != false) {
        setUser(await userJson[1])
      }
      
      setUsertype(await auth[0].usertype)
      
    }
    init()
  
    return () => {
      
    }
  }, [usertype, userr, getAuth, getUser])
  




      return (
        <ScrollView contentContainerStyle={styles.container}>

          <View style={{flexDirection:'row', alignSelf:'flex-start', marginLeft: 16, marginTop: 32, alignItems:'flex-start'}} >
            <FontAwesome6 name="face-tired" size={56} color="black" />

            <View style={{marginLeft: 16}}>
                <Text style={styles.name}>Строительная компания</Text>
                <View style={{flexDirection: 'row', marginTop: 8}}>
                  <FontAwesome name="star" size={20} color="#858585" />
                  <FontAwesome name="star" size={20} color="#858585" />
                  <FontAwesome name="star" size={20} color="#858585" />
                  <FontAwesome name="star" size={20} color="#858585" />  
                </View>
                <Text style={{fontSize: 16, marginTop: 12, color:'#858585'}}>На сайте с мая 2024</Text>

                <Pressable style={{backgroundColor: '#d6d6d6', padding: 16, borderRadius: 12, marginTop: 24, flexDirection: 'row', alignItems: 'center', alignSelf:'flex-start'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Написать
            </Text>
          </Pressable>

            </View>
          </View>



<Text style={{fontSize: 24, fontWeight:'bold', alignSelf:'flex-start', marginLeft: 16, marginTop: 40, marginBottom: 16}}>Объявления</Text>
<HouseCard data={houses} navigation={navigation} itemWidth={width -32} />

    
{/*           <View style={styles.buttonsRow}>
            <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
            <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
            <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
          </View> */}
          <View style={styles.buttonsRow}>
            <Button title="Logout" onPress={logout} />
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
