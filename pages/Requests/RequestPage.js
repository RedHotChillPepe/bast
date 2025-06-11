import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ChevronLeft from "../../assets/svg/ChevronLeft";
import CloseIcon from "../../assets/svg/Close";
import CopyIcon from "../../assets/svg/Copy";
import { CreditCardIcon } from "../../assets/svg/CreditCard";
import DotIcon from "../../assets/svg/Dot";
import ShareIcon from "../../assets/svg/Share";
import { useApi } from "../../context/ApiContext";
import { useTheme } from "../../context/ThemeContext";
import InputImage from "./../../components/PostComponents/InputImage";
import TeamPage from "./../Teams/TeamPage";

const RequestPage = (props) => {
  const {
    handleClose,
    setTeamMembers,
    prevStatusRef,
    setSelectedRequest,
    selectedRequest,
    setRequests,
    stages,
    user,
    selectedTeam,
    setSelectedPeople,
    isDeal = false,
    isOwner = false,
  } = props;

  const { theme } = useTheme();
  const styles = makeStyle(theme);

  const { changeStatusRequest, changeAssignee } = useApi();
  const [currentStage, setCurrentStage] = useState(0);
  const [maxStage, setMaxStage] = useState(0);
  const [isRejection, setIsRejection] = useState(false);

  const [paymentsStage, setPaymentsStage] = useState(0);
  const [documentIsUpload, setDocumentIsUploadIsUpload] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    photos: [],
  });

  const [isShowSelectedPeople, setIsShowSelectedPeople] = useState(false);

  useEffect(() => {
    const { status, previous_status } = selectedRequest.last_assign;

    // считаем все «обычные» этапы
    const positiveStages = stages.filter((s) => s.status_id >= 0);
    setMaxStage(positiveStages.length - 1);

    if (status.id === -1) {
      // Заявка в отказе — оставляем текущий currentStage из рефа или previous_status
      // если ref есть (локальный отказ) — используем его,
      // иначе, при первом открытии, используем previous_status из API

      const fromRef = prevStatusRef.current;
      const fromApi = previous_status?.id ?? null;

      const idx =
        typeof fromRef === "number"
          ? fromRef
          : typeof fromApi === "number"
          ? positiveStages.findIndex((s) => s.status_id === fromApi)
          : -1;

      setCurrentStage(idx >= 0 ? idx : 0);
      setIsRejection(true);
      return;
    }
    // Нормальный этап — ищем его в positiveStages
    const idx = positiveStages.findIndex((s) => s.status_id === status.id);
    setCurrentStage(idx >= 0 ? idx : 0);
    setIsRejection(false);
  }, [stages, selectedRequest.last_assign]);

  useEffect(() => {
    setDocumentIsUploadIsUpload(formData.photos.length > 0);
  }, [formData]);

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={handleClose}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.header__title}>
          {isDeal
            ? currentStage == maxStage
              ? "Выплата агенту"
              : "Сделка"
            : "Заявка"}{" "}
          {((!isDeal || currentStage !== maxStage) &&
            selectedRequest.request_id) ||
            selectedRequest.last_assign.id}
        </Text>
        <Pressable>
          <ShareIcon />
        </Pressable>
      </View>
    );
  };

  const getCurrentStatus = () => {
    return (
      stages.find((stage) => stage.status_id === currentStage) || stages[0]
    );
  };

  const renderStatus = () => {
    const currentStatus = getCurrentStatus();
    const statusId = currentStatus.status_id;

    return (
      <View
        style={[
          styles.status__flag,
          {
            backgroundColor: isRejection
              ? "#FF2D55"
              : statusId == 4
              ? theme.colors.success
              : statusId == 0
              ? "#FFC107"
              : "#2C88EC",
          },
        ]}
      >
        <Text style={styles.flag__text}>
          {isRejection ? stages[0].status_stage : currentStatus.status_stage}
        </Text>
      </View>
    );
  };

  const renderRequestHeader = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.update__text}>Обновлено:&nbsp;</Text>
          <Text style={styles.update__date}>
            {new Date(
              selectedRequest.last_assign.assigned_at
            ).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {renderStatus()}
      </View>
    );
  };

  const renderRequestBody = () => {
    return (
      <View style={{ rowGap: 16, marginTop: 8 }}>
        <View style={{ rowGap: 4 }}>
          <Text style={styles.initials}>
            {selectedRequest.user.name} {selectedRequest.user.surname}
          </Text>
          <Text style={styles.type}>{selectedRequest.service.description}</Text>
        </View>

        {/* <View style={styles.location}>
                <Text style={styles.location__text}>{selectedRequest.location}</Text>
                <Text style={styles.location__text}>№{selectedRequest.id}</Text>
            </View> */}
      </View>
    );
  };

  const renderPost = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginTop: 12,
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 80,
            height: 51,
            borderRadius: 20,
            aspectRatio: 80 / 51,
          }}
          source={{
            uri: "https://i3.imageban.ru/out/2025/01/27/972dc53aa3963aa9aaa8a4ee7041829a.jpg",
          }}
        />
        <View>
          <Text style={stylePost.price}>
            {Number(8_900_000).toLocaleString("ru-RU")} ₽
          </Text>
          <Text style={stylePost.location}>
            с . Завьялово, ул. Совесткая, 25
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Text style={stylePost.caption}>2 этажа</Text>
            <DotIcon />
            <Text style={stylePost.caption}>200 м2</Text>
            <DotIcon />
            <Text style={stylePost.caption}>20 соток</Text>
          </View>
        </View>
      </View>
    );
  };

  const stylePost = StyleSheet.create({
    price: {
      color: "#0A0F09",
      fontSize: 17,
      fontFamily: "Sora500",
      lineHeight: 22,
      letterSpacing: -0.43,
    },
    location: {
      color: "#0A0F09",
      fontSize: 12,
      fontFamily: "Sora500",
      lineHeight: 16,
    },
    caption: {
      color: "#0A0F09",
      fontSize: 11,
      fontFamily: "Sora400",
      lineHeight: 13,
      letterSpacing: 0.06,
    },
  });

  const renderRequest = () => {
    return (
      <View style={styles.containerItem}>
        {
          <View key={selectedRequest.id} style={styles.item}>
            {renderRequestHeader()}
            {isDeal ? renderPost() : renderRequestBody()}
          </View>
        }
      </View>
    );
  };

  const listPeople = [
    {
      type: 1,
      typeName: "Покупатель",
      user: {
        surname: "Гребенкина",
        name: "Мария",
        fathername: "Александровна",
      },
      id: 1,
    },
    {
      type: 2,
      typeName: "Продавец",
      user: { surname: "Васильева", name: "Елена", fathername: "Петровна" },
      id: 2,
    },
    {
      type: 3,
      typeName: "Агент",
      user: { surname: "Пупкин", name: "Василий", fathername: "Иванович" },
      id: 3,
    },
  ];

  const renderPeopleBlock = (item) => {
    return listPeople.map((item) => (
      <View key={`people-${item.id}`} style={[styles.item, { rowGap: 4 }]}>
        <Text style={styles.type}>{item.typeName}</Text>
        <Text style={styles.initials}>
          {item.user.surname} {item.user.name} {item.user?.fathername}
        </Text>
      </View>
    ));
  };

  const renderStageBlock = () => {
    const currentStatus = getCurrentStatus();

    return (
      <View style={[styles.item, { rowGap: 32 }]}>
        <View style={{ rowGap: 16 }}>
          <Text style={styles.stage__title}>
            Этап {currentStage} из {maxStage}
          </Text>
          {renderStageIndicator()}
          <Text style={styles.stage__description}>
            {isRejection
              ? stages[0].status_description
              : currentStatus.status_description}
          </Text>
        </View>
        {errorMessage && (
          <Text style={[theme.typography.errorText, { textAlign: "center" }]}>
            {errorMessage}
          </Text>
        )}
        {((currentStage < maxStage && user.usertype === 3) ||
          (isDeal && maxStage == currentStage)) &&
          !isOwner &&
          renderStageButton()}
      </View>
    );
  };

  const renderStageIndicator = () => {
    const indicators = [];
    for (let i = 0; i < maxStage; i++) {
      const indicator = (
        <View
          key={`indicator-${i}`}
          style={i < currentStage ? styles.stage__active : styles.stage}
        >
          {isRejection && <CloseIcon color={"#2C88EC"} />}
        </View>
      );
      indicators.push(indicator);
    }

    return <View style={styles.container__stages}>{indicators}</View>;
  };

  const listPaymentsButton = [
    { title: "Выплата отправлена", handlePress: () => console.log(1), id: 5 },
    { title: "Выплата отправлена", handlePress: () => console.log(1), id: 6 },
  ];

  const handleChangeAssign = async (people) => {
    try {
      if (!selectedRequest?.last_assign?.id || !people?.user?.id) {
        throw new Error("Недостаточно данных для смены исполнителя");
      }

      const requestId = selectedRequest.last_assign.id;

      const payload = {
        requestId: selectedRequest.last_assign.id,
        team_id: people.teamId,
        user_id: people.user.id,
        user_type: people.user.usertype,
      };
      const result = await changeAssignee(payload);
      setSelectedPeople((prev) => ({
        ...prev,
        request_count: Math.max(0, Number(prev?.request_count || 0) - 1),
        requests:
          prev?.requests?.filter(
            (item) => item.id !== selectedRequest.last_assign.id
          ) || [],
      }));

      setTeamMembers((prevMembers) => {
        // Найдём члена команды, у которого была заявка
        let removedRequest = null;

        // Удаляем заявку у старого исполнителя
        const updatedMembers = prevMembers.map((member) => {
          const requestIndex =
            member.requests?.findIndex((r) => r.id === requestId) ?? -1;

          if (requestIndex !== -1) {
            // Забираем заявку
            removedRequest = {
              ...member.requests[requestIndex],
              assigned_at: new Date(),
            };

            // Удаляем её из массива
            const newRequests = [...member.requests];
            newRequests.splice(requestIndex, 1);

            return {
              ...member,
              requests: newRequests,
              request_count: String(
                Math.max(0, Number(member.request_count) - 1)
              ),
            };
          }

          return member;
        });

        return updatedMembers.map((member) => {
          if (member.member_id === people.member_id) {
            return {
              ...member,
              requests: [...(member.requests ?? []), removedRequest],
              request_count: String(Number(member.request_count || "0") + 1), // увеличили
            };
          }

          return member;
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsShowSelectedPeople(false);
      handleClose();
    }
  };

  const handleChangeStage = async (isSetRejection = false) => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const { last_assign } = selectedRequest;
      const now = Date.now();
      const isRestore =
        last_assign.status.id === -1 &&
        last_assign.can_restore === true &&
        now - new Date(last_assign.assigned_at).getTime() <=
          7 * 24 * 60 * 60 * 1000 &&
        isRejection;

      let newStatus;

      if (isRestore) {
        // 1) UI-реф (если отказ уже был)
        const prevLocal = prevStatusRef.current;
        // 2) бекенд (previous_status из API)
        const prevBackend = last_assign.previous_status?.id;

        // Выбираем более «свежий» — тот, что выше по индексу
        // (т.е. больший status_id)
        if (typeof prevLocal === "number" && typeof prevBackend === "number") {
          newStatus = Math.max(prevLocal, prevBackend);
        } else if (typeof prevLocal === "number") {
          newStatus = prevLocal;
        } else if (typeof prevBackend === "number") {
          newStatus = prevBackend;
        } else {
          // дефолт на самый первый этап, если вдруг ничего нет
          newStatus = 0;
        }

        // очистим реф, чтобы не мешал впредь
        prevStatusRef.current = null;
        setIsRejection(false);
      } else if (isSetRejection) {
        // при отказе сохраняем текущий UI-этап
        prevStatusRef.current = currentStage;
        newStatus = -1;
        setIsRejection(true);

        // локально обновляем только last_assign.status и can_restore
        const updatedLast = {
          ...last_assign,
          status: {
            id: -1,
            description: stages.find((s) => s.status_id === -1)
              .status_description,
            stage: stages.find((s) => s.status_id === -1).status_stage,
          },
          assigned_at: new Date().toISOString(),
          can_restore: true,
          // НЕ кладём сюда previous_status — он от API
        };
        if (setRequests)
          setRequests((rs) =>
            rs.map((r) =>
              r.request_id === selectedRequest.request_id
                ? { ...r, last_assign: updatedLast }
                : r
            )
          );
      } else {
        // обычное продвижение
        newStatus = currentStage + 1;
        setIsRejection(false);
      }

      // отправляем на сервер
      await changeStatusRequest(
        selectedRequest.request_id || last_assign.id,
        newStatus
      );
      // подтягиваем описание статуса
      const nextDef = stages.find((s) => s.status_id === newStatus);
      const mergedLast = {
        ...last_assign,
        assigned_at: new Date().toISOString(),
        status: {
          id: newStatus,
          description: nextDef.status_description,
          stage: nextDef.status_stage,
        },
        can_restore: newStatus === -1,
      };
      // FIXME: Баг с востановлением и количеством задач в работе(проверять при востановлении и отказе количетсво активных задач)
      // обновляем стейты
      if (setRequests)
        setRequests((rs) =>
          rs.map((r) =>
            r.request_id === selectedRequest.request_id
              ? { ...r, last_assign: mergedLast }
              : r
          )
        );
      else {
        setSelectedPeople((prev) => {
          if (newStatus !== -1 || newStatus !== 4)
            prev.request_count = Math.max(
              0,
              Number(prev?.request_count || 0) - 1
            );

          const requestIndex =
            prev.requests?.findIndex(
              (r) => r.id == selectedRequest.last_assign.id
            ) ?? -1;
          console.warn(prev.requests[requestIndex].status.id);
          if (prev.requests[requestIndex].status.id == -1 && newStatus > -1) {
            prev.request_count++;
          }

          if (requestIndex !== -1) {
            prev.requests[requestIndex].status = {
              id: newStatus,
              description: nextDef.status_description,
              stage: nextDef.status_stage,
            };
            prev.requests[requestIndex].can_restore = newStatus === -1;
          }
          prev.requests[requestIndex].assigned_at = new Date();
          return prev;
        });

        setSelectedRequest((prev) => {
          prev.last_assign.assigned_at = new Date();

          return {
            ...prev,
            // last_assign: {
            // ...prev.last_assign,
            //   description: stages.find((s) => s.status_id == newStatus)
            //     .status_description,
            //   stage: stages.find((s) => s.status_id == newStatus).status_stage,
            //   assigned_at: new Date(),
            // },
          };
        });
      }

      // фиксируем индикатор
      if (isRestore || (!isSetRejection && newStatus >= 0)) {
        setCurrentStage(newStatus);
      }
      // если отказ — оставляем прежний currentStage
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStageButton = () => {
    if (isLoading)
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={"large"} />
        </View>
      );

    if (isRejection)
      return (
        <View style={styles.stage__button__container}>
          <TouchableOpacity
            style={[
              styles.stage__button,
              {
                backgroundColor: `#2C88EC${
                  isDeal && maxStage == currentStage && !documentIsUpload
                    ? "60"
                    : ""
                }`,
              },
            ]}
            onPress={() => handleChangeStage(false)}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[styles.stage__button__text, { color: "#F2F2F7" }]}
            >
              Возобновить
            </Text>
          </TouchableOpacity>
        </View>
      );

    return (
      <View style={styles.stage__button__container}>
        {!isDeal && (
          <TouchableOpacity
            style={styles.stage__button}
            onPress={() => handleChangeStage(true)}
          >
            <Text style={[styles.stage__button__text, { color: "#2C88EC" }]}>
              {stages[0].action_text}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          disabled={isDeal && maxStage == currentStage && !documentIsUpload}
          style={[
            styles.stage__button,
            {
              backgroundColor: `#2C88EC${
                isDeal && maxStage == currentStage && !documentIsUpload
                  ? "60"
                  : ""
              }`,
            },
          ]}
          onPress={
            isDeal && maxStage == currentStage
              ? listPaymentsButton[paymentsStage].handlePress
              : () => handleChangeStage(false)
          }
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.stage__button__text, { color: "#F2F2F7" }]}
          >
            {isDeal && maxStage == currentStage
              ? listPaymentsButton[paymentsStage].title
              : stages[currentStage + 1].action_text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPaymentsBlock = () => {
    return (
      <View>
        {renderCreditBLock()}
        {renderDocumentBlock()}
      </View>
    );
  };

  const renderCreditBLock = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          Clipboard.setStringAsync("Номер карты");
        }}
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
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.small,
            }}
          >
            <CreditCardIcon />
            <Text style={theme.typography.regular("text")}>
              {"2200 4480 7700 7654"}
            </Text>
          </View>
          <CopyIcon size={24} strokeWidth={2} />
        </View>
        <Text style={theme.typography.regular("caption")}>
          Переведите вознаграждение по номеру банковской карты
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDocumentBlock = () => {
    return (
      <View>
        <InputImage
          label="Чек об операции"
          buttonText="Загрузить документы о переводе"
          title=""
          verticalMargin={0}
          marginTop={10}
          selectionLimit={1}
          showImages={false}
          setFormData={setFormData}
          photos={formData.photos}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView style={styles.containerScroll}>
          <View style={styles.containerItem}>
            {!isDeal || currentStage !== maxStage
              ? renderRequest()
              : renderPaymentsBlock()}
            {isDeal && currentStage !== maxStage && renderPeopleBlock()}
            {renderStageBlock()}
          </View>
        </ScrollView>
        {(user.usertype === 3 ||
          (user.usertype === 2 && currentStage < maxStage)) && (
          <TouchableOpacity
            disabled={
              currentStage == maxStage ||
              isRejection ||
              (isDeal && !documentIsUpload)
            }
            style={[
              styles.button,
              {
                backgroundColor:
                  (!isDeal &&
                    isOwner &&
                    currentStage !== maxStage &&
                    !isRejection) ||
                  (isDeal && documentIsUpload)
                    ? "#2C88EC"
                    : "#2C88EC66",
              },
            ]}
            onPress={() =>
              !isOwner ? handleClose() : setIsShowSelectedPeople(true)
            }
          >
            <Text style={styles.button__text}>
              {!isOwner
                ? "Закрыть сделку"
                : currentStage === 0
                ? "Выбрать исполнителя"
                : "Сменить исполнителя"}
            </Text>
          </TouchableOpacity>
        )}
        <Modal
          visible={isShowSelectedPeople}
          onRequestClose={() => setIsShowSelectedPeople(false)}
          animationType="slide"
        >
          <TeamPage
            selectedTeam={selectedTeam}
            handleChangeAssign={handleChangeAssign}
            isChangeAssign={isOwner}
            currentUser={user}
            handleClose={() => setIsShowSelectedPeople(false)}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const makeStyle = (theme) =>
  StyleSheet.create({
    container: theme.container,
    containerScroll: {
      flex: 1,
      marginBottom: theme.spacing.medium,
    },
    header: {
      justifyContent: "space-between",
      flexDirection: "row",
      paddingBottom: theme.spacing.medium,
      alignItems: "center",
    },
    containerItem: {
      rowGap: theme.spacing.small,
      marginTop: theme.spacing.small,
    },
    item: {
      backgroundColor: theme.colors.block,
      borderRadius: 12,
      padding: theme.spacing.medium,
    },
    header__title: theme.typography.title2,
    status__flag: {
      paddingHorizontal: theme.spacing.small,
      borderRadius: theme.spacing.small,
      alignSelf: "stretch",
    },
    flag__text: theme.typography.captionBold,
    location: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    location__text: theme.typography.regular("caption"),
    initials: {
      color: "#000",
      fontSize: 14,
      fontWeight: 600,
      fontFamily: "Sora700",
      lineHeight: 17.6,
      letterSpacing: -0.42,
    },
    update__text: theme.typography.caption,
    update__date: {
      color: "#000",
      fontSize: 12,
      fontWeight: 400,
      fontFamily: "Sora00",
      lineHeight: 16,
      letterSpacing: -0.36,
    },
    type: {
      color: "#000",
      fontSize: 14,
      fontWeight: 400,
      fontFamily: "Sora400",
      lineHeight: 17.6,
      letterSpacing: -0.42,
    },
    button: {
      padding: 12,
      alignItems: "center",
      borderRadius: 12,
      marginBottom: 28,
    },
    button__text: theme.typography.buttonTextXL,
    container__stages: {
      flexDirection: "row",
      columnGap: 6,
    },
    stage: {
      flex: 1,
      height: 26,
      borderRadius: 12,
      backgroundColor: `${theme.colors.accent}66`,
      justifyContent: "center",
      alignItems: "center",
    },
    stage__active: {
      flex: 1,
      height: 26,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
      justifyContent: "center",
      alignItems: "center",
    },
    stage__button__container: {
      flexDirection: "row",
      columnGap: theme.spacing.medium,
    },
    stage__button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: theme.spacing.small,
      borderRadius: 12,
      minWidth: 0, // 🛠️ позволяет flex shrink корректно сработать
    },
    stage__button__text: {
      fontFamily: "Sora700",
      fontSize: 14,
      lineHeight: 17.6,
      letterSpacing: -0.42,
      color: "#000",
      fontWeight: "600",
      textAlign: "center",
      flexShrink: 1,
      includeFontPadding: false,
    },
    stage__title: {
      fontFamily: "Sora700",
      fontSize: 16,
      lineHeight: 20.17 /* 20.178 */,
      letterSpacing: -0.48,
      color: "#000",
      fontWeight: 600,
    },
    stage__description: {
      fontWeight: 400,
      fontFamily: "Sora400",
      fontSize: 14,
      lineHeight: 17.6 /* 20.178 */,
      letterSpacing: -0.42,
      color: "#000",
    },
    credit__container: {
      padding: theme.spacing.medium,
      backgroundColor: theme.colors.block,
      gap: 12,
      borderRadius: 12,
      marginTop: theme.spacing.small,
    },
  });

export default RequestPage;
