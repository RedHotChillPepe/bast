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




const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator()
const OnboardingStack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()



/// Объявление доступных страниц, навигация (возможно стоит в отдельный компонент)
const AppStack = () => {
  return(
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name='Main' component={MainPage} 
        options={{//header:(props) => <HeaderComponent{...props}/>
        headerShown: false  
        }}/>
        <Stack.Screen name='Houses' component={DynamicHousesPage}/>
        <Stack.Screen name='House' component={DynamicHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
        <Stack.Screen name='CreateHousePostPage' component={CreateHousePostPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false  
          }}/>
      </Stack.Navigator>
  );
}

const AppTabs = () => {
  return(
    <Tab.Navigator initialRouteName='Home'>
      <Tab.Screen name='Search' component={SearchPage}/>
      <Tab.Screen name='Favourites' component={FavouritesPage}/>
      <Tab.Screen name='Home' component={AppStack} options={{headerShown:false}}/>
      <Tab.Screen name='Chats' component={ChatsPage}/>
      <Tab.Screen name='Profile' component={ProfilePage}/>
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

  // Проверка зарегистрирован ли пользователь
  
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

