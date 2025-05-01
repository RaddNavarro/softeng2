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
  ToastAndroid,
} from "react-native";
import { COLORS } from "../components/colors";
import { Props } from "../navigation/props";
import MyHeaders from "./MyHeader";
import { Surface } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";
import { headerStyles } from "../styles/styles";
import Feather from "react-native-vector-icons/Feather";
import { MY_IP } from "../components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

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

const HEADER_EXPANDED = 210;
const HEADER_COLLAPSED = 120;

const StudentOrgs: React.FC<Props> = ({ navigation, route }) => {
  const { studentOrgsData } = route.params;

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.get(`http://${MY_IP}:5000/api/posts`);

      if (res) {
        let postsArray = [];
        res.data.map((data) => {
          if (data.studentOrgs === studentOrgsData.name) {
            postsArray.push(data);
          }
        });

        setPosts(postsArray);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const showToast = () => {
    Toast.show({
      type: "error",
      text1: "Already a member",
      visibilityTime: 10000,
    });
  };

  const joinOrg = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(
        `http://${MY_IP}:5000/api/studentOrgs/${studentOrgsData._id}`,
        {},
        { headers: { "x-auth-token": token } }
      );

      if (res.data.msg !== "Success") {
        console.log(res.data.msg);
        ToastAndroid.show(res.data.msg, ToastAndroid.SHORT);
        // Toast.show({
        //   type: "info",
        //   text1: "This is an info message",
        // });
        return;
      }

      console.log(res.data.msg);
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
              {studentOrgsData.name}
            </Text>
            <Text style={{ fontSize: 14, color: "#2e7d32" }}>
              {studentOrgsData.bio}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#DFBE73",
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
            }}
            onPress={joinOrg}
          >
            <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Follow</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Org Name */}
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
          {studentOrgsData.name}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Event Card */}
        <View
          style={{
            backgroundColor: "#E1E6D4",
            borderRadius: 32,
            padding: 16,
            marginHorizontal: 16,
            marginBottom: 24,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: 4,
                }}
              >
                Insert event here wow it's happening on
              </Text>
              <Text style={{ fontSize: 12, color: "#555" }}>
                24/1/1291 : 8:00AM - 10:00AM
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#DFBE73",
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
                Attend
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts */}
        {posts ? (
          <View style={{ paddingHorizontal: 16 }}>
            <FlatList
              data={posts}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={() => (
                <Text style={{ fontSize: 20 }}>No posts available</Text>
              )}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    elevation: 2,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 3,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {item.profile.firstName} {item.profile.lastName}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      backgroundColor: "#e0e0e0",
                      borderRadius: 6,
                      marginLeft: 12,
                    }}
                  />
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        ) : null}
      </Animated.ScrollView>

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
        </Surface>
      </Animated.View>
    </>
  );
};

export default StudentOrgs;
