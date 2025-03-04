import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.header}>Изменение аватара</Text>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImage} />
        ) : (
          <Text>Нет аватара</Text>
        )}
      </View>
      <Pressable style={styles.changeButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.changeButtonText}>Сменить аватар</Text>
      </Pressable>
      <AvatarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectAvatar={handleAvatarSelect}
      />
    </View>
  );
};

export default ChangeAvatarPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  changeButton: {
    backgroundColor: '#9DC0F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
