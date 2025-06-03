import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import ChevronLeft from "../../assets/svg/ChevronLeft";
import EditPencil from "../../assets/svg/EditPencil";
import { LeftIcon } from "../../assets/svg/LeftIcon";
import Loader from "../../components/Loader";
import { Selectors } from "../../components/Selectors";
import { useApi } from "../../context/ApiContext";
import UserRequestPage from "./../Requests/UserRequestPage";
import EditTeamPage from "./EditTeamPage";
import EmployeeTeamPage from "./EmployeeTeamPage";
import TeamInvationPage from "./TeamInvationPage";

const TeamPage = (props) => {
  const [selectedList, setSelectedList] = useState("active");

  const {
    getTeamById,
    getTeamRequest,
    rejectTeamRequest,
    acceptTeamRequest,
    sendLeaveTeamRequest,
  } = useApi();

  const {
    selectedTeam,
    handleClose,
    setTeamsData,
    setSelectedTeam,
    currentUser,
    handleChangeAssign,
    isChangeAssign = false,
  } = props;
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowInvationModal, setIsShowInvationModal] = useState(false);
  const [isShowLeaveTeamModal, setIsShowLeaveTeamModal] = useState(false);
  const [isShowRequestsModal, setIsShowRequestsModal] = useState(false);

  const [error, setError] = useState("");
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const [teamMembers, setTeamMembers] = useState([]);
  const [requestTeam, setRequestTeam] = useState([]);
  const [activeExitRequestCurrentUser, setActiveExitRequestCurrentUser] =
    useState(null);

  const [selectedPeople, setSelectedPeople] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isOwner, setIsOwner] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    const result = await getTeamById(selectedTeam.team_id);

    if (result.statusCode !== undefined) {
      handleClose();
      navigation.navigate("Error");
    }

    setTeamMembers(result.members);
    console.log(currentUser);
    const checkOwner =
      (currentUser &&
        selectedTeam &&
        currentUser.id === selectedTeam.owner_id &&
        currentUser.usertype === selectedTeam.usertype) ||
      isChangeAssign;
    setIsOwner(checkOwner);

    setHasPendingRequest(result.activeExitRequestCurrentUser !== null);
    setActiveExitRequestCurrentUser(result.activeExitRequestCurrentUser);

    if (checkOwner) {
      const request = await getTeamRequest(selectedTeam.team_id);
      if (!request.error) {
        setRequestTeam(request);
      }
    }

    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleAcceptRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const result = await acceptTeamRequest(requestId);

      if (result.success) {
        const newMember = result.user; // объект участника с вложенным user

        setTeamMembers((prevMembers) => [
          ...prevMembers,
          newMember, // Добавляем нового участника как есть
        ]);

        setRequestTeam((prevRequests) =>
          prevRequests.filter((request) => request.request_id !== requestId)
        );
      } else {
        alert("Не удалось принять заявку");
      }
    } catch (error) {
      console.error("Ошибка при принятии заявки:", error);
      alert("Произошла ошибка при принятии заявки");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setIsLoading(true);
    try {
      const result = await rejectTeamRequest(requestId);

      if (result.success) {
        // Удаляем отклонённую заявку из списка requestTeam
        setRequestTeam((prevRequests) =>
          prevRequests.filter((request) => request.request_id !== requestId)
        );
      } else {
        alert("Не удалось отклонить заявку");
      }
    } catch (error) {
      console.error("Ошибка при отклонении заявки:", error);
      alert("Произошла ошибка при отклонении заявки");
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={handleClose}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.header__title}>{selectedTeam.team_name}</Text>
        <Pressable
          onPress={() =>
            isOwner ? setIsShowEditModal(true) : setIsShowLeaveTeamModal(true)
          }
        >
          {isOwner ? <EditPencil /> : <LeftIcon />}
        </Pressable>
      </View>
    );
  };

  const listSelectProperties = [
    { title: "Активные", value: "active", id: 1 },
    { title: "Заявки", value: "request", id: 2 },
  ];

  const renderPeopleItem = (member) => {
    return (
      <View style={{ flexDirection: "row", columnGap: 8 }}>
        <Image
          style={styles.item__photo}
          source={
            member.user.status == -1
              ? require("../../assets/deleted_user.jpg")
              : member?.user?.photo
              ? { uri: member?.user?.photo }
              : require("../../assets/placeholder.png")
          }
        />
        <View style={styles.item__about}>
          <View style={styles.people}>
            <Text style={styles.people__name}>
              {member.user.name} {member.user.surname}
            </Text>
            <Text style={styles.people__classification}>
              {member.role_description}
            </Text>
          </View>
          <View style={styles.status_container}>
            {(isOwner ||
              (currentUser.id == member.user.id &&
                currentUser.usertype == member.user.usertype)) &&
            selectedList !== "request" ? (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.people__status}>в работе: </Text>
                <Text style={styles.people__status__number}>
                  {member.request_count}
                </Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.people__status}>
                  {member.type_description}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPeoples = () => {
    if (teamMembers.length == 0)
      return <Text style={styles.text__empty}>Нет активных участников</Text>;

    // Сортировка: сначала текущий пользователь, потом все остальные
    const sortedMembers = [...teamMembers].sort((a, b) => {
      const aIsCurrent =
        a.user.id === currentUser.id &&
        a.user.usertype === currentUser.usertype;
      const bIsCurrent =
        b.user.id === currentUser.id &&
        b.user.usertype === currentUser.usertype;

      return aIsCurrent === bIsCurrent ? 0 : aIsCurrent ? -1 : 1;
    });

    return (
      <View style={styles.containerItem}>
        {sortedMembers.map((member) => (
          <Pressable
            key={`member-${member.member_id}`}
            onPress={() => handleSelectedPeople(member)}
          >
            {member.role !== 1 && (
              <View style={styles.item}>{renderPeopleItem(member)}</View>
            )}
          </Pressable>
        ))}
      </View>
    );
  };

  const renderRequest = () => {
    if (requestTeam.length === 0)
      return <Text style={styles.text__empty}>Нет заявок</Text>;

    return (
      <View style={styles.containerItem}>
        {requestTeam.map((request) => (
          <Pressable
            key={`request-${request.request_id}`}
            onPress={() => handleSelectedPeople(request)}
          >
            <View style={styles.item}>
              {renderPeopleItem(request)}
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Pressable
                  onPress={() => handleRejectRequest(request.request_id)}
                  style={styles.request__button}
                >
                  <Text
                    style={[styles.request__button__text, { color: "#2C88EC" }]}
                  >
                    Отклонить
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleAcceptRequest(request.request_id)}
                  style={[
                    styles.request__button,
                    { backgroundColor: "#2C88EC" },
                  ]}
                >
                  <Text
                    style={[styles.request__button__text, { color: "#F2F2F7" }]}
                  >
                    Принять
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const handleLeave = async () => {
    setIsLoadingResult(true);
    setError("");
    try {
      const result = await sendLeaveTeamRequest(selectedTeam.team_id);
      if (result.success) {
        setIsShowLeaveTeamModal(false);
        setActiveExitRequestCurrentUser(result.request);
        setHasPendingRequest(true);
      } else if (result?.message) {
        setError(result.message); // если сервер вернул ошибку
      } else {
        setError("Не удалось покинуть команду.");
      }
    } catch (err) {
      setError("Произошла ошибка при выходе из команды.");
    }
    setIsLoadingResult(false);
  };

  const handleCancelLeave = async () => {
    if (!activeExitRequestCurrentUser) {
      setError("Заявка на выход не найдена.");
      return;
    }

    setIsLoadingResult(true);
    setError("");
    try {
      const result = await rejectTeamRequest(
        activeExitRequestCurrentUser.request_id
      );
      if (result.success) {
        setIsShowLeaveTeamModal(false);
        setHasPendingRequest(false);
      } else if (result?.message) {
        setError(result.message);
      } else {
        setError("Не удалось отменить заявку.");
      }
    } catch (err) {
      setError("Произошла ошибка при отмене заявки.");
    }
    setIsLoadingResult(false);
  };

  const LeaveTeamModal = () => {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {hasPendingRequest ? "Отменить заявку" : "Покинуть команду"}
          </Text>

          {isLoadingResult ? (
            <View style={{ paddingVertical: 24 }}>
              <ActivityIndicator size="large" color="#32322C" />
            </View>
          ) : (
            <View>
              <Text style={[styles.modalSubtitle, { color: "#3E3E3E" }]}>
                {hasPendingRequest ? (
                  <>
                    Вы ранее отправили заявку на выход из команды{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {selectedTeam.team_name}
                    </Text>
                    . Хотите её отменить?
                  </>
                ) : (
                  <>
                    Вы уверены, что хотите покинуть команду{" "}
                    <Text style={{ fontWeight: "bold" }}>
                      {selectedTeam.team_name}
                    </Text>
                    ?
                  </>
                )}
              </Text>
              {error ? (
                <Text style={[styles.modalSubtitle, { color: "red" }]}>
                  {error}
                </Text>
              ) : null}
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: isLoadingResult ? "#F2F2F780" : "#F2F2F7" },
              ]}
              onPress={() => setIsShowLeaveTeamModal(false)}
              disabled={isLoadingResult}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  { color: isLoadingResult ? "#3E3E3E66" : "#3E3E3E" },
                ]}
              >
                {hasPendingRequest ? "Оставить" : "Отменить"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor:
                    isLoadingResult || error.length > 0
                      ? "#2C88EC66"
                      : "#2C88EC",
                },
              ]}
              onPress={hasPendingRequest ? handleCancelLeave : handleLeave}
              disabled={isLoadingResult || error.length > 0}
            >
              <Text style={styles.confirmButtonText}>
                {hasPendingRequest ? "Подтвердить" : "Покинуть"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listModals = [
    {
      visible: isShowInvationModal,
      content: (
        <TeamInvationPage
          handleClose={() => setIsShowInvationModal(false)}
          teamData={selectedTeam}
        />
      ),
    },
    {
      visible: isShowEditModal,
      content: (
        <EditTeamPage
          handleClose={() => setIsShowEditModal(false)}
          selectedTeam={selectedTeam}
          setTeamsData={setTeamsData}
          setSelectedTeam={setSelectedTeam}
        />
      ),
    },
    {
      visible: isShowModal,
      content: (
        <EmployeeTeamPage
          selectedPeople={selectedPeople}
          selectedTeam={selectedTeam}
          isOwner={isOwner}
          setTeamsData={setTeamsData}
          setTeamMembers={setTeamMembers}
          setRequestTeam={setRequestTeam}
          setSelectedPeople={setSelectedPeople}
          handleClose={() => setIsShowModal(false)}
        />
      ),
    },
    {
      visible: isShowLeaveTeamModal,
      transparent: true,
      animationType: "fade",
      content: <LeaveTeamModal />,
      onRequestClose: () => setIsShowLeaveTeamModal(false),
    },
    {
      visible: isShowRequestsModal,
      animationType: "slide",
      content: (
        <UserRequestPage
          handleClose={() => setIsShowRequestsModal(false)}
          isOwner={true}
        />
      ),
      onRequestClose: () => setIsShowRequestsModal(false),
    },
  ];

  const renderModals = () => {
    return listModals.map((modal, index) => (
      <Modal
        key={`modal-${index}`}
        visible={modal.visible}
        transparent={modal.transparent ?? false}
        animationType={modal.animationType ?? "slide"}
        onRequestClose={modal.onRequestClose}
      >
        {modal.content}
      </Modal>
    ));
  };

  const handleSelectedPeople = (people) => {
    const isSelf =
      currentUser?.id === people?.user?.id &&
      currentUser?.usertype === people?.user?.usertype;

    if (isOwner || isSelf) {
      setSelectedPeople(people);
      if (handleChangeAssign == undefined) setIsShowModal(true);
      else {
        handleChangeAssign({ teamId: selectedTeam.team_id, ...people });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView
          style={styles.containerScroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {isOwner && !isChangeAssign && (
            <Selectors
              handleSelected={setSelectedList}
              selectedList={selectedList}
              listSelector={listSelectProperties}
            />
          )}
          {selectedList == "active" ? renderPeoples() : renderRequest()}
        </ScrollView>

        {!isChangeAssign && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              isOwner
                ? setIsShowInvationModal(true)
                : setIsShowRequestsModal(true)
            }
          >
            <Text style={styles.button__text}>
              {isOwner ? "Добавить сотрудника" : "Мои задачи"}
            </Text>
          </TouchableOpacity>
        )}

        {renderModals()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E5E5EA",
    padding: 16,
    flex: 1,
  },
  containerScroll: {
    flex: 1,
    marginBottom: 16,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 16,
    alignItems: "center",
  },
  header__title: {
    color: "#3E3E3E",
    fontSize: 20,
    fontFamily: "Sora700",
    fontWeight: 600,
    lineHeight: 25.2,
    letterSpacing: -0.6,
  },
  containerItem: {
    rowGap: 4,
    marginTop: 8,
  },
  item: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
    columnGap: 8,
    rowGap: 24,
  },
  item__photo: {
    width: 42,
    height: 42,
    borderRadius: 54,
    alignSelf: "stretch",
    aspectRatio: "1/1",
  },
  item__about: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  people: {
    justifyContent: "space-between",
  },
  people__name: {
    color: "#3E3E3E",
    fontSize: 14,
    fontFamily: "Sora700",
    fontWeight: 600,
    lineHeight: 17.6,
    letterSpacing: -0.42,
  },
  people__classification: {
    color: "#808080",
    fontSize: 14,
    fontFamily: "Sora400",
    fontWeight: 400,
    lineHeight: 17.6,
    letterSpacing: -0.42,
  },
  status_container: {
    flexDirection: "row",
  },
  people__status: {
    color: "#2C88EC",
    fontSize: 14,
    fontFamily: "Sora400",
    lineHeight: 15.1,
    letterSpacing: -0.36,
  },
  people__status__number: {
    color: "#2C88EC",
    fontSize: 14,
    fontFamily: "Sora700",
    lineHeight: 15.1,
    letterSpacing: -0.36,
  },
  button: {
    backgroundColor: "#2C88EC",
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 28,
  },
  button__text: {
    color: "#F2F2F7",
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontFamily: "Sora700",
  },
  request__button: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  request__button__text: {
    fontSize: 14,
    fontWeight: 400,
    fontFamily: "Sora400",
    lineHeight: 17.6,
    letterSpacing: -0.42,
  },
  text__empty: {
    color: "#3E3E3E",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 20.17,
    letterSpacing: -0.48,
    fontFamily: "Sora500",
    textAlign: "center",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 360,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Sora700",
    color: "#3E3E3E",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Sora400",
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontFamily: "Sora600",
    fontSize: 14,
  },
  confirmButtonText: {
    color: "#fff",
    fontFamily: "Sora600",
    fontSize: 14,
  },
});

export default TeamPage;
