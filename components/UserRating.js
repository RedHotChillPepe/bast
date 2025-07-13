import React from "react";
import { FullStarIcon } from "../assets/svg/Profile/Stars/FullStarIcon";
import { HalfStarIcon } from "../assets/svg/Profile/Stars/HalfStarIcon";
import { OutlineStarIcon } from "../assets/svg/Profile/Stars/OutlineStarIcon";
import { useTheme } from "../context/ThemeContext";
import { Text, View } from "react-native";

export default function UserRating({ rating = 0 }) {
  if (!rating || rating <= 0) return null;

  const { theme } = useTheme();

  const stars = [];
  const fullStars = Math.floor(rating);
  const decimal = rating - fullStars;
  const hasHalfStar = decimal >= 0.25 && decimal < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FullStarIcon key={`full-${i}`} />);
  }

  if (hasHalfStar) {
    stars.push(<HalfStarIcon key="half" />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<OutlineStarIcon key={`empty-${i}`} />);
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
      }}
    >
      <Text
        style={[
          theme.typography.caption,
          { marginRight: 8, color: theme.colors.text },
        ]}
      >
        {rating.toFixed(1)}
      </Text>
      {stars}
    </View>
  );
}
