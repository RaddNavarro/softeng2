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
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { COLORS } from "../components/colors";
import { Props } from "../navigation/props";
import MyHeaders from "./MyHeader";
import { Surface, TextInput } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";
import { createPostStyles, headerStyles, homeStyles } from "../styles/styles";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MY_IP } from "../components/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const PostModal: React.FC<Props> = ({ navigation }) => {
  const [backendErrorMsg, setBackendErrorMsg] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [studentOrgs, setStudentOrgs] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [studentOrg, setStudentOrg] = useState([]);

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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
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

  const createPost = async () => {
    // Code here to add post
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        `http://${MY_IP}:5000/api/posts`,
        { newPostTitle, newPostBody, studentOrgs, selectedImage },
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

  return (
    <>
      <View style={homeStyles.centeredView}>
        <View style={homeStyles.modalView}>
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.modalTitle}>Create New Post</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={homeStyles.modalContent}>
            <Text style={homeStyles.inputLabel}>Title</Text>
            <TextInput
              style={homeStyles.input}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              placeholder="Enter post title"
            />

            <Text style={homeStyles.inputLabel}>Content</Text>
            <TextInput
              style={[homeStyles.input, homeStyles.textArea]}
              value={newPostBody}
              onChangeText={setNewPostBody}
              placeholder="What's on your mind?"
              multiline
              numberOfLines={4}
            />

            <Text style={homeStyles.inputLabel}>Image</Text>
            <TouchableOpacity
              style={homeStyles.imagePicker}
              onPress={pickImage}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={homeStyles.previewImage}
                />
              ) : (
                <View style={homeStyles.placeholderImage}>
                  <Ionicons name="image-outline" size={40} color="#aaa" />
                  <Text style={homeStyles.placeholderText}>
                    Tap to select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

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
              value={studentOrgs}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setStudentOrgs(item.name);
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

            <TouchableOpacity
              style={homeStyles.postButton}
              onPress={createPost}
            >
              <Text style={homeStyles.postButtonText}>Create Post</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default PostModal;
