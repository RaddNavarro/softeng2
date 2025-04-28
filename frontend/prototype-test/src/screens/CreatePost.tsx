import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  BackHandler,
  Button,
  RefreshControl,
} from "react-native";
import { COLORS } from "../components/colors";
import { Props } from "../navigation/props";
import MyHeaders from "./MyHeader";
import { Surface, TextInput } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";
import { createPostStyles, headerStyles } from "../styles/styles";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dummyPosts = [
  { id: "1", title: "Insert post here hehe hoho", username: "User One" },
  { id: "2", title: "Insert post here hehe hoho", username: "User Two" },
  { id: "3", title: "Insert post here hehe hoho", username: "User Three" },
  { id: "4", title: "Insert post here hehe hoho", username: "User Four" },
  { id: "5", title: "Insert post here hehe hoho", username: "User Five" },
];

const data = [
  { label: "Item 1", value: "1" },
  { label: "Item 2", value: "2" },
  { label: "Item 3", value: "3" },
  { label: "Item 4", value: "4" },
  { label: "Item 5", value: "5" },
  { label: "Item 6", value: "6" },
  { label: "Item 7", value: "7" },
  { label: "Item 8", value: "8" },
];

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const HEADER_EXPANDED = 120;
const HEADER_COLLAPSED = 120;

const CreatePost: React.FC<Props> = ({ navigation }) => {
  const HEADER_HEIGHT = 150;

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const [studentOrgs, setStudentOrgs] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [studentOrg, setStudentOrg] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [backendErrorMsg, setBackendErrorMsg] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.get("http://192.168.1.13:5000/api/studentOrgs");
      console.log(res.data[0].name);

      if (res) {
        setStudentOrg(res.data);
      } else {
        console.log("Server Error");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderLabel = () => {
    if (studentOrgs || isFocus) {
      return (
        <Text style={[createPostStyles.label, isFocus && { color: "blue" }]}>
          Post to which Org
        </Text>
      );
    }
    return null;
  };

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
    inputRange: [0, 50],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const addPost = async () => {
    // Code here to add post
    try {
      const token = await AsyncStorage.getItem("token");

      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.post(
        "http://192.168.1.13:5000/api/posts",
        { title, description, studentOrgs },
        { headers: { "x-auth-token": token } }
      );
      console.log("here");
      if (res.data.errors) {
        setBackendErrorMsg([res.data.errors[0].msg]);
        console.log("Nope");
      } else {
        setBackendErrorMsg([]);
        console.log("submitted");
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Header */}
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
        <Animated.Text
          style={{
            position: "absolute",
            bottom: 13,
            left: 16,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
            transform: [{ translateY: orgNameTranslateY }],
          }}
        >
          Create Post
        </Animated.Text>
      </Animated.View>

      {/* back button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          left: 16,
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
          zIndex: 10,
        }}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={32} color="white" />
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
        {/* Form goes here */}
        <TextInput
          placeholder="Enter Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
        />
        {renderLabel()}
        <Dropdown
          style={[
            createPostStyles.dropdown,
            { marginTop: 100 },
            isFocus && { borderColor: "blue" },
          ]}
          placeholderStyle={createPostStyles.placeholderStyle}
          selectedTextStyle={createPostStyles.selectedTextStyle}
          inputSearchStyle={createPostStyles.inputSearchStyle}
          iconStyle={createPostStyles.iconStyle}
          data={studentOrg}
          search
          maxHeight={300}
          labelField="name"
          valueField="name"
          placeholder={!isFocus ? "Choose Student Org..." : "..."}
          searchPlaceholder="Search..."
          value={studentOrgs}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setStudentOrgs(item.name);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={createPostStyles.icon}
              color={isFocus ? "blue" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />
        {backendErrorMsg
          ? backendErrorMsg.map((error, index) => (
              <Text key={index}>{error}</Text>
            ))
          : null}

        <Button title="Submit" color="green" onPress={addPost} />
      </Animated.ScrollView>
    </>
  );
};

export default CreatePost;
