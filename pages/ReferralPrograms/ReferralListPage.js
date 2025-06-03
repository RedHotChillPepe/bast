import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/svg/ChevronLeft";
import ShareIcon from "../../assets/svg/Share";
import { CreditCardIcon } from "../../assets/svg/CreditCard";
import { EditPencilLineIcon } from "../../assets/svg/EditPencilLineIcon";
import { QrCodeIcon } from "../../assets/svg/QrCode";
import { useApi } from "../../context/ApiContext";
import { useTheme } from "../../context/ThemeContext";
import TeamInvationPage from "../Teams/TeamInvationPage";
import EditCreditPage from "./EditCreditPage";
import CustomModal from "./../../components/CustomModal";
import ProfilePageView from "../ProfilePageView";

const ReferralListPage = (props) => {
  const { theme } = useTheme();
  const styles = makeStyle(theme);
  const navigation = useNavigation();

  const { handleClose } = props;
  const { getUserReferrals } = useApi();

  const [referrals, setReferrals] = useState({});
  const [selectedUser, setSelectedUser] = useState();
  const [cardNumber, setCardNumber] = useState("");
  const [formData, setFormData] = useState({ card_number: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [showModalUser, setShowModalUser] = useState(false);
  const [isShowModalQrCode, setIsShowModalQrCode] = useState(false);
  const [IsShowEditCredit, setIsShowEditCredit] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchReferrals();
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      setIsLoading(true);
      const result = await getUserReferrals();
      console.log(result);
      setCardNumber(result.card_number);
      setFormData((prev) => ({ ...prev, card_number: result.card_number }));
      setReferrals(result.users);
    } catch (error) {
      console.error(error);
      navigation.navigate("Error", {
        messageProp: "Ошибка при получении рефералов",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={handleClose}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.header__title}>Реферальная программа</Text>
        <Pressable onPress={() => setIsShowModalQrCode(true)}>
          <QrCodeIcon />
        </Pressable>
      </View>
    );
  };

  const renderCreditBLock = () => {
    return (
      <TouchableOpacity
        onPress={() => setIsShowEditCredit(true)}
        style={styles.credit__container}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={theme.typography.regularBold}>
            Счет для вознаграждений
          </Text>
          <EditPencilLineIcon />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.small,
          }}
        >
          <CreditCardIcon />
          <Text style={theme.typography.regular("caption")}>{cardNumber}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPeopleBlock = () => {
    return (
      <View style={{ flex: 1 }}>
        <Text style={theme.typography.title3("text", "start")}>
          Мои рефералы
        </Text>
        {isLoading ? (
          <View style={{ marginTop: theme.spacing.medium }}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            data={referrals}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{ flex: 1, marginTop: theme.spacing.medium }}
            contentContainerStyle={{ gap: 12 }}
            renderItem={(item) => renderPeople(item.item)}
            ListEmptyComponent={
              <Text style={theme.typography.caption}>У вас нет рефералов</Text>
            }
          />
        )}
      </View>
    );
  };

  const renderPeople = (item) => {
    return (
      <TouchableOpacity
        onPress={() => handleSelectedUser(item)}
        style={styles.people__item}
      >
        <Image
          style={styles.image}
          source={
            item?.photo
              ? { uri: item?.photo }
              : require("../../assets/placeholder.png")
          }
        />
        <View style={{ gap: 6, flex: 1 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={theme.typography.regularBold}>
              {item.name} {item.surname}
            </Text>
            {/* <Text style={[theme.typography.statusText, { color: theme.colors.accent + 60 }]}>Завершена</Text> */}
          </View>
          <Text style={theme.typography.regular("caption", 400, "start")}>
            {item.role}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSelectedUser = (item) => {
    setSelectedUser(item);
    setShowModalUser(true);
  };

  const handleCloseEdit = () => {
    setIsShowEditCredit(false);
    setFormData((prev) => ({ ...prev, card_number: cardNumber }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {renderHeader()}
        {renderCreditBLock()}
        {renderPeopleBlock()}
        <Modal visible={isShowModalQrCode}>
          <TeamInvationPage
            handleClose={() => setIsShowModalQrCode(false)}
            isReferral={true}
          />
        </Modal>
        <Modal animationType="slide" visible={IsShowEditCredit}>
          <EditCreditPage
            handleClose={handleCloseEdit}
            formData={formData}
            setCardNumber={setCardNumber}
            setFormData={setFormData}
          />
        </Modal>
        <CustomModal
          isVisible={showModalUser}
          onClose={() => setShowModalUser(false)}
          buttonLeft={<ChevronLeft />}
          buttonRight={<ShareIcon />}
        >
          {/*  */}
          <ProfilePageView route={{ params: { posterId: selectedUser?.id } }} />
        </CustomModal>
      </View>
    </SafeAreaView>
  );
};

const makeStyle = (theme) =>
  StyleSheet.create({
    container: theme.container,
    header: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingBottom: theme.spacing.medium,
      alignItems: "center",
    },
    header__title: theme.typography.title2,
    credit__container: {
      padding: theme.spacing.medium,
      backgroundColor: theme.colors.block,
      gap: 12,
      borderRadius: 12,
      marginTop: theme.spacing.small,
      marginBottom: theme.spacing.xLarge,
    },
    image: {
      width: 42,
      aspectRatio: 1 / 1,
      borderRadius: 54,
    },
    people__item: {
      flexDirection: "row",
      gap: theme.spacing.small,
      backgroundColor: theme.colors.block,
      padding: theme.spacing.medium,
      borderRadius: 12,
    },
  });

export default ReferralListPage;
