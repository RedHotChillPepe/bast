import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateHousePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    houseType: '',
    wallMaterial: '',
    partitionMaterial: '',
    price: '',
    area: '',
    floors: '',
    rooms: '',
    location: '',
    settlement: '',
    plotSize: '',
    description: '',
    roof: '',
    basement: '',
    landArea: '',
    kadastr: '',
    houseCondition: '',
    constructionYear: '',
    gas: '',
    water: '',
    sewerege: '',
    electicity: '',
    heating: '',

  });

  const [houseTypeModalVisible, setHouseTypeModalVisible] = useState(false);
  const [wallMaterialModalVisible, setWallMaterialModalVisible] = useState(false);
  const [partitionMaterialModalVisible, setPartitionMaterialModalVisible] = useState(false);
  const [houseConditionModalVisible, setHouseConditionModalVisible] = useState(false);
  const [gasModalVisible, setGasModalVisible] = useState(false);
  const [waterModalVisible, setWaterModalVisible] = useState(false);
  const [seweregeModalVisible, setSeweregeModalVisible] = useState(false);
  const [electricityModalVisible, setElectricityModalVisible] = useState(false);
  const [heatingModalVisible, setHeatingModalVisible] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handlePickerSelect = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };


  const handleSubmit = () => {
    if (!formData.title || !formData.houseType || !formData.price || !formData.area || !formData.rooms || !formData.location) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }
    console.log('Данные объявления:', formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.header}>Создание объявления</Text>

        <Text style={styles.header}>Местоположение</Text>
        <View style={styles.row}>

        <Text style={styles.label}>Населенный пункт</Text>
          <TextInput
            style={styles.input}
            placeholder="Населенного пунта"
            value={formData.location}
            onChangeText={(value) => handleInputChange('settlement', value)}
          />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Населенный пункт</Text>
          <TextInput
            style={styles.input}
            placeholder="Улица, дом"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
          />
        </View>

        <View style={styles.row}>
        <Text style={styles.label}>Кадастровый номер</Text>
          <TextInput
            style={styles.input}
            placeholder="Кадастровый номер"
            value={formData.location}
            onChangeText={(value) => handleInputChange('kadastr', value)}
          />
        </View>

        <Text style={styles.header}>Контакты</Text>
        <Text>Кто продает собственник\риэлтор\застрощик</Text>

        <Text style={styles.header}>О доме</Text>
        {/* Тип дома */}
        <View style={styles.row}>
          <Text style={styles.label}>Тип дома *</Text>
          <TouchableOpacity style={styles.input} onPress={() => setHouseTypeModalVisible(true)}>
            <Text>{formData.houseType ? formData.houseType : "Выберите тип дома"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Этажи *</Text>
          <TextInput
            style={styles.input}
            placeholder="Количество этажей"
            keyboardType="numeric"
            value={formData.floors}
            onChangeText={(value) => handleInputChange('floors', value)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Комнаты *</Text>
          <TextInput
            style={styles.input}
            placeholder="Количество комнат"
            keyboardType="numeric"
            value={formData.rooms}
            onChangeText={(value) => handleInputChange('rooms', value)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Площадь *</Text>
          <TextInput
            style={styles.input}
            placeholder="Площадь (м²)"
            keyboardType="numeric"
            value={formData.area}
            onChangeText={(value) => handleInputChange('area', value)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Площадь участка</Text>
          <TextInput
            style={styles.input}
            placeholder="Площадь участка, м²"
            keyboardType="numeric"
            value={formData.area}
            onChangeText={(value) => handleInputChange('plotSize', value)}
          />
        </View>

                {/* Несущие стены */}
                <View style={styles.row}>
          <Text style={styles.label}>Состояние*</Text>
          <TouchableOpacity style={styles.input} onPress={() => setHouseConditionModalVisible(true)}>
            <Text>{formData.houseCondition ? formData.houseCondition : "Состояние дома"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Год постройки</Text>
          <TextInput
            style={styles.input}
            placeholder="Год постройки"
            keyboardType="numeric"
            value={formData.constructionYear}
            onChangeText={(value) => handleInputChange('constructionYear', value)}
          />
        </View>



        <Text style={styles.header}>Конструкция</Text>
        {/* Несущие стены */}
        <View style={styles.row}>
          <Text style={styles.label}>Несущие стены *</Text>
          <TouchableOpacity style={styles.input} onPress={() => setWallMaterialModalVisible(true)}>
            <Text>{formData.wallMaterial ? formData.wallMaterial : "Выберите материал стен"}</Text>
          </TouchableOpacity>
        </View>

        {/* Перегородки */}
        <View style={styles.row}>
          <Text style={styles.label}>Перегородки *</Text>
          <TouchableOpacity style={styles.input} onPress={() => setPartitionMaterialModalVisible(true)}>
            <Text>{formData.partitionMaterial ? formData.partitionMaterial : "Выберите материал перегородок"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Кровля</Text>
          <TextInput
            style={styles.input}
            placeholder="Тип кровли"
            value={formData.roof}
            onChangeText={(value) => handleInputChange('roof', value)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Фундамент</Text>
          <TextInput
            style={styles.input}
            placeholder="Тип фундамента"
            value={formData.basement}
            onChangeText={(value) => handleInputChange('basement', value)}
          />
        </View>


        <Text style={styles.header}>Коммуникации</Text>


        {/* Электричество */}
        <View style={styles.row}>
          <Text style={styles.label}>Электричество</Text>
          <TouchableOpacity style={styles.input} onPress={() => setElectricityModalVisible(true)}>
            <Text>{formData.electricity ? formData.electricity : "Подключено электричество?"}</Text>
          </TouchableOpacity>
        </View>

        {/* Водоснабжение */}
        <View style={styles.row}>
          <Text style={styles.label}>Водоснабжение</Text>
          <TouchableOpacity style={styles.input} onPress={() => setWaterModalVisible(true)}>
            <Text>{formData.water ? formData.water : "Система водоснабжения?"}</Text>
          </TouchableOpacity>
        </View>

        {/* Газ */}
        <View style={styles.row}>
          <Text style={styles.label}>Газ</Text>
          <TouchableOpacity style={styles.input} onPress={() => setGasModalVisible(true)}>
            <Text>{formData.gas ? formData.gas : "Подключение газа?"}</Text>
          </TouchableOpacity>
        </View>

        {/* Отопление */}
        <View style={styles.row}>
          <Text style={styles.label}>Отопление</Text>
          <TouchableOpacity style={styles.input} onPress={() => setHeatingModalVisible(true)}>
            <Text>{formData.heating ? formData.heating : "Подключение газа?"}</Text>
          </TouchableOpacity>
        </View>

        {/* Канализация */}
        <View style={styles.row}>
          <Text style={styles.label}>Канализация</Text>
          <TouchableOpacity style={styles.input} onPress={() => setSeweregeModalVisible(true)}>
            <Text>{formData.sewerege ? formData.sewerege : "Подключение газа?"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Цена (Обязательно)</Text>
          <TextInput
            style={styles.input}
            placeholder="Цена (руб)"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Описание</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Описание дома"
            multiline
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
          />
        </View>

 {/* Модальное окно для типа дома */}
        <Modal
          visible={houseTypeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setHouseTypeModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Выберите тип дома</Text>
              <Picker
                selectedValue={formData.houseType}
                onValueChange={(value) => handlePickerSelect('houseType', value)}
              >
                <Picker.Item label="ИЖС" value="ИЖС" />
                <Picker.Item label="неИЖС" value="неИЖС" />
              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setHouseTypeModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для материала несущих стен */}
        <Modal
          visible={wallMaterialModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setWallMaterialModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Выберите материал несущих стен</Text>
              <Picker
                selectedValue={formData.wallMaterial}
                onValueChange={(value) => handlePickerSelect('wallMaterial', value)}
              >
                <Picker.Item label="Кирпич" value="Кирпич" />
                <Picker.Item label="Газоблок" value="Газоблок" />
                <Picker.Item label="Пеноблок" value="Пеноблок" />
                <Picker.Item label="Брус" value="Брус" />
                <Picker.Item label="Доска" value="Доска" />
                <Picker.Item label="Каркасный" value="Каркасный" />
              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setWallMaterialModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для материала перегородок */}
        <Modal
          visible={partitionMaterialModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setPartitionMaterialModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Выберите материал перегородок</Text>
              <Picker
                selectedValue={formData.partitionMaterial}
                onValueChange={(value) => handlePickerSelect('partitionMaterial', value)}
              >
                <Picker.Item label="Дерево" value="Дерево" />
                <Picker.Item label="Гипсокартон" value="Гипсокартон" />
                <Picker.Item label="Газобетон" value="Газобетон" />
                <Picker.Item label="Керамзитоблоки" value="Керамзитоблоки" />
                <Picker.Item label="Кирпич" value="Кирпич" />
              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setPartitionMaterialModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

                {/* Модальное окно для состояние дома */}
                <Modal
          visible={houseConditionModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setHouseConditionModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Состояние дома</Text>
              <Picker
                selectedValue={formData.partitionMaterial}
                onValueChange={(value) => handlePickerSelect('houseCondition', value)}
              >
                <Picker.Item label="Требует ремеонта" value="Требует ремеонта" />
                <Picker.Item label="Не требует ремеонта" value="Не требует ремеонта" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setHouseConditionModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для Газа */}
        <Modal
          visible={gasModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setGasModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Проведен газ?</Text>
              <Picker
                selectedValue={formData.gas}
                onValueChange={(value) => handlePickerSelect('gas', value)}
              >
                <Picker.Item label="Да" value="Да" />
                <Picker.Item label="Нет" value="Нет" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setGasModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для Электричества */}
        <Modal
          visible={electricityModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setElectricityModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Льготный тариф на электричество</Text>
              <Picker
                selectedValue={formData.electricity}
                onValueChange={(value) => handlePickerSelect('electricity', value)}
              >
                <Picker.Item label="Да" value="Да" />
                <Picker.Item label="Нет" value="Нет" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setElectricityModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Модальное окно для Водопровода */}
        <Modal
          visible={waterModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setWaterModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Подключение водопровода</Text>
              <Picker
                selectedValue={formData.water}
                onValueChange={(value) => handlePickerSelect('water', value)}
              >
                <Picker.Item label="Центральное водоснабжение" value="Центральное водоснабжения" />
                <Picker.Item label="Скважина" value="Скважина" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setWaterModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

         {/* Модальное окно для Канализации */}
         <Modal
          visible={seweregeModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSeweregeModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Подключение водопровода</Text>
              <Picker
                selectedValue={formData.sewerege}
                onValueChange={(value) => handlePickerSelect('sewerege', value)}
              >
                <Picker.Item label="Центральная канализация" value="Центральная канализация" />
                <Picker.Item label="Септик" value="Септик" />
                <Picker.Item label="Нет" value="Нет" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setSeweregeModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal> 

        {/* Модальное окно для Отопления */}
         <Modal
          visible={heatingModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setHeatingModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Подключение водопровода</Text>
              <Picker
                selectedValue={formData.heating}
                onValueChange={(value) => handlePickerSelect('heating', value)}
              >
                <Picker.Item label="Газовый котел" value="Газовый котел" />
                <Picker.Item label="Электрический котел" value="Электрический котел" />
                <Picker.Item label="Печь" value="Печь" />
                <Picker.Item label="Нет" value="Нет" />

              </Picker>
              <Pressable style={styles.closeButton} onPress={() => setHeatingModalVisible(false)}>
                <Text style={styles.closeButtonText}>Выбрать</Text>
              </Pressable>
            </View>
          </View>
        </Modal>      


        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Опубликовать объявление</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
