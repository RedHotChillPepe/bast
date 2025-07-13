import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChevronRight from "../assets/svg/ChevronRight.js";
import PencilIcon from "../assets/svg/EditPencil.js";
import FoldersIcon from "../assets/svg/Folders.js";
import { HeartIcon } from "../assets/svg/HeartIcon.js";
import { HouseCheckIcon } from "../assets/svg/HouseCheckIcon.js";
import { ArchiveIcon } from "../assets/svg/Profile/ArchiveIcon.js";
import { ExitIcon } from "../assets/svg/Profile/ExitIcon";
import { FileIcon } from "../assets/svg/Profile/FileIcon.js";
import { HouseCloseIcon } from "../assets/svg/Profile/HouseCloseIcon.js";
import { HouseProfileIcon } from "../assets/svg/Profile/HouseProfileIcon.js";
import { ReferallIcon } from "../assets/svg/Profile/ReferallIcon.js";
import { SettingsIcon } from "../assets/svg/Profile/SettingsIcon.js";
import UserRating from "../components/UserRating.js";
import { useAuth } from "../context/AuthContext.js";
import { useTheme } from "../context/ThemeContext";
import ChangeAccountTypeModal from "./ChangeAccountTypePage";
import ReferralListPage from "./ReferralPrograms/ReferralListPage";
import UserRequestPage from "./Requests/UserRequestPage.js";
import UserTeamsPage from "./Teams/UserTeamsPage";

const { width } = Dimensions.get("window");

