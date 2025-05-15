import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import { Props } from "../navigation/props";

const dummyPosts = [
  { id: "1", title: "Insert post here hehe hoho", username: "User One" },
  { id: "2", title: "Insert post here hehe hoho", username: "User Two" },
  { id: "3", title: "Insert post here hehe hoho", username: "User Three" },
  { id: "4", title: "Insert post here hehe hoho", username: "User Four" },
  { id: "5", title: "Insert post here hehe hoho", username: "User Five" },
];

const HEADER_EXPANDED = 210;
const HEADER_COLLAPSED = 130;

const CalendarPage: React.FC<Props> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState("");

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED - HEADER_COLLAPSED],
    outputRange: [HEADER_EXPANDED, HEADER_COLLAPSED],
    extrapolate: "clamp",
  });

  const orgInfoOpacity = scrollY.interpolate({
    inputRange: [0, 20],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const orgNameTranslateY = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E7F0E6" }}>
      <StatusBar barStyle="light-content" backgroundColor="#278086" />

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight,
          backgroundColor: "#278086",
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingHorizontal: 16,
          justifyContent: "flex-end",
          paddingBottom: 16,
          zIndex: 5,
        }}
      >
        {/* Org Info */}
        <Animated.View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 16,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            flexDirection: "row",
            alignItems: "center",
            opacity: orgInfoOpacity,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#d8dee2",
              borderRadius: 8,
              marginRight: 12,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
                marginBottom: 4,
              }}
            >
              Calendar
            </Text>
            <Text style={{ fontSize: 14, color: "#2e7d32" }}>
              View events here
            </Text>
          </View>
        </Animated.View>

        {/* Org Name */}
        <Animated.Text
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            transform: [{ translateY: orgNameTranslateY }],
          }}
        >
          Calendar
        </Animated.Text>
      </Animated.View>

      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          left: 16,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.25)",
          borderRadius: 16,
          zIndex: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <View
          style={{
            width: 12,
            height: 12,
            borderLeftWidth: 2,
            borderBottomWidth: 2,
            borderColor: "#fff",
            transform: [{ rotate: "45deg" }],
          }}
        />
      </TouchableOpacity>

      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop: HEADER_EXPANDED + 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedDotColor: "orange",
            },
          }}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default CalendarPage;
