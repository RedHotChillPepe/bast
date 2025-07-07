import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronRight from "../assets/svg/ChevronRight";
import { DeleteCloseIcon } from "../assets/svg/DeleteCloseIcon";
import { LocationIcon } from "../assets/svg/LocationIcon";
import { NotificationIcon } from "../assets/svg/NotificationIcon";
import { ShieldIcon } from "../assets/svg/ShieldIcon";
import { SuitCaseIcon } from "../assets/svg/SuitCaseIcon";
import UniversalHeader from "../components/UniversalHeaderComponent";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const SettingsPage = ({ navigation, route }) => {
  const { createRequestChangeUserType } = useApi();
  const { changePassword } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const [userObject, setUser] = useState(route.params.userObject);
  const setUserOriginal = route.params.setUser;
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    onConfirm: createRequestChangeUserType,
    errorMessage: "2323",
  });

  const UniversalModal = ({
    visible,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Подтвердить",
    cancelText = "Отмена",
    isLoading = false,
    errorMessage = "",
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
            <View>
              {title && <Text style={styles.modalTitle}>{title}</Text>}
              {isLoading ? (
                <ActivityIndicator style={styles.modalMessage} />
              ) : (
                <View>
                  {message && (
                    <Text style={styles.modalMessage}>{message}</Text>
                  )}
                  {errorMessage.length > 0 && (
                    <Text
                      style={[
                        styles.modalMessage,
                        theme.typography.errorText,
                        { textAlign: "center" },
                      ]}
                    >
                      {errorMessage}
                    </Text>
                  )}
                </View>
              )}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  disabled={isLoading}
                  style={[
                    styles.modalButtonCancel,
                    { opacity: isLoading ? 0.6 : 1 },
                  ]}
                  onPress={onCancel}
                >
                  <Text style={styles.modalButtonText}>{cancelText}</Text>
                </TouchableOpacity>
                {onConfirm && (
                  <TouchableOpacity
                    disabled={isLoading}
                    style={[
                      styles.modalButtonConfirm,
                      { opacity: isLoading ? 0.6 : 1 },
                    ]}
                    onPress={onConfirm}
                  >
                    <Text style={styles.modalButtonText}>{confirmText}</Text>
                  </TouchableOpacity>
                )}
              </View>
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

  const handleChangeType = async () => {
    try {
      setIsLoading(true);
      setModalData((prev) => ({ ...prev, errorMessage: "" }));
      const result = await createRequestChangeUserType();
      if (!result.success) throw result;
      console.log(result);
      setUser((prev) => ({ ...prev, hasActiveRealtorRequest: true }));
      setUserOriginal((prev) => ({ ...prev, hasActiveRealtorRequest: true }));
      setIsModalVisible(false);
    } catch (error) {
      console.log(error);
      setModalData((prev) => ({
        ...prev,
        errorMessage: error.message ?? "Произошла ошибка при создании заявки",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const listButton = [
    {
      id: 1,
      title: "Регион поиска",
      onPress: () => navigation.navigate("Error", { errorCode: 2004 }),
      icon: { left: <LocationIcon />, right: <ChevronRight /> },
    },
    {
      id: 2,
      title: "Уведомления",
      onPress: () => navigation.navigate("Error", { errorCode: 2004 }),
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
    ...((!userObject?.hasActiveRealtorRequest ?? false) &&
    userObject.usertype == 1
      ? [
          {
            id: 4,
            title: "Стать риелтором",
            onPress: () => {
              setModalData({
                title: "Стать риелтором",
                content: "Будет создана заявка на смену типа профиля",
                onConfirm: handleChangeType,
              });
              setIsModalVisible(true);
            },
            icon: { left: <SuitCaseIcon />, right: <ChevronRight /> },
          },
        ]
      : []),
    {
      id: 5,
      title: "Удалить профиль",
      onPress: () => {
        setModalData({
          title: "Удалить профиль?",
          content: `При удалении профиля будут безвозвратно удалены все ваши личные данные, объявления и переписки. Несохранённые данные восстановить будет невозможно.\n\nПолное удаление аккаунта произойдёт через 7 дней, вы уверены, что хотите удалить свой профиль?`,
          onConfirm: handleDelete,
        });
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
    <SafeAreaView style={Platform.OS == "ios" ? {} : theme.container}>
      <View style={{ paddingTop: Platform.OS == "ios" ? 0 : 32 }}>
        <UniversalHeader title="Настройки" typography="title2" />
        {renderButtons()}
        <UniversalModal
          visible={isModalVisible}
          title={modalData.title}
          message={modalData.content}
          onCancel={() => setIsModalVisible(false)}
          onConfirm={modalData.onConfirm}
          isLoading={isLoading}
          errorMessage={modalData.errorMessage}
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
