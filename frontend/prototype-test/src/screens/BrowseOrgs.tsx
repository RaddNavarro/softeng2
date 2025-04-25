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
import { browseOrgsStyles, headerStyles } from "../styles/styles";
import MyHeaders from "./MyHeader";
import { Surface } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";

const mockData = new Array(12).fill(null).map((_, index) => ({
  id: index.toString(),
  name: "Name Here",
  category: "[Art/Fitness]",
}));

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const dummyPosts = [
  { id: "1", title: "Insert post here hehe hoho", username: "User One" },
  { id: "2", title: "Insert post here hehe hoho", username: "User Two" },
  { id: "3", title: "Insert post here hehe hoho", username: "User Three" },
  { id: "4", title: "Insert post here hehe hoho", username: "User Four" },
  { id: "5", title: "Insert post here hehe hoho", username: "User Five" },
];

const BrowseOrgs: React.FC<Props> = ({ navigation }) => {
  const [studentOrgs, setStudentOrgs] = useState();
  const [backendErrorMsg, setBackendErrorMsg] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.get("http://10.32.105.0:5000/api/studentOrgs");

      if (res.data.msg) {
        console.log(res.data.msg);
      }
      if (res.data.error) {
        setBackendErrorMsg([res.data.errors[0]]);
      } else {
        setBackendErrorMsg([]);

        setStudentOrgs(res.data);
      }
    } catch (error) {
      console.error(error);
    }
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

  const StudentOrgsCard = ({ item }) => {
    return (
      <View style={browseOrgsStyles.card}>
        <View style={browseOrgsStyles.imagePlaceholder} />
        <Text style={browseOrgsStyles.name}>{item.name}</Text>
        <Text style={browseOrgsStyles.category}>{item.category}</Text>
      </View>
    );
  };

  return (
    <>
      {/* Header */}
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
        data={studentOrgs}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={browseOrgsStyles.list}
        renderItem={StudentOrgsCard}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                } else if (index === 3) {
                  navigation.navigate("Calendar");
                } else if (index === 4) {
                  navigation.navigate("Profile");
                }
              }}
            >
              <Icons
                icon={item.type}
                name={index === 1 ? item.ico1 : item.ico2}
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

export default BrowseOrgs;
