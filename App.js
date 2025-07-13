import { AntDesign, Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  useNavigation,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { AppState, Platform, Pressable, Text } from "react-native";
import { Geocoder, YaMap } from "react-native-yamap";
import HeaderComponent from "./components/HeaderComponent";
import Loader from "./components/Loader";
import ApiProvider from "./context/ApiContext";
import AuthProvider, { useAuth } from "./context/AuthContext";
import { LoggerProvider } from "./context/LoggerContext";
import ToastProvider from "./context/ToastProvider";
import usePresenceSocket from "./hooks/usePresenceSocket";
import ChangeAvatarPage from "./pages/ChangeAvatarPage.js";
import ChatListScreen from "./pages/Chats/ChatListScreen";
import ChatScreen from "./pages/Chats/ChatScreen";
import ConfirmChangePhonePage from "./pages/ConfirmChangePhonePage";
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
import RegisterTypeUserPage from "./pages/Register/RegisterTypeUserPage";
import RegisterPage from "./pages/RegisterPage";
import SearchMap from "./pages/SearchMap.js";
import SettingsPage from "./pages/SettingsPage.js";
import TeamJoinRequestScreen from "./pages/Teams/TeamJoinRequestScreen";
import TeamPage from "./pages/Teams/TeamPage";
import UserTeamsPage from "./pages/Teams/UserTeamsPage";
import UserLoginPage from "./pages/UserLoginPage.js";
import UserPostsPage from "./pages/UserPostsPage.js";
import { FavoritesProvider } from "./context/FavoritesContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserResetPassword from "./pages/UserResetPassword";
import { HeartIcon } from "./assets/svg/Tabbar/HeartIcon";
import { SearchIcon } from "./assets/svg/Tabbar/SearchIcon";
import { CommunicationIcon } from "./assets/svg/Tabbar/CommunicationIcon";
import { UserIcon } from "./assets/svg/Tabbar/UserIcon";
import { HouseIcon } from "./assets/svg/Tabbar/HouseIcon";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationsContext.js";
import RestoreAndDeleteProfile from "./pages/RestoreAndDeleteProfile.js";
import { ShareProvider } from "./context/ShareContext.js";

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const TeamStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
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
          headerShown: false,
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

      <ProfileStack.Screen
        name="MortgageCalculator"
        component={MortgageCalculator}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />

      <ProfileStack.Screen
        name="ChangeAvatarPage"
        component={ChangeAvatarPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: true,
          headerTitle: "Редактирование профиля",
        }}
      />

      <ProfileStack.Screen
        name="ConfirmPhone"
        component={ConfirmChangePhonePage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />

      <ProfileStack.Screen
        name="Team"
        component={StackTeam}
        options={{
          headerShown: false,
        }}
      />
    </ProfileStack.Navigator>
  );
};

