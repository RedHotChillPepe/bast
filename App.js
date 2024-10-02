import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import FavouritesPage from './pages/FavouritesPage';
import ChatsPage from './pages/ChatsPage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

// Объявление доступных страниц
const AppStack = () => {
  return(
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name='Main' component={MainPage} options={{
          title:'БАСТ'
        }}/>
      </Stack.Navigator>
  );
}
const AppTabs = () => {
  return(
    <Tab.Navigator>
      <Tab.Screen name='Search' component={SearchPage}/>
      <Tab.Screen name='Favourites' component={FavouritesPage}/>
      <Tab.Screen name='Home' component={AppStack} options={{headerShown:false}}/>
      <Tab.Screen name='Chats' component={ChatsPage}/>
      <Tab.Screen name='Profile' component={ProfilePage}/>
    </Tab.Navigator>
  )
  
}

// Корневой (Root) компонент
export default function App() {
  return (
    <NavigationContainer>
      <AppTabs/>      
    </NavigationContainer>
    
  );
}

