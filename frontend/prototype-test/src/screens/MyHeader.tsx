import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Props } from "../navigation/props";
import { logInStyles } from "../styles/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { Calendar } from "react-native-calendars";
import { Surface } from "react-native-paper";
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const HEADER_HEIGHT = 150;

const MyHeaders: React.FC<Props> = ({ back, style }) => {
  const navigation = useNavigation();

  const LeftView = () => (
    <View>
      {back && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 70,
            left: 16,
            width: 42,
            height: 42,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={42} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Surface style={[style]}>
      <SafeAreaView style={{ backgroundColor: "#E7F0E6" }}>
        <StatusBar barStyle="light-content" backgroundColor="#278086" />

        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 150,
            backgroundColor: "#278086",
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            paddingHorizontal: 20,
            justifyContent: "flex-end",
            paddingBottom: 15,
          }}
        ></Animated.View>

        <LeftView />
      </SafeAreaView>
    </Surface>
  );
};

export default MyHeaders;
