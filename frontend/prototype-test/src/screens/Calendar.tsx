import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  BackHandler,
  Animated,
  TouchableOpacity,
  Button,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { todayString } from "react-native-calendars/src/expandableCalendar/commons";
import { headerStyles, logInStyles } from "../styles/styles";
import { Props } from "../navigation/props";
import { Surface } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import MyHeaders from "./MyHeader";

const dummyPosts = [
  { id: "1", title: "Insert post here hehe hoho", username: "User One" },
  { id: "2", title: "Insert post here hehe hoho", username: "User Two" },
  { id: "3", title: "Insert post here hehe hoho", username: "User Three" },
  { id: "4", title: "Insert post here hehe hoho", username: "User Four" },
  { id: "5", title: "Insert post here hehe hoho", username: "User Five" },
];

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const CalendarPage: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const onBackPress = () => {
      navigation.goBack();

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, []);

  const HEADER_HEIGHT = 150;

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollY.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: "clamp",
      }),
      offsetAnim
    ),
    0,
    HEADER_HEIGHT
  );

  var _clampedScrollValue = 0;
  var _offsetValue = 0;
  var _scrollValue = 0;

  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const diff = value - _scrollValue;
      _scrollValue = value;
      _clampedScrollValue = Math.min(
        Math.max(_clampedScrollValue * diff, 0),
        HEADER_HEIGHT
      );
    });
    offsetAnim.addListener(({ value }) => {
      _offsetValue = value;
    });
  }, []);

  var scrollEndTimer = null;
  const onMomentumScrollBegin = () => {
    clearTimeout(scrollEndTimer);
  };

  const onMomentumScrollEnd = () => {
    const toValue =
      _scrollValue > HEADER_HEIGHT && _clampedScrollValue > HEADER_HEIGHT / 2
        ? _offsetValue + HEADER_HEIGHT
        : _offsetValue - HEADER_HEIGHT;

    Animated.timing(offsetAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const onScrollEndDrag = () => {
    scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);
  };

  const headerTranslate = clampedScroll.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const opacity = clampedScroll.interpolate({
    inputRange: [0, HEADER_HEIGHT - 20, HEADER_HEIGHT],
    outputRange: [1, 0.01, 0],
    extrapolate: "clamp",
  });

  const bottomTabTranslate = clampedScroll.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, HEADER_HEIGHT * 2],
    extrapolate: "clamp",
  });

  return (
    <>
      <Animated.View
        style={[
          headerStyles.view,
          {
            top: 0,
            zIndex: 1,
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <MyHeaders back style={{ opacity }} />
      </Animated.View>
      <Animated.FlatList
        style={{ backgroundColor: "#E7F0E6" }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        data={dummyPosts}
        keyExtractor={(item, index) => item.title + index.toString()}
        renderItem={({ item }) => (
          <>
            {/* insert data here */}
            <View
              style={{
                top: 150,
              }}
            >
              <Text>Calendar Page</Text>
              <Text>{item.title}</Text>
            </View>
          </>
        )}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
      />

      <Animated.View
        style={[
          headerStyles.view,
          headerStyles.bottomBar,
          {
            bottom: 0,
            zIndex: 1,
            transform: [{ translateY: bottomTabTranslate }],
          },
        ]}
      >
        <Surface style={headerStyles.rowContainer}>
          {tabIcons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[index === 2 && headerStyles.plusIconStyles]}
              onPress={() => {
                if (index === 0) {
                  navigation.navigate("Home");
                } else if (index === 1) {
                  navigation.navigate("BrowseOrgs");
                } else if (index === 4) {
                  navigation.navigate("Profile");
                }
              }}
            >
              <Icons
                icon={item.type}
                name={index === 3 ? item.ico1 : item.ico2}
                color={index === 2 ? "white" : "black"}
                size={index === 2 && 34}
              />
            </TouchableOpacity>
          ))}
          {/* <MyHeaders back /> */}
        </Surface>
      </Animated.View>
    </>
  );
};

export default CalendarPage;
