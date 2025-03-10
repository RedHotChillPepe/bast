import { useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FavouritesPage from './pages/FavouritesPage';
import ChatsPage from './pages/ChatsPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthProvider from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DynamicHousesPage from './pages/DynamicHousesPage';
import DynamicHousePostPage from './pages/DynamicHousePostPage';
import ApiProvider from './context/ApiContext';
import HeaderComponent from './components/HeaderComponent';
import { useFonts } from 'expo-font';
import PersonalData from './pages/PersonalDataPage.js'
import UserLoginPage from './pages/UserLoginPage.js';
import ConfirmationPage from './pages/ConfirmationPage.js';
import CreateHousePostPage from './pages/CreateHousePostPage.js';
import NotExistPage from './pages/NotExistPage.js';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EditHousePostPage from './pages/EditHousePostPage.js';
import * as SplashScreen from 'expo-splash-screen';
import MortgageCalculator from './pages/MortgageCalculator.js';
import Error404 from './pages/Error404.js';
import Error403 from './pages/Error403.js';
import Error500 from './pages/Error500.js';
import Error503 from './pages/Error503.js';
import DynamicStoriesPage from './pages/DynamicStoriesPage.js';
import ProfilePageView from './pages/ProfilePageView.js'; 
import SettingsPage from './pages/SettingsPage.js';
import ProfileCompanyPageView from './pages/ProfileCompanyPageView.js';
import ProfileEmployeePageView from './pages/ProfileEmployeePageView.js';
import { Geocoder } from 'react-native-yamap';
import { YaMap } from 'react-native-yamap';
import SearchMap from './pages/SearchMap.js';
import { Button } from 'react-native-elements';
import Feather from '@expo/vector-icons/Feather';
import UserPostsPage from './pages/UserPostsPage.js';
import ChangeAvatarPage from './pages/ChangeAvatarPage.js';
import UserPostsClosed from './pages/UserPostsClosed.js';
import UserRecycleBin from './pages/UserRecycleBin.js';



const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()
const OnboardingStack = createNativeStackNavigator()
const ErrorStack = createNativeStackNavigator()
const ProfileStack = createNativeStackNavigator()
const TopStack = createNativeStackNavigator()
const SearchStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

YaMap.init('d2dd4e6a-fb92-431b-a6db-945e7e96b17c')
Geocoder.init('d4e0fa5b-61fc-468d-886c-31740a78b323')

// Все доступные ошибки
const Errors = () => {
  return(
    <ErrorStack.Navigator>
      <ErrorStack.Screen name='Error404' component={Error404}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <ErrorStack.Screen name='Error403' component={Error403}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <ErrorStack.Screen name='Error500' component={Error500}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <ErrorStack.Screen name='Error503' component={Error503}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <ErrorStack.Screen name='NotExistPage' component={NotExistPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
    </ErrorStack.Navigator>
  )
}

const SearchPostsStack = () => {
  return(
    <SearchStack.Navigator screenOptions={{headerShown:false}} initialRouteName='SearchScreen'>

      <SearchStack.Screen name='SearchScreen' component={DynamicHousesPage}
      options={{//header:(props) => <HeaderComponent{...props}/>
        headerShown: true,
        headerTitle:""
        }}/>

      <SearchStack.Screen name='House' component={DynamicHousePostPage}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: '',
        ...(Platform.OS === 'ios' && {
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
              <Text style={{ fontSize: 17, letterSpacing: -0.43, lineHeight: 22, color: '#007AFF' }}>Назад</Text>
            </Pressable>
          )
        }),
      })}
      />

      <SearchStack.Screen name='SearchMap' component={SearchMap}
        options={{//header:(props) => <HeaderComponent{...props}/>
        headerShown: false, 
        headerTitle: 'Поиск по карте',  
      }}/>
      
      <SearchStack.Screen name='EditHousePostPage' component={EditHousePostPage}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: false,
            headerTitle: 'Редактирование объявления',  
          }}/>

      <SearchStack.Screen name='ProfilePageView' component={ProfilePageView}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: true,
            headerTitle: 'Частное лицо', 
          }}/>   

    </SearchStack.Navigator>
  )
}

