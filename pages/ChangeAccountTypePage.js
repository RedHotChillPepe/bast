import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import UniversalHeader from "../components/UniversalHeaderComponent";
import { useApi } from "../context/ApiContext";
import { useTheme } from "../context/ThemeContext";

export default function ChangeAccountTypeModal({ handleClose, setUser }) {
  const { theme } = useTheme();
  const { createRequestChangeUserType } = useApi();

  const [isLoading, setIsLoading] = useState(false);

  const handleChangeType = async () => {
    try {
      setIsLoading(true);
      const result = await createRequestChangeUserType();
      if (!result.success) throw result;
      console.log(result);
      setUser((prev) => ({ ...prev, hasActiveRealtorRequest: true }));
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoader = () => {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 999,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: theme.colors.block + "60",
          rowGap: theme.spacing.medium,
        }}
      >
        <ActivityIndicator size={"large"} />
        <Text style={theme.typography.regular()}>Запрос выполняется...</Text>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={{ marginTop: 20, rowGap: 16, flex: 1 }}>
        <Text style={[theme.typography.title1, { textAlign: "left" }]}>
          Вы хотите стать риэлтором?
        </Text>
        <Text style={[theme.typography.regular(), { textAlign: "left" }]}>
          Мы рассмотрим вашу заявку в течение 48 часов
        </Text>
      </View>
    );
  };

  const renderButton = () => {
    return (
      <View style={{ marginBottom: 34, rowGap: theme.spacing.medium }}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={handleChangeType}
          style={[
            theme.buttons.classisButton,
            { opacity: isLoading ? 0.6 : 1 },
          ]}
        >
          <Text style={theme.typography.title3("white")}>Стать риэлтором</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isLoading}
          style={[
            theme.buttons.classisButton,
            {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: theme.colors.accent,
              opacity: isLoading ? 0.6 : 1,
            },
          ]}
          onPress={handleClose}
        >
          <Text style={theme.typography.title3("accent")}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={theme.container}>
      <UniversalHeader
        title="Стать риелтором"
        typography={"title2"}
        isModal={true}
        handleClose={handleClose}
      />
      {isLoading && renderLoader()}
      {renderContent()}
      {renderButton()}
    </View>
  );
}
