import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputComponent from '../components/TextInputComponent';
import ModalPickerComponent from '../components/ModalPickerComponent';
import * as ImagePicker from 'expo-image-picker';
import { useApi } from '../context/ApiContext';

const { width, height } = Dimensions.get('window');

export default function EditHousePostPage({route}) {
  const {additions, base, bedrooms, city, electricity_bill,
    full_address, gas, heating, house_area, house_status,
    house_type, id, kad_number, latitude, longitude,
    name, newbuild, num_floors, photos, plot_area,
    price, roof, sewage, text, walls_lb, walls_part,
    water, wc_number, year_built
  } = route.params

  const [formData, setFormData] = useState({
    title: name,
    houseType: house_type,
    wallMaterial: walls_lb,
    partitionMaterial: walls_part,
    price: price,
    area: house_area,
    floors: num_floors,
    rooms: bedrooms,
    location: full_address,
    settlement: city,
    plotSize: plot_area,
    description: text,
    roof: roof,
    basement: base,
    kadastr: kad_number,
    houseCondition: house_status,
    constructionYear: year_built,
    gas: gas,
    water: water,
    sewerege: sewage,
    electricity: electricity_bill,
    heating: heating,
    photos:photos
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

  const {updatePost} = useApi()

  

  const handleInputChange = (field, value) => {
    setFormData((prevData)=> ({ ...prevData, [field]: value }));
  };

  const handlePickerSelect = (field, value) => {
    console.log(field, value);
    
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      quality:0,
      base64:true
    })
    console.log(result);

    var tempPhotos = formData.photos
    tempPhotos.push({filename:result.assets[0].fileName, 
      base64:result.assets[0].base64})

    //console.log(tempPhotos);
    
    setFormData((prevData) => ({...prevData, photos:tempPhotos}))
  }


  const handleSubmit = async () => {
    /* if (!formData.title || !formData.houseType || !formData.price || !formData.area || !formData.rooms || !formData.location) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    } */
    let result = await updatePost(formData, id)

    console.log(await result);
    

    // console.log('Данные объявления:', formData);
  };

  const inputListLocation=[
    {text:"Населённый пункт", placeholder:"Название Населённого Пункта", valueName:"settlement"},
    {text:"Населённый пункт", placeholder:"Улица, Дом", valueName:"location"},
    {text:"Кадастровые номер", placeholder:"Кадастровый Номер", valueName:"kadastr"},
  ]

  const inputListHouseinfo = [
    {keyboardType:"numeric", text:"Этажи *", placeholder:"Количество этажей", valueName:"floors",},
    {keyboardType:"numeric", text:"Комнаты *", placeholder:"Количество комнат", valueName:"rooms",},
    {keyboardType:"numeric", text:"Площадь *", placeholder:"Жилплощадь (м²)", valueName:"area",},
    {keyboardType:"numeric", text:"Площадь Участка", placeholder:"Площадь участка (сот.)", valueName:"plotSize",},
  ]

  const inputListConstruction = [
    {text:"Кровля", placeholder:"Тип кровли", valueName:"roof",},
    {text:"Фундамент", placeholder:"Тип фундамента", valueName:"basement",},
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
        <Text style={styles.header}>Редактирование Объявления</Text>

        <Text style={styles.header2}>Местоположение</Text>

        {
          inputListLocation.map((item, index) => {
            return (
            <TextInputComponent key={index} viewStyle={styles.row} textStyle={styles.label}
            text={item.text} inputStyle={styles.input} placeholder={item.placeholder}
            value={formData[item.valueName]} handleInputChange={handleInputChange} valueName={item.valueName}
            />)
          })
        }

        <Text style={styles.header2}>Контакты</Text>
        <Text>Кто продает собственник\риэлтор\застрощик</Text>

        <Text style={styles.header2}>О доме</Text>
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



        <Text style={styles.header2}>Конструкция</Text>
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

        <Text style={styles.header2}>Коммуникации</Text>


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
            <Text>{formData.sewerege ? formData.sewerege : "Каналзация?"}</Text>
          </TouchableOpacity>
        </View>

        <TextInputComponent keyboardType={"numeric"} viewStyle={styles.row} textStyle={styles.label}
        text={"Цена (обязательно)"} inputStyle={styles.input} placeholder={"Цена (руб)"}
        value={formData.price} handleInputChange={handleInputChange} valueName={"price"}
        />

        <TextInputComponent viewStyle={styles.row} textStyle={styles.label}
        text={"Описание"} inputStyle={[styles.input, { height: 120 }]} placeholder={"Описание дома"}
        value={formData.description} handleInputChange={handleInputChange} valueName={"description"}
        />

        <Text style={styles.header2}>Фото</Text>


        
        <View style={styles.photoContainer}>
          {formData.photos.length === 0 ? (
            <View style={styles.inputPhoto}>
              <Pressable style={{backgroundColor:'black',
                            width: width*0.65,
                            height: height*0.055,
                            borderRadius: 16,
                            alignItems:'center',
                            justifyContent:'center',
                            marginVertical: 8}}
                    onPress={() => handleImagePicker()}>
                 <Text style={{color:'white'}}>Добавить фотографии</Text>
               </Pressable>
            </View>
          ) : (
            <View style={styles.inputPhoto2}>
              {formData.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo.base64 == undefined ? `${photo}` : `data:image/jpeg;base64,${photo.base64}` }} style={styles.thumbnail} />
                
              ))}
              <Pressable style={{backgroundColor:'black',
                            width: (width-32-8*4)/3,
                            height: (width-32-8*4)/3,
                            borderRadius: 16,
                            marginTop: 8,
                            marginLeft: 8,
                            alignItems:'center',
                            justifyContent:'center',
                            }}
                    onPress={() => handleImagePicker()}>
                 <Text style={{color:'white'}}>Добавить фотографии</Text>
               </Pressable>
            </View>
          )}

        </View>

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Сохранить изменения</Text>
        </Pressable>

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
  header2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 32,
    textAlign:'left',
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
  inputPhoto: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems:'center'
  },
  inputPhoto2: {
    flexDirection:'row',
    flexWrap:'wrap',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingBottom: 8,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
    
  },
  buttonText: {
    color: 'grey',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    justifyContent:'space-between'

  },
  thumbnail: {
    width: (width-32-8*4)/3,
    height: (width-32-8*4)/3,
    borderRadius: 16,
    marginLeft: 8,
    marginTop: 8

  
  },
  
});
