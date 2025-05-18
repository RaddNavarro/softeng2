import {
  Text,
  View,
  Button,
  Platform,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Alert,
  Animated,
  Switch,
  ScrollView,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Props } from "../navigation/props";
import { headerStyles, logInStyles } from "../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNavigationContainerRef } from "@react-navigation/native";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Icons, { icon } from "../components/Icons";
import MyHeaders from "./MyHeader";
import Feather from "react-native-vector-icons/Feather";
import { Surface } from "react-native-paper";
import { COLORS } from "../components/colors";
import { MY_IP } from "../components/config";

const profileDetails = {
  id: "user001",
  name: "RandomNameHere",
  bio: "Quick Bio Insert Here//role maybe? like student/teacher/head of org ",
};

const dummyInfo = [
  { id: "memberSince", label: "Member Since", value: "January 2021" },
];

const settingToggles = [
  { id: "notifications", label: "Push Notifications", value: true },
  { id: "emailUpdates", label: "Email Updates", value: true },
];

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const Profile: React.FC<Props> = ({ navigation }) => {
  const navigate = useNavigation();
  const navigationRef = createNavigationContainerRef();

  const [backendErrorMsg, setBackendErrorMsg] = useState([]);
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    await AsyncStorage.getItem("token");

    axios.defaults.withCredentials = true;
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://${MY_IP}:5000/api/profile/me`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (res.data.msg) {
        console.log(res.data.msg);
      }
      if (res.data.errors) {
        setBackendErrorMsg([res.data.errors[0].msg]);
      } else {
        setBackendErrorMsg([]);

        setProfile(res.data);
      }
    } catch (error) {
      console.log(error);
      console.log("bruhh why profile");
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
  function signOut() {
    AsyncStorage.removeItem("isLoggedIn");
    AsyncStorage.removeItem("token");

    navigation.navigate("LogIn");
    console.log("out");
  }

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
      <View
        style={{
          backgroundColor: "#278086",
          paddingTop: 60,
          paddingBottom: 32,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          paddingHorizontal: 16,
        }}
      >
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

        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 12,
            padding: 16,
            elevation: 3,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            marginTop: 32,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: "#d8dee2",
              borderRadius: 20,
              marginRight: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {profile && (
              <Text style={{ color: "#555", fontWeight: "bold", fontSize: 30 }}>
                {profile.firstName.charAt(0)}
                {profile.lastName.charAt(0)}
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            {profile && (
              <>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 4,
                  }}
                >
                  {profile.firstName} {profile.lastName}
                </Text>
                <Text style={{ fontSize: 14, color: "#2e7d32" }}>
                  {/* {profile.bio} */}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dummy Info Section */}
        <View
          style={{
            backgroundColor: "#ffffff",
            marginTop: 24,
            borderRadius: 16,
            padding: 16,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 12,
              color: "#333",
            }}
          >
            Joined Organizations
          </Text>

          {profile !== undefined ? (
            profile.orgStatus.map((item) => (
              <View key={item._id} style={{ marginBottom: 12 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#333" }}
                >
                  {item.orgName}
                </Text>
                <Text style={{ fontSize: 14, color: "#555" }}>
                  {item.orgRole}
                </Text>
              </View>
            ))
          ) : (
            <Text>No profile</Text>
          )}
        </View>

        {/* Settings Section */}
        <View
          style={{
            backgroundColor: "#ffffff",
            marginTop: 24,
            borderRadius: 16,
            padding: 16,
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 12,
              color: "#333",
            }}
          >
            Profile Settings
          </Text>

          {settingToggles.map((setting) => (
            <View
              key={setting.id}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "#333" }}>
                {setting.label}
              </Text>
              <Switch value={setting.value} />
            </View>
          ))}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.fernGreen,
              borderRadius: 10,
              marginBottom: 90,
            }}
            onPress={signOut}
          >
            <Text style={{ color: "#fefefe", padding: 10, fontWeight: 700 }}>
              LOG OUT
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                } else if (index === 3) {
                  navigation.navigate("Calendar");
                }
              }}
            >
              <Icons
                icon={item.type}
                name={index === 4 ? item.ico1 : item.ico2}
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

export default Profile;
