import { AntDesign, Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as Linking from 'expo-linking';
import { setBackgroundColorAsync } from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform, Pressable, Text } from "react-native";
import { Geocoder, YaMap } from "react-native-yamap";
import HeaderComponent from "./components/HeaderComponent";
import ApiProvider from "./context/ApiContext";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { LoggerProvider } from './context/LoggerContext';
import ToastProvider from "./context/ToastProvider";
import ChangeAvatarPage from "./pages/ChangeAvatarPage.js";
import ConfirmChangePhonePage from './pages/ConfirmChangePhonePage';
import ConfirmDeleteProfilePage from './pages/ConfirmDeleteProfilePage';
import ConfirmationPage from "./pages/ConfirmationPage.js";
import CreateHousePostPage from "./pages/CreateHousePostPage.js";
import DynamicHousePostPage from "./pages/DynamicHousePostPage";
import DynamicHousesPage from "./pages/DynamicHousesPage";
import DynamicStoriesPage from "./pages/DynamicStoriesPage.js";
import { DynamicVillagePostPage } from "./pages/DynamicVillagePostPage";
import EditHousePostPage from "./pages/EditHousePostPage.js";
import ErrorScreen from "./pages/ErrorScreen";
import FavouritesPage from "./pages/FavouritesPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import MortgageCalculator from "./pages/MortgageCalculator.js";
import PersonalData from "./pages/PersonalDataPage.js";
import ProfileCompanyPageView from "./pages/ProfileCompanyPageView.js";
import ProfileEmployeePageView from "./pages/ProfileEmployeePageView.js";
import ProfilePage from "./pages/ProfilePage";
import ProfilePageView from "./pages/ProfilePageView.js";
import RegisterPage from "./pages/RegisterPage";
import SearchMap from "./pages/SearchMap.js";
import SettingsPage from "./pages/SettingsPage.js";
import UserLoginPage from "./pages/UserLoginPage.js";
import UserPostsPage from "./pages/UserPostsPage.js";

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const TopStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// process.env.NODE_ENV !== "development" && YaMap.init(process.env.EXPO_PUBLIC_YAMAP_API_KEY)
// Geocoder.init(process.env.EXPO_PUBLIC_GEOCODER_API_KEY);
// YaMap.init("d2dd4e6a-fb92-431b-a6db-945e7e96b17c")
Geocoder.init("d4e0fa5b-61fc-468d-886c-31740a78b323");

const SearchPostsStack = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SearchScreen"
    >
      <SearchStack.Screen
        name="SearchScreen"
        component={DynamicHousesPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "",
        }}
      />

      <SearchStack.Screen
        name="House"
        component={DynamicHousePostPage}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: "",
          ...(Platform.OS === "ios" && {
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={22}
                  color="#007AFF"
                />
                <Text
                  style={{
                    fontSize: 17,
                    letterSpacing: -0.43,
                    lineHeight: 22,
                    color: "#007AFF",
                  }}
                >
                  Назад
                </Text>
              </Pressable>
            ),
          }),
        })}
      />

      <SearchStack.Screen
        name="SearchMap"
        component={SearchMap}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
          headerTitle: "Поиск по карте",
        }}
      />

      <SearchStack.Screen
        name="EditHousePostPage"
        component={EditHousePostPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
          headerTitle: "Редактирование объявления",
        }}
      />

      <SearchStack.Screen
        name="ProfilePageView"
        component={ProfilePageView}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Частное лицо",
        }}
      />
    </SearchStack.Navigator>
  );
};

const StackProfile = () => {
  return (
    <ProfileStack.Navigator initialRouteName="Profile">
      <ProfileStack.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
      <ProfileStack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Настройки",
        }}
      />

      <ProfileStack.Screen
        name="UserPostsPage"
        component={UserPostsPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Мои объявления",
        }}
      />

      <ProfileStack.Screen name='MortgageCalculator' component={MortgageCalculator}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false
        }} />

      <ProfileStack.Screen name='ChangeAvatarPage' component={ChangeAvatarPage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: 'Редактирование профиля'
        }} />

      <ProfileStack.Screen name='ConfirmPhone' component={ConfirmChangePhonePage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }} />

      <ProfileStack.Screen name='ConfirmDeletion' component={ConfirmDeleteProfilePage}
        options={{//header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }} />
    </ProfileStack.Navigator>
  );
};

