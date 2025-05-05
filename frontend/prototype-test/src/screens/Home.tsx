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
  Modal,
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
import NetInfo from "@react-native-community/netinfo";
import { getIpAddressAsync } from "expo-network";
import { MY_IP } from "../components/config";
import dayjs from "dayjs";

const Stack = createNativeStackNavigator();

const events = [
  {
    id: "1",
    title: "CREAM Week 2023",
    description:
      "Career readiness and mentorship week with industry professionals",
    date: "April 17 - 25 (in 1 week)",
    location: "Student Center",
    image: "https://via.placeholder.com/100",
    category: "career",
    important: true,
  },
  {
    id: "2",
    title: "Final Exam Prep Session",
    description: "Group study for calculus final exam",
    date: "April 20 at 3:00 PM",
    location: "Library Room 202",
    image: "https://via.placeholder.com/100",
    category: "academic",
    important: true,
  },
  {
    id: "3",
    title: "Campus Spring Festival",
    description: "Annual celebration with music, food, and activities",
    date: "April 22 - 23",
    location: "Main Quad",
    image: "https://via.placeholder.com/100",
    category: "social",
    important: false,
  },
];

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

const renderEvent = ({ item }) => (
  <View style={homeStyles.eventCard}>
    <Text style={homeStyles.eventTitle}>{item.title}</Text>
    <Text style={homeStyles.eventDate}>{item.date}</Text>
    <Text style={homeStyles.eventLocation}>{item.location}</Text>
  </View>
);

const EventsSection = () => {
  return (
    <Animated.View
      style={[
        homeStyles.announcementsSection,
        { paddingTop: 150 + 16, paddingBottom: 32 },
      ]}
    >
      <Text style={homeStyles.sectionTitle}>Announcements</Text>
      {events.length === 0 ? (
        <Text style={homeStyles.emptyText}>No announcements available.</Text>
      ) : (
        <Animated.FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={events}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={homeStyles.horizontalList}
        />
      )}
      <Text style={homeStyles.postSectionTitle}>Latest Posts</Text>
    </Animated.View>
  );
};

const Home: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [allowed, setAllowed] = useState(false);
  // const [auth, setAuth] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
      fetchPosts();
    }, 2000);
  }, []);

  useEffect(() => {
    updateUserLoggedIn();
    // checkAuth();
  }, []);

  // const checkAuth = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     const res = await axios.get("http://192.168.1.13:5000/authUser", {
  //       headers: { "x-auth-token": token },
  //     });

  //     if (res.data.msg === "Success") {
  //       setAuth(true);
  //       console.log("authenticated");
  //     } else {
  //       setAuth(false);
  //       console.log("not auth");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const updateUserLoggedIn = async () => {
    axios.defaults.withCredentials = true;
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.post(
        `http://${MY_IP}:5000/api/auth/updateUsers`,
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

  useEffect(() => {
    fetchPosts();
  }, [posts]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://${MY_IP}:5000/api/posts`);

      if (res) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`http://${MY_IP}:5000/api/profile/me`, {
        headers: { "x-auth-token": token },
      });

      if (res.data.msg === "There is no profile for this user") {
        setAllowed(false);
        console.log("not allowed");
      } else {
        setAllowed(true);
        console.log("allowed");
      }
    } catch (error) {
      console.error(error);
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

  const deletePost = async (postsId) => {
    try {
      // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
      const res = await axios.delete(
        `http://${MY_IP}:5000/api/posts/${postsId}`
      );
      if (res.data.msg === "Post not found") {
        console.log(res.data.msg);
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const RenderPosts = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ViewPost", { postData: item })}
      >
        <View key={item.id} style={homeStyles.card}>
          {item.image && (
            <Image source={{ uri: item.image }} style={homeStyles.image} />
          )}
          <Text style={homeStyles.postTitle}>{item.title}</Text>
          {/* <Text style={homeStyles.postDate}>{item.date}</Text> */}
          <Text style={homeStyles.postBody}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <MyHeaders style={{ opacity }} />
      </Animated.View>

      {/* Content */}
      <Animated.View style={[homeStyles.postsSection, { paddingBottom: 85 }]}>
        <Animated.FlatList
          // style={{ backgroundColor: "#E7F0E6" }}
          contentContainerStyle={[homeStyles.verticalList]}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          data={posts}
          keyExtractor={(item, index) => item.title + index.toString()}
          renderItem={RenderPosts}
          ListEmptyComponent={() => (
            <Text style={{ fontSize: 20 }}>No posts available</Text>
          )}
          ListHeaderComponent={EventsSection}
          onMomentumScrollBegin={onMomentumScrollBegin}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollEndDrag={onScrollEndDrag}
          scrollEventThrottle={1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Animated.View>
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
              disabled={index === 2 ? (allowed ? false : true) : false}
              key={index}
              style={[index === 2 && headerStyles.plusIconStyles]}
              onPress={() => {
                if (index === 1) {
                  navigation.navigate("BrowseOrgs");
                } else if (index === 2) {
                  navigation.navigate("CreatePost");
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
    //   ) : null}
    // </>
  );
};

export default Home;
