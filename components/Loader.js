// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';
// import LottieView from 'lottie-react-native';

// export default function Loader() {
//     return (
//         <View style={styles.center}>
//             <LottieView
//                 source={require('../assets/loader.json')} // путь к твоей Lottie-анимации
//                 autoPlay
//                 loop
//                 style={styles.animation}
//             />
//             <Text style={styles.text}>Загрузка...</Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     center: {
//         justifyContent: "center",
//         alignItems: "center",
//         flex: 1,
//         backgroundColor: "#E5E5EA",
//     },
//     animation: {
//         width: 150,
//         height: 150,
//     },
//     text: {
//         fontSize: 16,
//         color: "#3E3E3E"
//     }
// });

import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function Loader() {
  return (
    <View style={styles.center}>
      <Image
        source={require("../assets/loader.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#E5E5EA",
  },
  image: {
    width: 240,
    height: 240,
  },
  text: {
    fontSize: 16,
    color: "#3E3E3E",
  },
});
