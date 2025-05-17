import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateCompStyles } from "../styles/styles";
import { FontAwesome6 } from "@expo/vector-icons";

const DateComp = () => {
  const [show, setShow] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
  });

  const onChangeDate = (event, selectedDate) => {
    setShow(false);

    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate.toISOString() });
    }
  };

  const onChangeTime = (event, selectedDate) => {
    setShowTime(false);

    if (selectedDate) {
      setFormData({ ...formData, time: selectedDate.toISOString() });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <>
        <Text>Date</Text>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={dateCompStyles.inputContainer}
        >
          <FontAwesome6 name="calendar" size={20} color="#888" />
          <TextInput
            placeholder="Date"
            editable={false}
            value={
              formData.date ? new Date(formData.date).toLocaleDateString() : ""
            }
          />
        </TouchableOpacity>
        {/* <Text>{formData.date}</Text> */}
        {show && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </>
      <>
        <Text>Time</Text>
        <TouchableOpacity
          onPress={() => setShowTime(true)}
          style={dateCompStyles.inputContainer}
        >
          <FontAwesome6 name="clock" size={20} color="#888" />
          <TextInput
            placeholder="Time"
            editable={false}
            value={
              formData.time
                ? new Date(formData.time).toLocaleTimeString("en-US")
                : ""
            }
          />
        </TouchableOpacity>
        {/* <Text>{formData.date}</Text> */}
        {showTime && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </>
    </View>
  );
};

export default DateComp;
