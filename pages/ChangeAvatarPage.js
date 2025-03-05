import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import { View, Text, Image, Pressable, StyleSheet, Dimensions, TextInput, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AvatarModal from '../components/AvatarModal';

const { width } = Dimensions.get('window');

const ChangeAvatarPage = () => {
  const { getAuth } = useAuth();
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const init = async () => {
      const auth = JSON.parse(await getAuth());
      if (auth && auth.length > 0) {
        setUser(auth[0]);
        if (auth[0].photo) {
          setAvatar(auth[0].photo);
        }
      }
    };
    init();
  }, []);

  const handleAvatarSelect = (newAvatarUri) => {
    setAvatar(newAvatarUri);
    setModalVisible(false);
    // Здесь можно добавить вызов API для сохранения нового аватара на сервере
  };

  return (
      <ScrollView
      contentContainerStyle={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <Text>Нет аватара</Text>
        )}
      </View>
      <Pressable style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Сменить аватар</Text>
      </Pressable>
      <AvatarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectAvatar={handleAvatarSelect}
      />

      <View style={{height: 32}} />


      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Имя:</Text>
        </View>
      
        <TextInput
          style={styles.input}
          placeholder="Имя"
       // secureTextEntry={true}
       // value={password}
       // onChangeText={(text) => setPassword(text)}
          maxLength={20}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
          />
      </View>
    
      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Фамилия:</Text>
        </View>
      
        <TextInput
          style={styles.input}
          placeholder="Фамилия"
       // secureTextEntry={true}
       // value={password}
       // onChangeText={(text) => setPassword(text)}
          maxLength={20}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
          />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Почта:</Text>
        </View>
      
        <TextInput
          style={styles.input}
          placeholder="Почта"
       // secureTextEntry={true}
       // value={password}
       // onChangeText={(text) => setPassword(text)}
          maxLength={20}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
          />
      </View>

      <View style={styles.block}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Телефон:</Text>
        </View>
      
        <TextInput
          style={styles.input}
          placeholder="Телефон"
       // secureTextEntry={true}
       // value={password}
       // onChangeText={(text) => setPassword(text)}
          maxLength={20}
          placeholderTextColor='rgba(60,60,67, 0.6'
          fontSize={17}
          />
      </View>
    
    <Pressable style={styles.button}>
      <Text style={styles.buttonText}>Сохранить изменения</Text>
    </Pressable>
    <View style={{height: 128}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingTop: 16,
    backgroundColor: '#f7f7f7',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  button: {
    backgroundColor: '#9DC0F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

  block: {
    width: width - 72, 
    marginBottom: 12
  },

  title: {
    marginBottom:8
  },

  titleText: {
    fontSize:20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'rgba(120,120,128, 0.12)',
    height: 40,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },

  block: {
    width: width - 72, 
    marginBottom: 12
  },

  title: {
    marginBottom:8
  },

  titleText: {
    fontSize:20,
    lineHeight: 25,
    letterSpacing: -0.45,
    fontWeight: '500',
  },

  input: {
    backgroundColor: 'rgba(120,120,128, 0.12)',
    height: 40,
    marginBottom: 12,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
});

export default ChangeAvatarPage;


