import { TouchableOpacity, View } from "react-native";
import ChatInput from "../Chats/ChatInput";
import CommunicationIcon from "../../assets/svg/Communication";
import PaperclipAttachmentIcon from "../../assets/svg/PaperclipAttachment";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

export default function InputBlock({ sendMessage, isDisabled = false }) {
  const { theme } = useTheme();

  const [inputValue, setInputValue] = useState("");

  const handleInput = (value) => {
    setInputValue(value);
  };

  const handleSendMessage = () => {
    if (inputValue.length == 0) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: theme.colors.block,
        gap: theme.spacing.small,
        paddingVertical: theme.spacing.small,
        alignItems: "center",
        paddingHorizontal: theme.spacing.medium,
      }}
    >
      <PaperclipAttachmentIcon
        color={isDisabled ? theme.colors.caption + "66" : "gray"}
      />
      <ChatInput
        handleChangeInputText={handleInput}
        inputValue={inputValue}
        placeholder={"Сообщение"}
      />
      <TouchableOpacity disabled={isDisabled} onPress={handleSendMessage}>
        <CommunicationIcon
          color={theme.colors.accent + (isDisabled ? 66 : "")}
        />
      </TouchableOpacity>
    </View>
  );
}
