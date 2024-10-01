import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './pages/MainPage';

const Stack = createNativeStackNavigator();

// Объявление доступных страниц
const AppStack = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen name='Main' component={MainPage}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Корневой (Root) компонент
export default function App() {
  return (
    <AppStack/>
  );
}

