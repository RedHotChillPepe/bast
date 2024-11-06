import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity, ToastAndroid } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputComponent from '../components/TextInputComponent';
import ModalPickerComponent from '../components/ModalPickerComponent';

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
    electricity: '',
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
    setFormData((prevData)=> ({ ...prevData, [field]: value }));
  };

  const handlePickerSelect = (field, value) => {
    console.log(field, value);
    
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };


  const handleSubmit = () => {
    /* if (!formData.title || !formData.houseType || !formData.price || !formData.area || !formData.rooms || !formData.location) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    } */
    console.log('Данные объявления:', formData);
  };

  const inputListLocation=[
    {
      text:"Населённый пункт", placeholder:"Название Населённого Пункта", valueName:"settlement"
    },
    {
      text:"Населённый пункт", placeholder:"Улица, Дом", valueName:"location"
    },
    {
      text:"Кадастровые номер", placeholder:"Кадастровый Номер", valueName:"kadastr"
    },
  ]

  const inputListHouseinfo = [
    {
      keyboardType:"numeric", text:"Этажи *", placeholder:"Количество этажей", valueName:"floors",
    },
    {
      keyboardType:"numeric", text:"Комнаты *", placeholder:"Количество комнат", valueName:"rooms",
    },
    {
      keyboardType:"numeric", text:"Площадь *", placeholder:"Жилплощадь (м²)", valueName:"area",
    },
    {
      keyboardType:"numeric", text:"Площадь Участка", placeholder:"Площадь участка (сот.)", valueName:"plotSize",
    },
  ]

  const inputListConstruction = [
    {
      text:"Кровля", placeholder:"Тип кровли", valueName:"roof",
    },
    {
      text:"Фундамент", placeholder:"Тип фундамента", valueName:"basement",
    },
  ]

  const listModalPicker = [
    // Модальное окно для типа дома
    {
      visible:houseTypeModalVisible, onRequestClose: setHouseTypeModalVisible, headerText:"Выберите тип дома", 
      valueName:"houseType",
      pickerData:[
        {label:"ИЖС",value:"ИЖС"},
        {label:"неИЖС",value:"неИЖС"}
      ]
    },
    // Модальное окно для материала несущих стен
    {
      visible:wallMaterialModalVisible, onRequestClose: setWallMaterialModalVisible, headerText:"Выберите материал несущих стен",
      valueName:"wallMaterial",
      pickerData:[
        {label:"Кирпич",value:"Кирпич"},
        {label:"Газоблок",value:"Газоблок"},
        {label:"Пеноблок",value:"Пеноблок"},
        {label:"Брус",value:"Брус"},
        {label:"Доска",value:"Доска"},
        {label:"Каркасный",value:"Каркасный"},
      ]
    },
    // Модальное окно для материала перегородок 
    {
      visible:partitionMaterialModalVisible, onRequestClose: setPartitionMaterialModalVisible, headerText:"Выберите материал перегородок",
      valueName:"partitionMaterial",
      pickerData:[
        {label:"Дерево",value:"Дерево"},
        {label:"Гипсокартон",value:"Гипсокартон"},
        {label:"Газобетон",value:"Газобетон"},
        {label:"Керамзитоблоки",value:"Керамзитоблоки"},
        {label:"Кирпич",value:"Кирпич"},
      ]
    },
    // Модальное окно для состояние дома
    {
      visible:houseConditionModalVisible, onRequestClose: setHouseConditionModalVisible, headerText:"Состояние дома",
      valueName:"houseCondition",
      pickerData:[
        {label:"Требует Ремонта",value:"Требует Ремонта"},
        {label:"Не Требует Ремонта",value:"Не Требует Ремонта"},
      ]
    },
    // Модальное окно для Газа
    {
      visible:gasModalVisible, onRequestClose: setGasModalVisible, headerText:"Проведен газ?",
      valueName:"gas",
      pickerData:[
        {label:"Да",value:"Да"},
        {label:"Нет",value:"Нет"},
      ]
    },
    // Модальное окно для Электричества
    {
      visible:electricityModalVisible, onRequestClose: setElectricityModalVisible, headerText:"Льготный тариф на электричество?",
      valueName:"electricity",
      pickerData:[
        {label:"Да",value:"Да"},
        {label:"Нет",value:"Нет"},
      ]
    },
    // Модальное окно для Водопровода
    {
      visible:waterModalVisible, onRequestClose: setWaterModalVisible, headerText:"Поключение водопровода",
      valueName:"water",
      pickerData:[
        {label:"Центральное водоснабжение",value:"Центральное водоснабжение"},
        {label:"Скважина",value:"Скважина"},
      ]
    },
    // Модальное окно для Канализации
    {
      visible:seweregeModalVisible, onRequestClose: setSeweregeModalVisible, headerText:"Канализация", valueName:"sewerege",
      pickerData:[
        {label:"Центральная канализация",value:"Центральная канализация"},
        {label:"Септик",value:"Септик"},
        {label:"Нет",value:"Нет"},
      ]
    },
    // Модальное окно для Отопления
    {
      visible:heatingModalVisible, onRequestClose: setHeatingModalVisible, headerText:"Отопление",
      valueName:"heating",
      pickerData:[
        {label:"Газовый котел",value:"Газовый котел"},
        {label:"Электрический котел",value:"Электрический котел"},
        {label:"Печь",value:"Печь"},
        {label:"Нет",value:"Нет"},
      ]
    },

  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.header}>Создание объявления</Text>

        <Text style={styles.header}>Местоположение</Text>

        {
          inputListLocation.map((item, index) => {
            return (
            <TextInputComponent key={index} viewStyle={styles.row} textStyle={styles.label}
            text={item.text} inputStyle={styles.input} placeholder={item.placeholder}
            value={formData[item.valueName]} handleInputChange={handleInputChange} valueName={item.valueName}
            />)
          })
        }

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

        {
          inputListHouseinfo.map((item, index) => {
            return (
            <TextInputComponent key={index} keyboardType={item.keyboardType} viewStyle={styles.row} 
            textStyle={styles.label} text={item.text} inputStyle={styles.input} 
            placeholder={item.placeholder} value={formData[item.valueName]}
            handleInputChange={handleInputChange} valueName={item.valueName}
            />)
          })
        }


        <View style={styles.row}>
          <Text style={styles.label}>Состояние*</Text>
          <TouchableOpacity style={styles.input} onPress={() => setHouseConditionModalVisible(true)}>
            <Text>{formData.houseCondition ? formData.houseCondition : "Состояние дома"}</Text>
          </TouchableOpacity>
        </View>

        
        {/* В будущем заменить на DatePicker!!!! */}
        <TextInputComponent keyboardType={"numeric"} viewStyle={styles.row} textStyle={styles.label}
        text={"Год Постройки"} inputStyle={styles.input} placeholder={"Год Постройки"}
        value={formData.constructionYear} handleInputChange={handleInputChange} valueName={"constructionYear"}
        />



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

        {
          inputListConstruction.map((item, index) => {
            return (
            <TextInputComponent key={index} viewStyle={styles.row} textStyle={styles.label}
            text={item.text} inputStyle={styles.input} placeholder={item.placeholder}
            value={formData[item.valueName]} handleInputChange={handleInputChange} valueName={item.valueName}
            />)
          })
        }

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
            <Text>{formData.heating ? formData.heating : "Отопление?"}</Text>
          </TouchableOpacity>
        </View>

        {/* Канализация */}
        <View style={styles.row}>
          <Text style={styles.label}>Канализация</Text>
          <TouchableOpacity style={styles.input} onPress={() => setSeweregeModalVisible(true)}>
            <Text>{formData.sewerege ? formData.sewerege : "Каналтзация?"}</Text>
          </TouchableOpacity>
        </View>

        <TextInputComponent keyboardType={"numeric"} viewStyle={styles.row} textStyle={styles.label}
        text={"Цена (обязательно)"} inputStyle={styles.input} placeholder={"Цена (руб)"}
        value={formData.price} handleInputChange={handleInputChange} valueName={"price"}
        />

        <TextInputComponent viewStyle={styles.row} textStyle={styles.label}
        text={"Описание"} inputStyle={[styles.input, { height: 100 }]} placeholder={"Описание дома"}
        value={formData.description} handleInputChange={handleInputChange} valueName={"description"}
        />
        
        {/* Все модальные окна */}
        {
          listModalPicker.map((item, index) => {
            return (
              <ModalPickerComponent
              key={index}
              visible={item.visible}
              onRequestClose={item.onRequestClose}
              headerText={item.headerText}
              pickerSelectedValue={formData[item.valueName]}
              handlePickerSelect={handlePickerSelect}
              valueName={item.valueName}
              pickerData={item.pickerData}/>
            )
          })
        }

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