/// Объявление доступных страниц, навигация (возможно стоит в отдельный компонент)
const AppStack = () => {
  return (
    <Stack.Navigator initialRouteName="Main" backBehavior="history">
      <Stack.Screen
        name="Main"
        component={MainPage}
        options={{
          header: (props) => <HeaderComponent {...props} />,
        }}
      />

      <Stack.Screen
        name="House"
        component={DynamicHousePostPage}
        options={({ navigation }) => ({
          // headerShown: true,
          headerShown: false,
          // headerTitle: "",
          // headerLeft: () => (
          //   <Pressable
          //     onPress={() => navigation.goBack()}
          //     style={{ flexDirection: "row", alignItems: "center" }}
          //   >
          //     <MaterialIcons name="arrow-back-ios" size={22} color="#007AFF" />
          //   </Pressable>
          // ),
        })}
      />
      <Stack.Screen
        name="Village"
        component={DynamicVillagePostPage}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />

      <Stack.Screen
        name="UserPostsPage"
        component={UserPostsPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Мои объявления",
        }}
      />
      <Stack.Screen
        name="CreateHousePostPage"
        component={CreateHousePostPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditHousePostPage"
        component={EditHousePostPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MortgageCalculator"
        component={MortgageCalculator}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DynamicStoriesPage"
        component={DynamicStoriesPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProfilePageView"
        component={ProfilePageView}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Частное лицо",
        }}
      />

      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Настройки",
        }}
      />
      <Stack.Screen
        name="ConfirmationPage"
        component={ConfirmationPage}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ProfileCompanyPageView"
        component={ProfileCompanyPageView}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Компания",
        }}
      />

      <Stack.Screen
        name="ProfileEmployeePageView"
        component={ProfileEmployeePageView}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Риелтор",
        }}
      />

      <Stack.Screen
        name="SearchMap"
        component={SearchMap}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Поиск по карте",
        }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F2F2F7",     // Цвет фона
          paddingHorizontal: 12,       // Горизонтальные отступы
          paddingTop: 12,               // Отступ сверху
          height: 60,
          borderTopStartRadius: 12,
          borderTopEndRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 12.6,
          fontFamily: "Sora400",
          letterSpacing: -0.3,
          fontWeight: "400",
        },
        tabBarActiveTintColor: "#2C88EC",  // Цвет иконки и текста, если вкладка активна
        tabBarInactiveTintColor: "#808080", // Цвет, если вкладка не активна}
      }}
    >
      <Tab.Screen
        name="Home"
        component={AppStack}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabel: "Главная",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesPage}
        options={{
          headerShown: true,
          tabBarShowLabel: true,
          headerTitle: "Избранное",
          tabBarLabel: "Избранное",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Поиск"
        component={SearchPostsStack}
        options={{
          headerShown: false,
          headerTitle: " ", // текст заголовка скрыт
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="search1" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Чаты"
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      >
        {() => <ErrorScreen route={{ params: { errorCode: 2004 } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="Профиль"
        component={StackProfile}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator >
  );
};

const AppAuthStack = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={LoginPage}
        options={{
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name="Register"
        component={RegisterPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Регистрация",
          ...(Platform.OS === "ios" && {
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={22}
                  color="#007AFF"
                />
                <Text
                  style={{
                    fontSize: 17,
                    letterSpacing: -0.43,
                    lineHeight: 22,
                    color: "#007AFF",
                  }}
                >
                  Назад
                </Text>
              </Pressable>
            ),
          }),
        })}
      />

      <AuthStack.Screen
        name="LoginEntry"
        component={UserLoginPage}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "Авторизация",
          ...(Platform.OS === "ios" && {
            headerLeft: () => (
              <Pressable
                onPress={() => navigation.goBack()}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <MaterialIcons
                  name="arrow-back-ios"
                  size={22}
                  color="#007AFF"
                />
                <Text
                  style={{
                    fontSize: 17,
                    letterSpacing: -0.43,
                    lineHeight: 22,
                    color: "#007AFF",
                  }}
                >
                  Назад
                </Text>
              </Pressable>
            ),
          }),
        })}
      />

      <AuthStack.Screen
        name="ConfirmationPage"
        component={ConfirmationPage}
        options={{
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name="PersonalData"
        component={PersonalData}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const AppTopStack = () => {
  return (
    <TopStack.Navigator initialRouteName="Tabs">
      <TopStack.Screen
        name="Tabs"
        component={AppTabs}
        options={{
          headerShown: false,
        }}
      />
      <TopStack.Screen
        name="Error"
        component={ErrorScreen}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
    </TopStack.Navigator>
  );
};

// Условный рендер в зависимости от того авторизирован ли пользователь или нет
const AppInit = () => {
  const { isAuth, isOnboarded } = useAuth();

  setBackgroundColorAsync("#F2F2F7");
  const [loaded] = useFonts({
    Montserrat400: require("./assets/fonts/Inter_18pt-Regular.ttf"),
    Montserrat500: require("./assets/fonts/Inter_18pt-Medium.ttf"),
    Montserrat700: require("./assets/fonts/Montserrat-Bold.ttf"),
    Inter400: require("./assets/fonts/Inter_18pt-Regular.ttf"),
    Inter500: require("./assets/fonts/Inter_18pt-Medium.ttf"),
    Inter700: require("./assets/fonts/Inter_18pt-Bold.ttf"),
    Sora400: require('./assets/fonts/Sora-Regular.ttf'),
    Sora500: require('./assets/fonts/Sora-Medium.ttf'),
    Sora700: require('./assets/fonts/Sora-Bold.ttf'),
  });

  if (!loaded) {
    return;
  }

  SplashScreen.hide();

  // Проверка зарегистрирован ли пользователь
  if (!isAuth) {
    return <AppAuthStack />;
  }

  /* // Проверка проведён ли пользователь через "онбординг"
  if (!isOnboarded) {
    return (
      <OnboardingStack.Navigator initialRouteName='Onboarding'>
      <OnboardingStack.Screen name='Onboarding' component={OnboardingPage}/>
      </OnboardingStack.Navigator>
      )
    } */

  if (/* isOnboarded &&  */ isAuth) {
    return <React.Fragment>
      <DeepLinkHandler />
      <AppTopStack />
    </React.Fragment>
  }
};
///
const DeepLinkHandler = () => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = React.useState(false);
  const [initialUrl, setInitialUrl] = React.useState(null);

  useEffect(() => {
    // Обработчик для ссылок, когда приложение уже открыто
    const handleDeepLink = ({ url }) => {
      if (!url) return;
      console.log('Deep link received:', url);
      processUrl(url);
    };

    // Проверка начальной ссылки при запуске
    const getInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          console.log('Initial URL:', url);
          setInitialUrl(url);
        }
      } catch (err) {
        console.error('Failed to get initial URL', err);
      } finally {
        setIsReady(true);
      }
    };

    getInitialUrl();
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isReady && initialUrl) {
      processUrl(initialUrl);
      setInitialUrl(null);
    }
  }, [isReady, initialUrl]);

  const processUrl = (url) => {
    const parsed = Linking.parse(url);
    console.log('Parsed URL:', parsed);
    if (!parsed.path?.includes('share') || !parsed.queryParams?.id || !parsed.queryParams?.type) {
      navigation.navigate('Main');
    }

    switch (parsed.queryParams.type) {
      case "post":
        navigation.navigate('House', {
          houseId: parsed.queryParams.id,
          timestamp: Date.now() // Добавляем timestamp для принудительного обновления
        });
        break;
      case "village":
        navigation.navigate('Village', {
          villageId: parsed.queryParams.id,
          timestamp: Date.now() // Добавляем timestamp для принудительного обновления
        });
        break;
      case "profile":
        navigation.navigate('ProfilePageView', {
          posterId: parsed.queryParams.id,
          timestamp: Date.now() // Добавляем timestamp для принудительного обновления
        });
        break;
    }

  };

  return null;
};

// Корневой (Root) компонент
export default function App() {
  process.env.NODE_ENV !== "development" &&
    useEffect(() => {
      if (YaMap && typeof YaMap.init === 'function') {
        YaMap.init('d2dd4e6a-fb92-431b-a6db-945e7e96b17c'); // Ваш API-ключ
        // YaMap.setLocale('ru_RU'); // Устанавливаем русский язык
      } else {
        console.error("Yamap не инициализирован");
      }
    }, []);

  const linking = {
    prefixes: [
      'https://win-e5oqtj6uhak.tailb0dc72.ts.net',
      'myapp://',
      Linking.createURL('/')
    ],
    config: {
      screens: {
        Tabs: {
          screens: {
            Home: {
              screens: {
                House: {
                  path: 'share/post',
                  parse: {
                    id: (id) => id.toString()
                  },
                  stringify: {
                    id: (id) => id.toString()
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return (
    <ApiProvider>
      <AuthProvider>
        <ToastProvider>
          <LoggerProvider>
            <NavigationContainer linking={linking} >
              <AppInit />
            </NavigationContainer>
          </LoggerProvider>
        </ToastProvider>
      </AuthProvider>
    </ApiProvider>
  );
}