export default function UserProfilePage({ user, setUser }) {
  const { theme } = useTheme();
  const styles = makeStyle(theme);

  const { logout } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [showModalTeams, setShowModalTeams] = useState(false);
  const [showModalRequest, setShowModalRequest] = useState(false);
  const [showModalReferral, setShowModalReferral] = useState(false);
  const [showModalChangeType, setShowModalChangeType] = useState(false);

  const [isDeal, setIsDeal] = useState(false);

  // Массив данных для списков
  const sections = [
    {
      title: "Основные",
      data: [
        {
          icon: <FileIcon />,
          label: "Мои документы",
          navigation: ["Error", { errorCode: 2004 }],
        },
      ],
    },
    {
      title: "Объявления",
      data: [
        {
          icon: <HouseProfileIcon color={theme.colors.accent} />,
          label: "Мои объявления",
          navigation: ["UserPostsPage", { user_id: user.id, status: 1 }],
        },
        {
          icon: <HeartIcon color={theme.colors.accent} />,
          label: "Избранное",
          navigation: ["Favourites"],
        },
        {
          icon: <HouseCloseIcon />,
          label: "Закрытые объявления",
          navigation: ["UserPostsPage", { user_id: user.id, status: 3 }],
        },
        {
          icon: <ArchiveIcon />,
          label: "Корзина объявлений",
          navigation: ["UserPostsPage", { user_id: user.id, status: -1 }],
        },
      ],
    },
    {
      title: "Заявки",
      data: [
        {
          icon: <FoldersIcon />,
          label: "Заявки",
          handlePress: () => {
            setShowModalRequest(true);
            setIsDeal(false);
          },
        },
      ],
    },
    {
      title: "Сделки",
      data: [
        {
          icon: <HouseCheckIcon />,
          label: "Сделки",
          handlePress: () => {
            setShowModalRequest(true);
            setIsDeal(true);
          },
        },
      ],
    },
    {
      title: "Реферальная программа",
      data: [
        {
          icon: <ReferallIcon />,
          label: "Реферальная программа",
          handlePress: () => setShowModalReferral(true),
        },
      ],
    },
    {
      title: "Настройки",
      data: [
        {
          icon: <SettingsIcon />,
          label: "Настройки",
          navigation: ["SettingsPage", { userObject: user, usertype: 1 }],
        },
      ],
    },
    ...((!user?.hasActiveRealtorRequest ?? false) && user.usertype == 1
      ? [
          {
            title: "Стать риелтором",
            data: [
              {
                icon: <ReferallIcon color={theme.colors.white} />,
                label: "Стать риелтором",
                handlePress: () => setShowModalChangeType(true),
              },
            ],
            style: {
              item: {
                backgroundColor: theme.colors.accent,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              },
              itemText: {
                ...theme.typography.regular("white"),
                marginLeft: 12,
              },
              itemBlock: { backgroundColor: theme.colors.accent },
              chevronColor: theme.colors.white,
            },
          },
        ]
      : []),
  ];

  const renderPeople = () => {
    return (
      <View style={styles.nameBlock}>
        <View
          style={{
            flexDirection: "row",
            width: width - 32,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              flexDirection: "row",
              columnGap: 4,
              alignItems: "center",
            }}
            onPress={logout}
          >
            <ExitIcon />
            <Text style={theme.typography.regular("accent")}>Выйти</Text>
          </TouchableOpacity>
          <View
            style={{
              width: width - 68,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "16",
            }}
          >
            {Object.keys(user).length != 0 && user.photo != undefined ? (
              <Image
                style={{
                  overflow: "hidden",
                  borderRadius: 150 / 2,
                  alignSelf: "center",
                }}
                width={100}
                height={100}
                source={{ uri: user.photo }}
              />
            ) : (
              <FontAwesome6 name="face-tired" size={56} color="black" />
            )}
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ChangeAvatarPage", {
                userObject: user,
                usertype,
              })
            }
          >
            <PencilIcon />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", marginTop: 16 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={theme.typography.title2}>
              {user.name != undefined && user.surname != undefined
                ? `${user.name} ${user.surname}`
                : "Name Surname"}
            </Text>
            <UserRating rating={user?.rating ?? 0} />
            <View style={{ rowGap: 4 }}>
              <Text style={theme.typography.caption}>
                {user.email ?? "mail@example.com"}
              </Text>
              <Text style={theme.typography.caption}>
                {user.phone != undefined
                  ? user.phone.replace(
                      /^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/,
                      "+7 ($2) $3-$4-$5"
                    )
                  : "+ 7 (xxx) xxx xx xx"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = (item, index, sectionStyle) => (
    <TouchableOpacity
      onPress={() => {
        if (!item.navigation) {
          item.handlePress();
        } else if (Array.isArray(item.navigation)) {
          navigation.navigate(item.navigation[0], item.navigation[1]);
        } else {
          navigation.navigate(item.navigation);
        }
      }}
      key={index}
      style={sectionStyle?.item ?? styles.listItem}
    >
      <View style={styles.listItemContent}>
        {item.icon}
        <Text style={sectionStyle?.itemText ?? styles.itemText}>
          {item.label}
        </Text>
      </View>
      <ChevronRight color={sectionStyle?.chevronColor ?? theme.colors.accent} />
    </TouchableOpacity>
  );

  const renderSections = () => {
    return sections.map((section, index) => (
      <View style={[styles.itemBlock, section.style?.itemBlock]} key={index}>
        {section.data.map((item, idx) => renderItem(item, idx, section.style))}
      </View>
    ));
  };

  const renderModal = () => {
    return (
      <View>
        <Modal visible={showModalRequest} animationType="slide">
          <UserRequestPage
            user={user}
            handleClose={() => setShowModalRequest(false)}
            isDeal={isDeal}
          />
        </Modal>
        <Modal visible={showModalTeams} animationType="slide">
          <UserTeamsPage
            handleClose={() => setShowModalTeams(false)}
            currentUser={user}
          />
        </Modal>
        <Modal visible={showModalReferral} animationType="slide">
          <ReferralListPage handleClose={() => setShowModalReferral(false)} />
        </Modal>
        <Modal
          visible={showModalChangeType}
          animationType="slide"
          onRequestClose={() => setShowModalChangeType(false)}
        >
          <ChangeAccountTypeModal
            handleClose={() => setShowModalChangeType(false)}
            setUser={setUser}
          />
        </Modal>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: theme.colors.background,
      }}
    >
      <ScrollView contentContainerStyle={theme.container}>
        {renderPeople()}
        {renderSections()}
      </ScrollView>
      {renderModal()}
    </View>
  );
}

const makeStyle = (theme) =>
  StyleSheet.create({
    nameBlock: {
      marginBottom: 15,
      alignItems: "center",
      justifyContent: "space-between",
      alignSelf: "center",
    },
    itemBlock: {
      backgroundColor: theme.colors.block,
      borderRadius: 12,
      padding: 8,
      marginTop: 10,
      rowGap: 8,
    },
    listItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    listItemContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    itemText: {
      ...theme.typography.regular,
      marginLeft: 12,
    },
  });
