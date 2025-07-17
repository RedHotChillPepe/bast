import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Text, TouchableOpacity, View } from "react-native";
import UniversalHeader from "../components/UniversalHeaderComponent";
import { OutlineStarIcon } from "../assets/svg/Profile/Stars/OutlineStarIcon";
import InputProperty from "../components/PostComponents/InputProperty";

export default function RateUserPage() {
  const { theme } = useTheme();
  return (
    <View style={theme.container}>
      <UniversalHeader isModal={true} />
      <Text style={[theme.typography.title2, { marginTop: 16 }]}>
        Оцените пользователя
      </Text>
      <View style={{ rowGap: 32, flex: 1 }}>
        <Text
          style={{
            fontSize: 64,
            fontFamily: "Sora700",
            textAlign: "center",
            lineHeight: 56,
          }}
        >
          0,0
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity>
            <OutlineStarIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <OutlineStarIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <OutlineStarIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <OutlineStarIcon />
          </TouchableOpacity>
          <TouchableOpacity>
            <OutlineStarIcon />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[theme.buttons.classisButton, { marginBottom: 34 }]}
      >
        <Text style={theme.typography.title3("white")}>Продолжить</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function RateUserPage() {
  const { theme } = useTheme();
  return (
    <View style={theme.container}>
      <UniversalHeader isModal={true} />
      <Text style={[theme.typography.title2, { marginTop: 16, marginBottom: 24 }]}>
        Напишите отзыв
      </Text>
      <View style={{ rowGap: 32, flex: 1, marginVertical:24 }}>
    <InputProperty tytle={'Текст отзыва'} type={'textarea'} placeholder={"Максимум 2 000 символов"}/>
      </View>
      <TouchableOpacity
        style={[theme.buttons.classisButton, { marginBottom: 34 }]}
      >
        <Text style={theme.typography.title3("white")}>Оставить отзыв</Text>
      </TouchableOpacity>
    </View>
  );
}