const StackProfile = () => {
  return(
    <ProfileStack.Navigator initialRouteName='Profile'>
      <ProfileStack.Screen name='Profile' component={ProfilePage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
      <ProfileStack.Screen name='SettingsPage' component={SettingsPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: 'Настройки',   
          }}/>
      <ProfileStack.Screen name='MortgageCalculator' component={MortgageCalculator}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
      <ProfileStack.Screen name='ChangeAvatarPage' component={ChangeAvatarPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: true,  
          headerTitle: 'Редактирование профиля'
          }}/>

      <ProfileStack.Screen name='UserPostsPage' component={UserPostsPage}
      options={{//header:(props) => <HeaderComponent{...props}/>
       headerShown: true,
       headerTitle: 'Мои объявления',  
      }}/>

      <ProfileStack.Screen name='UserPostsClosed' component={UserPostsClosed}
      options={{//header:(props) => <HeaderComponent{...props}/>
       headerShown: true,
       headerTitle: 'Закрытые объявления',  
      }}/>

      <ProfileStack.Screen name='UserRecycleBin' component={UserRecycleBin}
      options={{//header:(props) => <HeaderComponent{...props}/>
       headerShown: true,
       headerTitle: 'Удаленные объявления',  
      }}/>
    </ProfileStack.Navigator>
  )
}

/// Объявление доступных страниц, навигация (возможно стоит в отдельный компонент)
const AppStack = () => {
  return(
      <Stack.Navigator initialRouteName='Main'  backBehavior='history'>
        <Stack.Screen name='Main' component={MainPage} 
        options={{
          header:(props) => <HeaderComponent{...props}/>
        }}/>
        
        <Stack.Screen name='House' component={DynamicHousePostPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: '',
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
              </Pressable>
            )
        })}
      />
        <Stack.Screen name='CreateHousePostPage' component={CreateHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        <Stack.Screen name='EditHousePostPage' component={EditHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        

        <Stack.Screen name='MortgageCalculator' component={MortgageCalculator}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>

        <Stack.Screen name='DynamicStoriesPage' component={DynamicStoriesPage}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: false  
            }}/>

        <Stack.Screen name='ProfilePageView' component={ProfilePageView}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: true,
            headerTitle: 'Частное лицо', 
            }}/>   

        <Stack.Screen name='SettingsPage' component={SettingsPage}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: true,
            headerTitle: 'Настройки', 
          }}/> 

        <Stack.Screen name='ProfileCompanyPageView' component={ProfileCompanyPageView}
          options={{//header:(props) => <HeaderComponent{...props}/>
           headerShown: true,
           headerTitle: 'Компания',   
        }}/>

        <Stack.Screen name='ProfileEmployeePageView' component={ProfileEmployeePageView}
        options={{//header:(props) => <HeaderComponent{...props}/>
         headerShown: true,
         headerTitle: 'Риэлтор',   
      }}/>

      <Stack.Screen name='SearchMap' component={SearchMap}
      options={{//header:(props) => <HeaderComponent{...props}/>
       headerShown: true,
       headerTitle: 'Поиск по карте',  
      }}/>
          
      </Stack.Navigator>
  );
}

const AppTabs = () => {
  return(
    <Tab.Navigator initialRouteName='Home' backBehavior='history'>
      <Tab.Screen
        name='Поиск' 
        component={SearchPostsStack} 
        options={{
          headerShown:false,
          headerTitle: ' ',   // текст заголовка скрыт
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size}) => (
            <FontAwesome name="search" size={24} color="black" />
        )
      }}
        />
      <Tab.Screen 
        name='Favourites' 
        component={FavouritesPage}
        options={{
          headerShown:true,
          headerTitle: 'Избранное',  
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size}) => (
            <Fontisto name="favorite" size={24} color="black" />
        ),
      }}
        />
      <Tab.Screen 
        name='Home'
        component={AppStack}
        options={{
          headerShown:false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size}) => (
            <FontAwesome name="home" size={24} color="black" />
        ),
      }}
        />
      <Tab.Screen
      name='Чаты'
      component={NotExistPage}
      options={{
        headerShown:false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size}) => (
          <Entypo name="chat" size={24} color="black" />
      ),
    }}
      />
      <Tab.Screen
      name='Профиль'
      component={StackProfile}
      options={{
        headerShown:false,
        tabBarShowLabel: true,
        tabBarIcon: ({ color, size}) => (
          <MaterialIcons name="account-box" size={24} color="black" />
      ),
    }}
      />
    </Tab.Navigator>
  )
  
}

