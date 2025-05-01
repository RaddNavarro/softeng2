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
  Keyboard,
} from "react-native";
import { COLORS } from "../components/colors";
import { Props } from "../navigation/props";
import MyHeaders from "./MyHeader";
import { Surface, TextInput } from "react-native-paper";
import Icons, { icon } from "../components/Icons";
import axios from "axios";
import { headerStyles } from "../styles/styles";
import Feather from "react-native-vector-icons/Feather";
import { MY_IP } from "../components/config";

const tabIcons = [
  { ico1: "home", ico2: "home-outline", type: icon.Ionicons },
  { ico1: "people", ico2: "people-outline", type: icon.Ionicons },
  { ico1: "add-outline", ico2: "add-outline", type: icon.Ionicons },
  { ico1: "calendar", ico2: "calendar-outline", type: icon.Ionicons },
  { ico1: "person", ico2: "person-outline", type: icon.Ionicons },
];

interface Comment {
  body: String;
  comments: Array<Comment>;
}

const dummyComments: Array<Comment> = [
  {
    body: "This is comment 1",
    comments: [],
  },
  {
    body: "This is comment 2",
    comments: [],
  },
  {
    body: "This is comment 3",
    comments: [],
  },
];

const HEADER_EXPANDED = 210;
const HEADER_COLLAPSED = 120;

interface CommentInputProps {
  onComment: (newComment: Comment) => void;
}

const CommentInput = ({ onComment }: CommentInputProps) => {
  const [commentBody, setCommentBody] = useState("");
  return (
    <View>
      <TextInput
        placeholder="What are your thoughts?"
        value={commentBody}
        onChangeText={setCommentBody}
      />
      <TouchableOpacity
        style={{ padding: 10, borderWidth: 1, width: 88, marginBottom: 20 }}
        onPress={() => {
          onComment({ body: commentBody, comments: [] });
          setCommentBody("");
        }}
      >
        <Text>Comment</Text>
      </TouchableOpacity>
    </View>
  );
};
interface CommentItemProps {
  comment: Comment;
}

const RenderComment = ({ comment }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState(comment.comments);

  const onComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 10,
        flex: 1,
        flexDirection: "column",
        padding: 4,
      }}
    >
      <Text>{comment.body}</Text>
      {isReplying ? (
        <TouchableOpacity
          onPress={() => setIsReplying(false)}
          style={{ padding: 10, borderWidth: 1, width: 70 }}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setIsReplying(true)}
          style={{ padding: 10, borderWidth: 1, width: 70 }}
        >
          <Text>Reply</Text>
        </TouchableOpacity>
      )}
      {isReplying && <CommentInput onComment={onComment} />}
      {comments.map((comment) => (
        <RenderComment comment={comment} />
      ))}
    </View>
  );
};

const ViewPost: React.FC<Props> = ({ navigation, route }) => {
  const { postData } = route.params;

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState("Keyboard Hidden");
  const [comments, setComments] = useState(dummyComments);

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

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://${MY_IP}:5000/api/posts`);

      if (res) {
        let postsArray = [];
        res.data.map((data) => {
          if (data.studentOrgs === postData.name) {
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

  const onComment = (newComment: Comment) => {
    setComments((prev) => [newComment, ...prev]);
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
      ></Animated.View>

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
          paddingBottom: 100,
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
        removeClippedSubviews={false}
      >
        {/* Posts */}
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
              {postData.title}
            </Text>
            <Text style={{ fontSize: 13, color: "#666" }}>
              {postData.studentOrgs}
            </Text>
            <Text style={{ fontSize: 13, color: "#666" }}>
              {postData.description}
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

        {/* COMMENTS CONTENT */}

        {/* Input comment */}
        <CommentInput onComment={onComment} />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            gap: 20,
            marginHorizontal: 10,
            marginTop: 20,
          }}
        >
          {comments.map((comment) => (
            <RenderComment comment={comment} />
          ))}
        </View>
      </Animated.ScrollView>

      {keyboardStatus === "Keyboard Hidden" && (
        <Animated.View
          style={[
            headerStyles.view,
            headerStyles.bottomBar,
            {
              bottom: 0,
              zIndex: 0,
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
      )}
    </>
  );
};

export default ViewPost;
