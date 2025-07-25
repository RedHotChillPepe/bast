import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  default as FontAwesome5,
  default as FontAwesome6,
} from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import UserTeamsPage from "./Teams/UserTeamsPage";
import { UserCardIcon } from "../assets/svg/UserCard";

const { width } = Dimensions.get("window");

const ProfileCompanyPage = ({ user }) => {
  const { logout, changePassword } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showTeamModal, setShowTeamModal] = useState(false);

  // Массив данных для списков
  const sections = [
    {
      title: "Команда",
      data: [
        {
          icon: (
            <FontAwesome6 name="house-circle-check" size={17} color="black" />
          ),
          label: "Компания",
          navigation: ["Error", { errorCode: 2004 }],
        },
        {
          icon: <Ionicons name="document-outline" size={17} color="black" />,
          label: "Команда",
          handlePress: () => setShowTeamModal(true),
        },
        {
          icon: <FontAwesome5 name="people-arrows" size={17} color="black" />,
          label: "Контрагенты",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Команда",
      data: [
        {
          icon: <Ionicons name="man-outline" size={17} color="black" />,
          label: "Клиенты",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Документы",
      data: [
        {
          icon: <Ionicons name="document-outline" size={17} color="black" />,
          label: "Документы",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Мои действия",
      data: [
        {
          icon: <FontAwesome6 name="list-alt" size={17} color="black" />,
          label: "Мои объявления",
          navigation: ["Error", { errorCode: 2004 }],
        },
        {
          icon: <Ionicons name="lock-closed-outline" size={20} color="black" />,
          label: "Закрытые объявления",
          navigation: ["UserPostsPage", { user_id: user.id, status: 3 }],
        },
        {
          icon: <Ionicons name="trash-bin-outline" size={20} color="black" />,
          label: "Корзина объявлений",
          navigation: ["UserPostsPage", { user_id: user.id, status: -1 }],
        },
        {
          icon: <AntDesign name="hearto" size={17} color="black" />,
          label: "Избранное",
          navigation: ["Favourites"],
        },
        {
          icon: <Ionicons name="search" size={17} color="black" />,
          label: "Поиски",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Дополнительные",
      data: [
        {
          icon: (
            <Ionicons name="notifications-outline" size={17} color="black" />
          ),
          label: "Уведомления",
          navigation: ["Error", { errorCode: 2004 }],
        },
        {
          icon: <Ionicons name="chatbox-outline" size={17} color="black" />,
          label: "Чат с поддержкой",
          navigation: ["Error", { errorCode: 2004 }],
        },
        {
          icon: <Ionicons name="calculator-outline" size={17} color="black" />,
          label: "Ипотечный калькулятор",
          navigation: ["MortgageCalculator"],
        },
        {
          icon: <Ionicons name="help-buoy-outline" size={17} color="black" />,
          label: "Справочный центр",
          navigation: ["Error", { errorCode: 2004 }],
        },
        {
          icon: <Ionicons name="help-circle-outline" size={17} color="black" />,
          label: "О приложении",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Настрйоки",
      data: [
        {
          icon: (
            <Ionicons name="notifications-outline" size={17} color="black" />
          ),
          label: "Настройки",
          navigation: ["SettingsPage", { userObject: user, usertype: 2 }],
        },
      ],
    },
  ];

  const renderItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.listItem}
      onPress={() => {
        if (!item.navigation) {
          item.handlePress();
        } else if (Array.isArray(item.navigation)) {
          navigation.navigate(item.navigation[0], item.navigation[1]);
        } else {
          navigation.navigate(item.navigation);
        }
      }}
    >
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={17} color="black" />
    </TouchableOpacity>
  );

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#9DC0F6" }}
    >
      <View style={styles.nameBlock}>
        <View style={{ flexDirection: "row" }}>
          {Object.keys(user).length != 0 && user.photo != undefined ? (
            <Image
              style={{ overflow: "hidden", borderRadius: 150 / 2 }}
              width={56}
              height={56}
              source={{ uri: user.photo }}
            />
          ) : (
            <FontAwesome6 name="face-tired" size={56} color="black" />
          )}
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.name}>
              {user.name != undefined ? user.name : "Company Name"}
            </Text>
            <Text style={styles.email}>
              {user.email != undefined ? user.email : "mail@example.com"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChangeAvatarPage", {
              userObject: user,
              usertype: 2,
            })
          }
        >
          <FontAwesome name="edit" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {sections.map((section, index) => (
          <View style={styles.itemBlock} key={index}>
            {/* <FlatList
            data={section.data}
            renderItem={renderItem}
            keyExtractor={(item, idx) => idx.toString()}
          /> */}

            {section.data.map((item, index) => renderItem(item, index))}
          </View>
        ))}

        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={[styles.itemText, styles.logoutText]}>Выйти</Text>
          <Ionicons name="exit-outline" size={24} color="#fff" />
        </TouchableOpacity>
        {/*       <View style={styles.buttonsRow}>
        <Button title="Физик" onPress={() => navigation.navigate('Профиль')} />
        <Button title="Риэлтор" onPress={() => navigation.navigate('ProfileRealtorPage')} />
        <Button title="Застройщик" onPress={() => navigation.navigate('ProfileBuilderPage')} />
      </View> */}
        {/* <View style={styles.buttonsRow}>
        <Button title="Компания внеш" onPress={() => navigation.navigate('ProfileCompanyPageView')} />
      </View>

      <View style={styles.buttonsRow}>
        <Button title="Logout" onPress={logout} />
        <Button title="404" onPress={() => navigation.navigate('Error404')} />
        <Button title="403" onPress={() => navigation.navigate('Error403')} />
        <Button title="500" onPress={() => navigation.navigate('Error500')} />
        <Button title="503" onPress={() => navigation.navigate('Error503')} />
      </View> */}
        {/* <Modal animationType="slide" visible={showTeamModal}><userequestPage user={user}  handleClose={() => setShowTeamModal(false)} /></Modal> */}
        <Modal animationType="slide" visible={showTeamModal}>
          <UserTeamsPage
            handleClose={() => setShowTeamModal(false)}
            currentUser={user}
          />
        </Modal>
      </ScrollView>
    </View>
  );
};

export default ProfileCompanyPage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#9DC0F6",
    paddingBottom: 32,
  },
  nameBlock: {
    alignSelf: "center",
    flexDirection: "row",
    width: width - 32,
    marginTop: 32,
    marginBottom: 24,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: "#fff",
    paddingTop: 11,
    paddingBottom: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginTop: 20,
    borderColor: "#54545630",
    borderWidth: 1,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 11,
    paddingBottom: 11,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.43,
    color: "#14080E",
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginTop: 32,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "500",
    marginRight: 8,
  },
  buttonsRow: {
    flexDirection: "row",
    marginVertical: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.6,
  },
});
