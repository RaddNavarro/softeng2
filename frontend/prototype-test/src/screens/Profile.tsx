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
import { Surface } from "react-native-paper";
import { COLORS } from "../components/colors";
import { MY_IP } from "../components/config";

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

const Profile: React.FC<Props> = ({ navigation }) => {
  const navigate = useNavigation();
  const navigationRef = createNavigationContainerRef();

  const [backendErrorMsg, setBackendErrorMsg] = useState([]);
  const [profile, setProfile] = useState();

  useEffect(() => {
    fetchData();
  }, []);

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
      <View
        style={[logInStyles.container, { backgroundColor: COLORS.mintCream }]}
      >
        <Text>Profile Page</Text>
        {profile !== undefined && profile.user !== undefined ? (
          <>
            <Text>{profile.firstName}</Text>
            <Text>{profile.user.email}</Text>
          </>
        ) : (
          <Text>There is no profile for this user yet</Text>
        )}
        <TouchableOpacity onPress={signOut}>
          <Text>Sign Out</Text>
        </TouchableOpacity>
      </View>

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
