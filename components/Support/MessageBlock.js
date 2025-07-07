import { FlatList, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Message from "./Message";
import SystemMessage from "./SystemMessage";

export default function MessageBlock({ messages, sendUserMessage }) {
  const { theme } = useTheme();

  // Преобразуем вложенную структуру в плоский список для FlatList
  const flattenMessages = messages.flatMap((day) => [
    {
      type: "date",
      id: `date-${day.id}`,
      date: day.date,
    },
    ...day.messages.map((msg) => ({
      ...msg,
      id: msg.id.toString(),
    })),
  ]);

  const renderItem = ({ item }) => {
    if (item.type === "date") {
      return (
        <Text style={[theme.typography.title3(), { paddingVertical: 16 }]}>
          {item.date}
        </Text>
      );
    }

    if (item.senderType === "system") {
      return (
        <SystemMessage
          key={item.id}
          topics={item.content?.topics}
          text={item.content?.text}
          type={item.content?.type}
          sendUserMessage={sendUserMessage}
        />
      );
    }

    return <Message key={item.id} message={item} />;
  };

  return (
    <FlatList
      data={flattenMessages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
}
