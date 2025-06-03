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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const SettingsPage = ({ navigation, route }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(route);
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

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Регион поиска</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Уведомления</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable style={styles.itemBlock}>
        <View style={styles.listItemContent}>
          <Text style={styles.itemText}>Оформление</Text>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </View>
      </Pressable>

      <Pressable
        onPress={() => setIsModalVisible(true)}
        style={styles.itemBlockDelete}
      >
        <View style={styles.listItemContent}>
          <Text style={styles.itemTextDelete}>Удалить профиль</Text>
          <Ionicons name="trash" size={24} color="white" />
        </View>
      </Pressable>
      <UniversalModal
        visible={isModalVisible}
        title={"Удалить профиль?"}
        message={"Полное удаление произойдет через 7 дней"}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleDelete}
      ></UniversalModal>
    </SafeAreaView>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#efefef",
  },
  nameBlock: {
    flexDirection: "row",
    width: width - 32,
    marginTop: 32,
    marginBottom: 24,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemBlock: {
    width: width - 32,
    backgroundColor: "#d6d6d6",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  itemBlockDelete: {
    width: width - 32,
    backgroundColor: "#d9534f",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 20,
    color: "#14080E",
  },
  itemTextDelete: {
    fontSize: 20,
    color: "white",
  },
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