const AppAuthStack = () => {
  return (
    <AuthStack.Navigator initialRouteName='Login'>
      <AuthStack.Screen name='Login' component={LoginPage}
      options={{
        headerShown: false  
      }}/>

      <AuthStack.Screen name='Register' component={RegisterPage}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Регистрация',  
        ...(Platform.OS === 'ios' && {
        headerLeft: () => (
          <Pressable  onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
          <Text style={{fontSize: 17, letterSpacing: -0.43, lineHeight: 22, color: '#007AFF'}}>Назад</Text>
          </Pressable>
      )
    }),
  })}
/>

      <AuthStack.Screen name='LoginEntry' component={UserLoginPage}
      options={({ navigation }) => ({
        headerShown: true,
        headerTitle: 'Авторизация', 
        ...(Platform.OS === 'ios' && {
        headerLeft: () => (
          <Pressable  onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
          <Text style={{fontSize: 17, letterSpacing: -0.43, lineHeight: 22, color: '#007AFF'}}>Назад</Text>
          </Pressable>
      )
    }),
  })}
/>

      <AuthStack.Screen name='ConfirmationPage' component={ConfirmationPage}
      options={{
        headerShown: false  
      }}/>

      <AuthStack.Screen name='PersonalData' component={PersonalData}
      options={{
        headerShown: false  
      }}/>

    </AuthStack.Navigator>
  )
}

const AppTopStack = () => {
  return(
    <TopStack.Navigator initialRouteName='Tabs'>
      <TopStack.Screen name="Tabs" component={AppTabs} options={{
        headerShown: false  
      }}/>
      <TopStack.Screen name='Errors' component={Errors} options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 
    </TopStack.Navigator>
  )
}

// Условный рендер в зависимости от того авторизирован ли пользователь или нет
const AppInit = () => {
  const {isAuth, isOnboarded} = useAuth()

  const [loaded, error] = useFonts({
    'Montserrat400': require('./assets/fonts/Inter_18pt-Regular.ttf') ,
    'Montserrat500': require('./assets/fonts/Inter_18pt-Medium.ttf') ,
    'Montserrat700': require('./assets/fonts/Montserrat-Bold.ttf') ,
    'Inter400': require('./assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter500': require('./assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter700': require('./assets/fonts/Inter_18pt-Bold.ttf'),
  })
  if (loaded) {
    SplashScreen.hide()


    // Проверка зарегистрирован ли пользователь
    if (!isAuth) {
      return (
        <AppAuthStack/>
      )
    }
    /* // Проверка проведён ли пользователь через "онбординг"
    if (!isOnboarded) {
      return (
        <OnboardingStack.Navigator initialRouteName='Onboarding'>
          <OnboardingStack.Screen name='Onboarding' component={OnboardingPage}/>
        </OnboardingStack.Navigator>
      )
    } */
    if (/* isOnboarded &&  */isAuth) {
      return (
        <AppTopStack/>
      )
    }
  }

  
  
}
///



// Корневой (Root) компонент
export default function App() {

  // useEffect(() => {
  //   if (Yamap && typeof Yamap.init === 'function') {
  //     Yamap.init('d2dd4e6a-fb92-431b-a6db-945e7e96b17c'); // Ваш API-ключ
  //     Yamap.setLocale('ru_RU'); // Устанавливаем русский язык
  //   } else {
  //     console.error("Yamap не инициализирован");
  //   }
  // }, []);

  return (
    <ApiProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppInit/>      
        </NavigationContainer>
      </AuthProvider>
    </ApiProvider>
      
  );
}

