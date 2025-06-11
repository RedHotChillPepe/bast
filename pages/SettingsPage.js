import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import ChevronRight from "../assets/svg/ChevronRight";
import { LocationIcon } from "../assets/svg/LocationIcon";
import { NotificationIcon } from "../assets/svg/NotificationIcon";
import { DeleteCloseIcon } from "../assets/svg/DeleteCloseIcon";
import UniversalHeader from "../components/UniversalHeaderComponent";
import { UserCardIcon } from "../assets/svg/UserCard";
import { useAuth } from "../context/AuthContext";
import { ShieldIcon } from "../assets/svg/ShieldIcon";

const { width } = Dimensions.get("window");

const SettingsPage = ({ navigation, route }) => {
  const { changePassword } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const { userObject, usertype } = route.params;

  const userObjectt = {
    id: userObject.id,
    usertype: usertype,
    phoneNumber: userObject.phone,
  };

  const UniversalModal = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
  }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {title && <Text style={styles.modalTitle}>{title}</Text>}
            {message && <Text style={styles.modalMessage}>{message}</Text>}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={onCancel}
              >
                <Text style={styles.modalButtonText}>{cancelText}</Text>
              </TouchableOpacity>
              {onConfirm && (
                <TouchableOpacity
                  style={styles.modalButtonConfirm}
                  onPress={onConfirm}
                >
                  <Text style={styles.modalButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const handleDelete = () => {
    if (!userObject.phone) return;

    navigation.navigate("ConfirmationPage", {
      regData: { phoneNumber: userObject.phone },
      isDelete: true,
    });

    setIsModalVisible(false);
  };

  const listButton = [
    {
      id: 1,
      title: "Регоин поиска",
      onPress: () => {},
      icon: { left: <LocationIcon />, right: <ChevronRight /> },
    },
    {
      id: 2,
      title: "Уведомления",
      onPress: () => {},
      icon: { left: <NotificationIcon />, right: <ChevronRight /> },
    },
    {
      id: 3,
      title: "Сменить пароль",
      onPress: () => {
        changePassword(navigation, userObject.phone);
      },
      icon: {
        left: <ShieldIcon color={theme.colors.accent} />,
        right: <ChevronRight />,
      },
    },
    {
      id: 4,
      title: "Удалить профиль",
      onPress: () => {
        setIsModalVisible(true);
      },
      icon: { left: <DeleteCloseIcon />, right: <ChevronRight /> },
    },
  ];

  const renderButtons = () => {
    return (
      <View style={{ rowGap: 10, marginTop: 12 }}>
        {listButton.map((button) => (
          <TouchableOpacity
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              padding: 8,
              backgroundColor: theme.colors.block,
              borderRadius: 12,
            }}
            key={button.id}
            onPress={button.onPress}
          >
            <View
              style={{
                flexDirection: "row",
                columnGap: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {button.icon.left}
              <Text style={theme.typography.regular()}>{button.title}</Text>
            </View>
            {button.icon.right}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.colors.background}}>
      <View style={theme.container}>
        <UniversalHeader title="Настройки" typography="title2" />
        {renderButtons()}
        <UniversalModal
          visible={isModalVisible}
          title={"Удалить профиль?"}
          message={"Полное удаление произойдет через 7 дней"}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={handleDelete}
        ></UniversalModal>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = (theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "white",
      width: width - 32,
      borderRadius: 16,
      padding: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 16,
    },
    modalMessage: {
      fontSize: 16,
      marginBottom: 24,
    },
    modalButtonContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      gap: 12,
    },
    modalButtonCancel: {
      backgroundColor: "#ccc",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalButtonConfirm: {
      backgroundColor: "#007AFF",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    modalButtonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SettingsPage;
