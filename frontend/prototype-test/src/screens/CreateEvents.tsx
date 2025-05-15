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
  Platform,
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
import { MY_IP } from "../components/config";
import DateTimePicker from "@react-native-community/datetimepicker";

const HEADER_EXPANDED = 120;
const HEADER_COLLAPSED = 120;

const CreateEvents: React.FC<Props> = ({ navigation }) => {
  const HEADER_HEIGHT = 150;

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [text, setText] = useState("Empty");

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
      const res = await axios.get(`http://${MY_IP}:5000/api/studentOrgs`);
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED - HEADER_COLLAPSED],
    outputRange: [HEADER_EXPANDED, HEADER_COLLAPSED],
    extrapolate: "clamp",
  });

  const orgNameTranslateY = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate =
      tempDate.getDate() +
      "/" +
      (tempDate.getMonth() + 1) +
      "/" +
      tempDate.getFullYear();

    let fTime =
      "Hours" + tempDate.getHours() + " | Minutes: " + tempDate.getMinutes();

    setText(fDate + "\n" + fTime);

    console.log(fDate + "(" + fTime + ")");
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const addPost = async () => {
    // Code here to add post
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `http://${MY_IP}:5000/api/posts`,
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
          Create Event
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

        <Text>{text}</Text>
        <Button title="Pick a Date" onPress={() => showMode("date")} />
        <Button title="Pick a time" onPress={() => showMode("time")} />

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChangeDate}
          />
        )}

        {backendErrorMsg
          ? backendErrorMsg.map((error, index) => (
              <Text key={index}>{error}</Text>
            ))
          : null}

        <Button title="Submit" color="green" onPress={() => {}} />
      </Animated.ScrollView>
    </>
  );
};

export default CreateEvents;