const StackTeam = () => {
  return (
    <TeamStack.Navigator initialRouteName="UserTeams">
      <TeamStack.Screen
        name="Team"
        component={TeamPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
      <TeamStack.Screen
        name="UserTeams"
        component={UserTeamsPage}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
      <TeamStack.Screen
        name="TeamJoin"
        component={TeamJoinRequestScreen}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
    </TeamStack.Navigator>
  );
};
const StackChats = () => {
  return (
    <ChatStack.Navigator initialRouteName="ChatList">
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
      <ChatStack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
    </ChatStack.Navigator>
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
      <Stack.Screen
        name="Auth"
        component={AppAuthStack}
        options={{
          //header:(props) => <HeaderComponent{...props}/>
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F2F2F7",
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: insets.bottom + 8, // Динамический отступ снизу
          height: 60 + insets.bottom, // Учет нижнего отступа
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
        tabBarActiveTintColor: "#2C88EC", // Цвет иконки и текста, если вкладка активна
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
          tabBarIcon: ({ color, size }) => <HouseIcon color={color} />,
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
          tabBarIcon: ({ color, size }) => <HeartIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Поиск"
        component={SearchPostsStack}
        options={{
          headerShown: false,
          headerTitle: " ", // текст заголовка скрыт
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => <SearchIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Чаты"
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => <CommunicationIcon color={color} />,
        }}
        component={StackChats}
      ></Tab.Screen>
      <Tab.Screen
        name="Профиль"
        component={StackProfile}
        options={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => <UserIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppAuthStack = ({ isDeleted = false }) => {
  return (
    <AuthStack.Navigator
      initialRouteName={isDeleted ? "RestoreProfile" : "Login"}
    >
      <AuthStack.Screen
        name="Login"
        component={LoginPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="RegisterSelectType"
        component={RegisterTypeUserPage}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="RestoreProfile"
        component={RestoreAndDeleteProfile}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name="Главная"
        component={MainPage}
        options={{
          header: (props) => <HeaderComponent {...props} />,
        }}
      />
      <AuthStack.Screen
        name="Register"
        component={RegisterPage}
        options={({ navigation }) => ({
          headerShown: false,
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
          headerShown: false,
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
        name="ResetPassword"
        component={UserResetPassword}
        options={({ navigation }) => ({
          headerShown: false,
          headerTitle: "Сброс пароля",
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
  const { isAuth, isOnboarded, tokenIsLoaded, setReferralToken, isDeleted } =
    useAuth();
  const { isConnected, setOnlineStatus } = usePresenceSocket();

  const [loaded] = useFonts({
    Montserrat400: require("./assets/fonts/Inter_18pt-Regular.ttf"),
    Montserrat500: require("./assets/fonts/Inter_18pt-Medium.ttf"),
    Montserrat700: require("./assets/fonts/Montserrat-Bold.ttf"),
    Inter400: require("./assets/fonts/Inter_18pt-Regular.ttf"),
    Inter500: require("./assets/fonts/Inter_18pt-Medium.ttf"),
    Inter700: require("./assets/fonts/Inter_18pt-Bold.ttf"),
    Sora400: require("./assets/fonts/Sora-Regular.ttf"),
    Sora500: require("./assets/fonts/Sora-Medium.ttf"),
    Sora700: require("./assets/fonts/Sora-Bold.ttf"),
  });

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active" && isAuth && !isDeleted) {
        setOnlineStatus(true);
      } else if (
        ((nextAppState === "background" || nextAppState === "inactive") &&
          isAuth) ||
        isDeleted
      ) {
        setOnlineStatus(false);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [isAuth, isConnected]);

  if (!loaded || !tokenIsLoaded) {
    return <Loader />;
  }

  SplashScreen.hide();

  return (
    <React.Fragment>
      <DeepLinkHandler setReferralToken={setReferralToken} />
      {isAuth && !isDeleted ? (
        <AppTopStack />
      ) : (
        <AppAuthStack isDeleted={isDeleted} />
      )}
    </React.Fragment>
  );

  /* // Проверка проведён ли пользователь через "онбординг"
  if (!isOnboarded) {
    return (
      <OnboardingStack.Navigator initialRouteName='Onboarding'>
        <OnboardingStack.Screen name='Onboarding' component={OnboardingPage} />
      </OnboardingStack.Navigator>
      )
    } */
};
///
const DeepLinkHandler = ({ setReferralToken }) => {
  const navigation = useNavigation();
  const [isReady, setIsReady] = React.useState(false);
  const [initialUrl, setInitialUrl] = React.useState(null);

  useEffect(() => {
    // Обработчик для ссылок, когда приложение уже открыто
    const handleDeepLink = ({ url }) => {
      if (!url) return;
      processUrl(url);
    };

    // Проверка начальной ссылки при запуске
    const getInitialUrl = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          setInitialUrl(url);
        }
      } catch (err) {
        console.error("Failed to get initial URL", err);
      } finally {
        setIsReady(true);
      }
    };

    getInitialUrl();
    const subscription = Linking.addEventListener("url", handleDeepLink);

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

    // Обработка приглашений по ссылке
    if (parsed.path?.includes("teams/join")) {
      const parts = parsed.path.split("/");
      const token = parts[parts.length - 1];
      if (token) {
        navigation.navigate("Профиль", {
          screen: "Team",
          params: {
            screen: "TeamJoin",
            params: { token },
          },
        });
        return;
      }
    } else if (parsed.path?.includes("user/join")) {
      const parts = parsed.path.split("/");
      const token = parts[parts.length - 1];
      if (token) {
        setReferralToken(token);
        console.log("referral");
      }
      return;
    }

    // Обработка новых ссылок типа /posts/15, /villages/42, /profile/7
    const pathSegments = parsed.path?.split("/") || [];
    if (pathSegments.length == 0) {
      navigation.navigate("Main");
      return;
    }

    const [type, id] = pathSegments.slice(-2);
    console.info(pathSegments.slice(-2));
    if (!id) {
      navigation.navigate("Main");
      return;
    }

    switch (type) {
      case "posts":
        navigation.navigate("House", {
          houseId: id,
          timestamp: Date.now(),
        });
        break;
      case "villages":
        navigation.navigate("Village", {
          villageId: id,
          timestamp: Date.now(),
        });
        break;
      case "profile":
        navigation.navigate("ProfilePageView", {
          posterId: id,
          timestamp: Date.now(),
        });
        break;
      default:
        navigation.navigate("Main");
    }
  };
};

// Корневой (Root) компонент
export default function App() {
  useEffect(() => {
    setBackgroundColorAsync("#F2F2F7").catch(console.error); // Устанавливаем цвет фона
  }, []);

  process.env.NODE_ENV !== "development" &&
    useEffect(() => {
      if (YaMap && typeof YaMap.init === "function") {
        YaMap.init("d2dd4e6a-fb92-431b-a6db-945e7e96b17c"); // Ваш API-ключ
        // YaMap.setLocale('ru_RU'); // Устанавливаем русский язык
      } else {
        console.error("Yamap не инициализирован");
      }
    }, []);

  const linking = {
    prefixes: [
      "https://win-e5oqtj6uhak.tailb0dc72.ts.net",
      "https://ilia-work.tailb0dc72.ts.net/",
      "myapp://",
      Linking.createURL("/"),
    ],
    config: {
      screens: {
        Tabs: {
          screens: {
            Home: {
              screens: {
                House: {
                  path: "share/post",
                  parse: {
                    id: (id) => id.toString(),
                  },
                  stringify: {
                    id: (id) => id.toString(),
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", () => {
      const currentRoute = navigationRef.getCurrentRoute();
      if (currentRoute) {
        console.warn("Текущий экран:", currentRoute.name);
      } else {
        console.warn("Текущий экран пока не определён");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <ApiProvider>
      <AuthProvider>
        <ToastProvider>
          <LoggerProvider>
            <NavigationContainer ref={navigationRef} linking={linking}>
              <FavoritesProvider>
                <ThemeProvider>
                  <NotificationProvider>
                    <ShareProvider>
                      <AppInit />
                    </ShareProvider>
                  </NotificationProvider>
                </ThemeProvider>
              </FavoritesProvider>
            </NavigationContainer>
          </LoggerProvider>
        </ToastProvider>
      </AuthProvider>
    </ApiProvider>
  );
}
