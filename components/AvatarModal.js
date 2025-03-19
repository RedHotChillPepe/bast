import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

const AvatarModal = ({ visible, onClose, onSelectAvatar }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePickImage = async () => {
    // Запрашиваем разрешение на доступ к галерее
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Доступ к галерее обязателен!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsMultipleSelection:false,
      base64:true
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleSave = () => {
    if (selectedImage) {
      onSelectAvatar(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Выберите новый аватар</Text>
          {selectedImage ? (
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text>Нет выбранного изображения</Text>
            </View>
          )}
          <Pressable style={styles.pickButton} onPress={handlePickImage}>
            <Text style={styles.pickButtonText}>Выбрать изображение</Text>
          </Pressable>
          <View style={styles.buttonRow}>
            <Pressable style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Сохранить</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setSelectedImage(null);
                onClose();
              }}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AvatarModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  previewPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickButton: {
    backgroundColor: '#9DC0F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
