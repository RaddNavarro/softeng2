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
  TextInput,
} from "react-native";
import { COLORS } from "../components/colors";
import { Props } from "../navigation/props";
import MyHeaders from "./MyHeader";
import { Surface } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";
import { createPostStyles, headerStyles } from "../styles/styles";
import Feather from "react-native-vector-icons/Feather";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MY_IP } from "../components/config";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateComp from "../components/DateComp";
import { dateCompStyles } from "../styles/styles";
import { FontAwesome6 } from "@expo/vector-icons";

const HEADER_EXPANDED = 120;
const HEADER_COLLAPSED = 120;

const CreateEvents: React.FC<Props> = ({ navigation }) => {
  const HEADER_HEIGHT = 150;

  const scrollY = useRef(new Animated.Value(0)).current;
  const offsetAnim = useRef(new Animated.Value(0)).current;

  const [fromShow, setFromShow] = useState(false);
  const [toShow, setToShow] = useState(false);
  const [showFromTime, setFromShowTime] = useState(false);
  const [showToTime, setToShowTime] = useState(false);
  const [eventDateFrom, setEventDateFrom] = useState<Date | null>();

  const [eventDateTo, setEventDateTo] = useState<Date | null>();

  const [studentOrgs, setStudentOrgs] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [studentOrg, setStudentOrg] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventPlace, setEventPlace] = useState("");
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

  const onChangeFromDate = (event, selectedDate) => {
    setFromShow(false);

    if (selectedDate) {
      setEventDateFrom(selectedDate);
    }
  };

  const onChangeFromTime = (event, selectedDate) => {
    setFromShowTime(false);

    if (selectedDate) {
      setEventDateFrom(selectedDate);
    }
  };

  const onChangeToDate = (event, selectedDate) => {
    setToShow(false);

    if (selectedDate) {
      setEventDateTo(selectedDate);
    }
  };

  const onChangeToTime = (event, selectedDate) => {
    setToShowTime(false);

    if (selectedDate) {
      setEventDateTo(selectedDate);
    }
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

  const createEvent = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `http://${MY_IP}:5000/api/events/${studentOrgs?._id}`,
        {
          title,
          description,
          eventDateFrom,
          eventDateTo,
          eventPlace,
        },
        { headers: { "x-auth-token": token } }
      );

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
          padding: 10,
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
          style={dateCompStyles.inputContainer}
        />
        <TextInput
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
          style={dateCompStyles.inputContainer}
        />
        <TextInput
          placeholder="Enter Place of Event"
          value={eventPlace}
          onChangeText={setEventPlace}
          style={dateCompStyles.inputContainer}
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
          value={studentOrgs?.name}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setStudentOrgs(item);
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
        {/* <View style={{ flex: 1, justifyContent: "center" }}>
          <DateComp />
        </View> */}

        <View style={{ flex: 1, justifyContent: "center" }}>
          <>
            <Text style={{ fontWeight: 700, fontSize: 20 }}>From Date</Text>
            <Text>Date</Text>
            <TouchableOpacity
              onPress={() => setFromShow(true)}
              style={dateCompStyles.inputContainer}
            >
              <FontAwesome6 name="calendar" size={20} color="#888" />
              <TextInput
                placeholder="Date"
                editable={false}
                value={
                  eventDateFrom
                    ? new Date(eventDateFrom).toLocaleDateString()
                    : ""
                }
              />
            </TouchableOpacity>
            {/* <Text>{formData.date}</Text> */}
            {fromShow && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onChangeFromDate}
              />
            )}
          </>
          <>
            <Text>Time</Text>
            <TouchableOpacity
              onPress={() => setFromShowTime(true)}
              style={dateCompStyles.inputContainer}
            >
              <FontAwesome6 name="clock" size={20} color="#888" />
              <TextInput
                placeholder="Time"
                editable={false}
                value={
                  eventDateFrom
                    ? new Date(eventDateFrom).toLocaleTimeString("en-US")
                    : ""
                }
                style={dateCompStyles.input}
              />
            </TouchableOpacity>
            {/* <Text>{formData.date}</Text> */}
            {showFromTime && (
              <DateTimePicker
                value={new Date(eventDateFrom)}
                mode="time"
                display="default"
                onChange={onChangeFromTime}
              />
            )}
          </>
        </View>
        <Text>{eventDateFrom?.toJSON()}</Text>
        {/* <Text>{fromFormData.time}</Text> */}

        <View style={{ flex: 1, justifyContent: "center" }}>
          <>
            <Text style={{ fontWeight: 700, fontSize: 20 }}>To Date</Text>
            <Text>Date</Text>
            <TouchableOpacity
              onPress={() => setToShow(true)}
              style={dateCompStyles.inputContainer}
              disabled={eventDateFrom ? false : true}
            >
              <FontAwesome6 name="calendar" size={20} color="#888" />
              <TextInput
                placeholder="Date"
                editable={false}
                value={
                  eventDateTo ? new Date(eventDateTo).toLocaleDateString() : ""
                }
              />
            </TouchableOpacity>
            {/* <Text>{formData.date}</Text> */}
            {toShow && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onChangeToDate}
              />
            )}
          </>
          <>
            <Text>Time</Text>
            <TouchableOpacity
              onPress={() => setToShowTime(true)}
              style={dateCompStyles.inputContainer}
              disabled={eventDateFrom ? false : true}
            >
              <FontAwesome6 name="clock" size={20} color="#888" />
              <TextInput
                placeholder="Time"
                editable={false}
                value={
                  eventDateTo
                    ? new Date(eventDateTo).toLocaleTimeString("en-US")
                    : ""
                }
                style={dateCompStyles.input}
              />
            </TouchableOpacity>
            {/* <Text>{formData.date}</Text> */}
            {showToTime && (
              <DateTimePicker
                value={new Date(eventDateTo)}
                mode="time"
                display="default"
                onChange={onChangeToTime}
              />
            )}
            <Text>{eventDateTo?.toJSON()}</Text>
            {/* <Text>{toFormData.time}</Text> */}
          </>
        </View>
        {backendErrorMsg
          ? backendErrorMsg.map((error, index) => (
              <Text key={index}>{error}</Text>
            ))
          : null}

        <Button title="Submit" color="green" onPress={createEvent} />
      </Animated.ScrollView>
    </>
  );
};

export default CreateEvents;
