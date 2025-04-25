import React, { ReactNode } from "react";
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Props } from "../navigation/props";
import { logInStyles } from "../styles/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface DismissKeyboardProps {
  children: ReactNode;
}

const DismissKeyboard: React.FC<DismissKeyboardProps> = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendErrorMsg, setBackendErrorMsg] = useState<string[]>([]);
  const [dataa, setDataa] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.post("http://192.168.1.13:5000/api/auth", {
        email,
        password,
      });
      if (res.data.errors) {
        setBackendErrorMsg([res.data.errors[0].msg]);
      } else {
        setBackendErrorMsg([]);
        AsyncStorage.setItem("token", res.data.token);
        AsyncStorage.setItem("isLoggedIn", JSON.stringify(true));

        const res2 = await axios.get("http://192.168.1.13:5000/api/auth", {
          headers: { "x-auth-token": res.data.token },
        });
        if (res2.data.hasLoggedIn === true) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("Preferences");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DismissKeyboard>
      <View style={logInStyles.container}>
        <Image
          source={require("../database/images/logo.png")}
          style={logInStyles.logo}
        />

        <Text style={logInStyles.label}>Email</Text>
        <TextInput
          style={[
            logInStyles.input,
            backendErrorMsg.length > 0 ? logInStyles.errorInput : null,
          ]}
          placeholder="Enter Email"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#555"
        />

        <Text style={logInStyles.label}>Password</Text>
        <TextInput
          style={[
            logInStyles.input,
            backendErrorMsg.length > 0 ? logInStyles.errorInput : null,
          ]}
          placeholder="Enter Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          placeholderTextColor="#555"
        />

        {backendErrorMsg ? (
          <Text style={logInStyles.errorText}>{backendErrorMsg[0]}</Text>
        ) : null}

        <TouchableOpacity
          style={logInStyles.button}
          disabled={loading}
          onPress={handleSubmit}
        >
          <Text style={logInStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={logInStyles.forgotPassword}>Forgot password?</Text>
      </View>
    </DismissKeyboard>
  );
};

export default LogIn;
