import { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function SystemMessage({
  topics,
  type,
  sendUserMessage,
  text = "",
}) {
  const { theme } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState();

  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleTopicSelect = (topic) => {
    console.log("Выбрана тема:", topic);
    setSelectedTopic(topic);
    console.log(topic);

    sendUserMessage(topic.title, topic);
    if (topic.id == 4) console.log("Введите совю темцу");
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View
        style={{
          alignItems: "center",
          marginVertical: 16,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.systemMessage,
            padding: 12,
            borderRadius: 12,
            maxWidth: "80%",
          }}
        >
          {type == "topicSelection" && (
            <View>
              <Text
                style={[
                  theme.typography.regularBold,
                  { textAlign: "center", marginBottom: 8 },
                ]}
              >
                Выберите тему обращения:
              </Text>

              {topics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => handleTopicSelect(topic)}
                  style={{
                    padding: 10,
                    marginVertical: 4,
                    backgroundColor: theme.colors.block,
                    borderRadius: 8,
                  }}
                >
                  <Text style={theme.typography.regular()}>{topic.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {type == "descriptionRequest" && (
            <Text
              style={[
                theme.typography.regularBold,
                {
                  textAlign: "center",
                  marginBottom: 8,
                  padding: 10,
                  marginVertical: 4,
                  backgroundColor: theme.colors.block,
                  borderRadius: 8,
                },
              ]}
            >
              {text}
            </Text>
          )}
          {type === "notification" && (
            <Text
              style={[
                theme.typography.regularBold,
                {
                  textAlign: "center",
                  marginBottom: 8,
                  padding: 10,
                  marginVertical: 4,
                  backgroundColor: theme.colors.block,
                  borderRadius: 8,
                },
              ]}
            >
              {text}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}
