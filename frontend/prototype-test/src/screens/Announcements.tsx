import React, { useState } from 'react';
import { Text, View, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Props } from '../navigation/props'
import { logInStyles } from "../styles/styles";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Calendar } from "react-native-calendars";
const DismissKeyboard = ({ children }) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

const Announcements: React.FC<Props> = ({ navigation }) => {
    
    return (
        <DismissKeyboard>
            <View style={logInStyles.container}>
                <Text>Announcements Page</Text>
            </View>
        </DismissKeyboard>

    )
}

export default Announcements;
