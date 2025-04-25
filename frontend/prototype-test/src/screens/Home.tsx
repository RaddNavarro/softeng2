import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  Image,
  Animated,
  BackHandler,
  RefreshControl,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Props } from "../navigation/props";
import Ionicons from "react-native-vector-icons/Ionicons";
import { headerStyles, homeStyles, logInStyles } from "../styles/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LogIn from "./LogIn";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import MyHeaders from "./MyHeader";
import { clamp } from "react-native-reanimated";
import Icons, { icon } from "../components/Icons";
import { Surface } from "react-native-paper";
import { COLORS } from "../components/colors";
import { NetworkInfo } from "react-native-network-info";

const Stack = createNativeStackNavigator();

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

const Home: React.FC<Props> = ({ navigation }) => {
  const [ipAddress, setIpAddress] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      setIsLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    updateUserLoggedIn();
  }, []);

  const updateUserLoggedIn = async () => {
    axios.defaults.withCredentials = true;
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.post(
        "http://10.32.105.0:5000/api/auth/updateUsers",
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      if (res.data.errors) {
        console.log(res.data.errors[0].msg);
        console.log("nope");
      } else {
        console.log(res.data.hasLoggedIn, "updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle when user pressed back button in home screen
  useEffect(() => {
    const onBackPress = () => {
      Alert.alert(
        "Exit App",
        "Do you want to exit?",
        [
          {
            text: "Cancel",
            onPress: () => {
              // Do nothing
            },
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ],
        { cancelable: false }
      );

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

  // if (isLoading) {
  //   return (
  //     <SafeAreaView
  //       style={{
  //         flex: 1,
  //         backgroundColor: COLORS.mintCream,
  //         padding: StatusBar.currentHeight,
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <ActivityIndicator size="large" color="black" />
  //       <Text>Loading...</Text>
  //     </SafeAreaView>
  //   );
  // }

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
        <MyHeaders style={{ opacity }} />
      </Animated.View>

      {/* Content */}
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
            {/* test daata to see if the header animations work */}
            <Text style={{ fontSize: 100, top: 150 }}>{item.title}</Text>
            <Button
              title="Profile Page"
              onPress={() => navigation.navigate("Profile")}
            />

            <Button
              title="Announcements Page"
              onPress={() => navigation.navigate("Announcements")}
            />

            {/* insert data here */}
          </>
        )}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {/* Bottom Tab */}
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
                if (index === 1) {
                  navigation.navigate("BrowseOrgs");
                } else if (index === 3) {
                  navigation.navigate("Calendar");
                } else if (index === 4) {
                  navigation.navigate("Profile");
                }
              }}
            >
              <Icons
                icon={item.type}
                name={index === 0 ? item.ico1 : item.ico2}
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

export default Home;
