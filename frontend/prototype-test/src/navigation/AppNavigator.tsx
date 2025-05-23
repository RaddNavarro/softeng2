import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import LogIn from "../screens/LogIn";
import Home from "../screens/Home";
import Calendar from "../screens/Calendar";
import Profile from "../screens/Profile";
import Announcements from "../screens/Announcements";
import {
  Button,
  TouchableOpacity,
  Text,
  View,
  Alert,
  Animated,
  StyleSheet,
} from "react-native";
import { CurvedBottomBar } from "react-native-curved-bottom-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Ionicons from "react-native-vector-icons/Ionicons";
import { logInStyles } from "../styles/styles";
import Svg, { Path } from "react-native-svg";
import { Props } from "../navigation/props";
import Preferences from "../screens/Preferences";
import BrowseOrgs from "../screens/BrowseOrgs";
import MyHeaders from "../screens/MyHeader";
import StudentOrgs from "../screens/StudentOrgs";
import axios from "axios";
import CreatePost from "../screens/CreateEvents";
import ViewPost from "../screens/ViewPost";
import { MY_IP } from "../components/config";
import CreateEvents from "../screens/CreateEvents";
import DateComp from "../components/DateComp";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeScreenNavigator: React.FC<Props> = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  async function getData() {
    const data = await AsyncStorage.getItem("isLoggedIn");
    console.log(data, "at app .tsx");
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getData();
    if (isLoggedIn === null) {
      navigation.navigate("HomeScreenNavigator");
    }
  });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Rewards") {
            iconName = focused ? "rocket" : "rocket-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={"black"} />;
        },
        headerTitleAlign: "center",
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("AnnouncementsNav")}
              style={{ paddingHorizontal: 20 }}
            >
              <Ionicons name="notifications-outline" size={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />

      {/* <Tab.Screen name="Announcements" component={Announcements} /> */}
    </Tab.Navigator>
  );
};

const AnnouncementNav: React.FC<Props> = ({ navigation }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Announcements"
        component={Announcements}
        options={{
          title: "Create An Announcement",
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ paddingHorizontal: 10 }}
            >
              <Ionicons name="cloud-upload" size={25} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const status = await AsyncStorage.getItem("isLoggedIn");
        const token = await AsyncStorage.getItem("token");

        if (token) {
          // In the Ip address, change the ip address to your OWN ipv4 address which can be found in the cmd and typing 'ipconfig'
          const res2 = await axios.get(`http://${MY_IP}:5000/authUser`, {
            headers: { "x-auth-token": token },
          });
          if (res2.data.msg === "User is authenticated") {
            setIsLoggedIn(status === "true");
            console.log("authenticated");
          } else {
            setIsLoggedIn(status === "false");
            console.log("not auth");
          }
        } else {
          setIsLoggedIn(status === "false");
          console.log("not auth");
        }
      } catch (error) {
        setIsLoggedIn(false);
        console.log("not auth");
        console.error("Error fetching login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? "Home" : "LogIn"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateEvents" component={CreateEvents} />
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="BrowseOrgs" component={BrowseOrgs} />
        <Stack.Screen name="Calendar" component={Calendar} />
        <Stack.Screen name="StudentOrgs" component={StudentOrgs} />
        <Stack.Screen name="ViewPost" component={ViewPost} />
        {/* <Stack.Screen name="DateComp" component={DateComp} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
