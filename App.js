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

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()
const OnboardingStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()



/// Объявление доступных страниц, навигация (возможно стоит в отдельный компонент)
const AppStack = () => {
  return(
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name='Main' component={MainPage} 
        options={{
          header:(props) => <HeaderComponent{...props}/>
        }}/>
        <Stack.Screen name='Houses' component={DynamicHousesPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        <Stack.Screen name='House' component={DynamicHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        <Stack.Screen name='CreateHousePostPage' component={CreateHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        <Stack.Screen name='EditHousePostPage' component={EditHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
          
        <Stack.Screen name='NotExistPage' component={NotExistPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>

        <Stack.Screen name='MortgageCalculator' component={MortgageCalculator}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>

        <Stack.Screen name='Error404' component={Error404}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <Stack.Screen name='Error403' component={Error403}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <Stack.Screen name='Error500' component={Error500}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 

        <Stack.Screen name='Error503' component={Error503}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/> 
        
        <Stack.Screen name='DynamicStoriesPage' component={DynamicStoriesPage}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: false  
            }}/>

        <Stack.Screen name='ProfilePageView' component={ProfilePageView}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: true  
            }}/>   

        <Stack.Screen name='SettingsPage' component={SettingsPage}
          options={{//header:(props) => <HeaderComponent{...props}/>
            headerShown: true  
          }}/> 

        <Stack.Screen name='ProfileCompanyPageView' component={ProfileCompanyPageView}
          options={{//header:(props) => <HeaderComponent{...props}/>
           headerShown: true  
        }}/>

        <Stack.Screen name='ProfileEmployeePageView' component={ProfileEmployeePageView}
        options={{//header:(props) => <HeaderComponent{...props}/>
         headerShown: true  
      }}/>
          
      </Stack.Navigator>
  );
}

const AppTabs = () => {
  return(
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen
        name='Поиск' 
        component={DynamicHousesPage} 
        options={{
          headerShown:true,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size}) => (
            <FontAwesome name="search" size={24} color="black" />
        ),
      }}
        />
      <Tab.Screen 
        name='Избранное' 
        component={FavouritesPage}
        options={{
          headerShown:true,
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
      name='Chats'
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
      component={ProfilePage}
      options={{
        // headerShown:false,
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
      options={{
        headerShown: false  
      }}/>

      <AuthStack.Screen name='LoginEntry' component={UserLoginPage}
      options={{
        headerShown: false  
      }}/>
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
    // Проверка проведён ли пользователь через "онбординг"
    if (!isOnboarded) {
      return (
        <OnboardingStack.Navigator initialRouteName='Onboarding'>
          <OnboardingStack.Screen name='Onboarding' component={OnboardingPage}/>
        </OnboardingStack.Navigator>
      )
    }
    if (isOnboarded && isAuth) {
      return (
        <AppTabs/>
      )
    }
  }

  
  
}
///



// Корневой (Root) компонент
export default function App() {
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

