import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import UniversalHeader from "../components/UniversalHeaderComponent";
import { OutlineStarIcon } from "../assets/svg/Profile/Stars/OutlineStarIcon";

export default function ReviewsAboutUser() {
  const { theme } = useTheme();
  return (
    <View style={theme.container}>
      <UniversalHeader />
      <View style={{ marginTop: 10, marginBottom: 32 }}>
        <Text>4,0</Text>
        <View style={{ rowGap: 4 }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}
          >
            <OutlineStarIcon />
            <OutlineStarIcon />
            <OutlineStarIcon />
            <OutlineStarIcon />
            <OutlineStarIcon />
          </View>
          <Text style={theme.typography.caption}>на основании 4 оценок</Text>
        </View>
      </View>
      <View style={{ rowGap: 24, flex: 1 }}>
        <View style={{ rowGap: 16 }}>
          <View style={{ columnGap: 16 }}>
            {/* <Image source={{uri: }} /> */}
            <View style={{ rowGap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={theme.typography.title2}>Акула Блохаж</Text>
                <Text style={theme.typography.caption}>11 февраля</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Text style={theme.typography.caption}>4.0</Text>
                <View style={{ flexDirection: "row", columnGap: 4 }}>
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                </View>
              </View>
            </View>
          </View>
          <Text style={theme.typography.caption}>
            Все прошло успешно, эмоций тонна, всем советую, кто собирается
            покупать или просто хочет классно скоротать вечер!
          </Text>
        </View>
        <View style={{ rowGap: 16 }}>
          <View style={{ columnGap: 16 }}>
            {/* <Image source={{uri: }} /> */}
            <View style={{ rowGap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={theme.typography.title2}>Акула Блохаж</Text>
                <Text style={theme.typography.caption}>11 февраля</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Text style={theme.typography.caption}>4.0</Text>
                <View style={{ flexDirection: "row", columnGap: 4 }}>
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                </View>
              </View>
            </View>
          </View>
          <Text style={theme.typography.caption}>
            Все прошло успешно, эмоций тонна, всем советую, кто собирается
            покупать или просто хочет классно скоротать вечер!
          </Text>
        </View>
        <View style={{ rowGap: 16 }}>
          <View style={{ columnGap: 16 }}>
            {/* <Image source={{uri: }} /> */}
            <View style={{ rowGap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={theme.typography.title2}>Акула Блохаж</Text>
                <Text style={theme.typography.caption}>11 февраля</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Text style={theme.typography.caption}>4.0</Text>
                <View style={{ flexDirection: "row", columnGap: 4 }}>
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                  <OutlineStarIcon />
                </View>
              </View>
            </View>
          </View>
          <Text style={theme.typography.caption}>
            Все прошло успешно, эмоций тонна, всем советую, кто собирается
            покупать или просто хочет классно скоротать вечер!
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={[theme.buttons.classisButton, { marginBottom: 34 }]}
      >
        <Text style={theme.typography.title3("white")}>Написать отзыв</Text>
      </TouchableOpacity>
    </View>
  );
}
