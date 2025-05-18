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
import dayjs from "dayjs";

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const members = [
  { id: "1", name: "member 1" },
  { id: "2", name: "member 2" },
  { id: "3", name: "member 3" },
  { id: "4", name: "member 4" },
  { id: "5", name: "member 5" },
  { id: "6", name: "member 6" },
  { id: "7", name: "member 7" },
  { id: "8", name: "member 8" },
  { id: "9", name: "member 9" },
  { id: "10", name: "member 10" },
];

const HEADER_EXPANDED = 210;
const HEADER_COLLAPSED = 120;

const StudentOrgs: React.FC<Props> = ({ navigation, route }) => {
  const { studentOrgsData } = route.params;

  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [members, setMembers] = useState([]);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
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
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://${MY_IP}:5000/api/events`);

      if (res) {
        let eventsArray = [];
        res.data.map((data) => {
          if (data.studentOrg.name === studentOrgsData.name) {
            eventsArray.push(data);
          }
        });

        setEvents(eventsArray);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfiles = async () => {
    try {
      let membersArray = [];
      const res = await axios.get(`http://${MY_IP}:5000/api/profile`);
      res.data.forEach((profile) => {
        profile.orgStatus.forEach((stat) => {
          if (stat.orgID === studentOrgsData._id) {
            membersArray.push(profile);
          }
        });
      });
      setMembers(membersArray);

      if (res) {
        setProfiles(res.data);
      } else {
        setProfiles([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const filterProfile = () => {
  //   profiles.forEach((profile) => {
  //     profile.orgStatus.forEach((stat) => {
  //       if (stat.orgID === studentOrgsData._id) {
  //         setMembers((prev) => [...prev, profile]);
  //       }
  //     });
  //   });
  // };

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
  function openSlideMenu() {
    setMenuOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  function closeSlideMenu() {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuOpen(false));
  }

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

      <TouchableOpacity
        onPress={openSlideMenu}
        style={{
          position: "absolute",
          top: 20,
          right: 16,
          width: 32,
          height: 32,
          // justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.25)",
          borderRadius: 16,
          zIndex: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 5,
        }}
      >
        {/* 3 dots */}
        <View
          style={{
            width: 6,
            height: 6,
            backgroundColor: "#fff",
            borderRadius: 3,
          }}
        />
        <View
          style={{
            width: 6,
            height: 6,
            backgroundColor: "#fff",
            borderRadius: 3,
          }}
        />
        <View
          style={{
            width: 6,
            height: 6,
            backgroundColor: "#fff",
            borderRadius: 3,
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
                Insert announcements here wow it's happening on
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

        {/* EVENTS */}
        {events ? (
          <View style={{ paddingHorizontal: 16 }}>
            <FlatList
              data={events}
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
                    <Text style={{ fontSize: 14, color: "#333" }}>
                      {item.description}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {dayjs(item.eventDateFrom).format("MMMM D, YYYY")}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {dayjs(item.eventDateFrom).format("hh:mm A")} -{" "}
                      {dayjs(item.eventDateTo).format("hh:mm A")}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#666" }}>
                      {item.studentOrg.name}
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

      {menuOpen && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "100%",
            backgroundColor: "#ffffff",
            transform: [{ translateX: slideAnim }],
            zIndex: 20,
            paddingTop: 60,
            paddingHorizontal: 20,
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={closeSlideMenu}
            style={{ alignSelf: "flex-end", marginBottom: 20 }}
          >
            <Text
              style={{ fontSize: 16, color: "#278086", fontWeight: "bold" }}
            >
              Close
            </Text>
          </TouchableOpacity>

          {/* Members List */}
          <FlatList
            data={members}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "#d8dee2",
                      borderRadius: 20,
                      marginRight: 16,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#555", fontWeight: "bold" }}>
                      {item.firstName.charAt(0)}
                      {item.lastName.charAt(0)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, color: "#333" }}>
                    {item.firstName} {item.lastName}
                  </Text>
                  {item.orgStatus &&
                    item.orgStatus.map((stat) => {
                      if (stat.orgID === studentOrgsData._id) {
                        return (
                          <Text
                            style={{ marginLeft: 10, color: "grey" }}
                            key={stat.orgID}
                          >
                            {stat.orgRole}
                          </Text>
                        );
                      }
                    })}
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}

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
