import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Props } from "../navigation/props";
import Ionicons from "react-native-vector-icons/Ionicons";
import { preferencesStyles } from "../styles/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState } from "react";

const Preferences: React.FC<Props> = ({ navigation }) => {
  const [isCheckedEvents, setIsCheckedEvents] = useState(false);
  const [isCheckedForum, setIsCheckedForum] = useState(false);
  const [isCheckedAnnouncement, setIsCheckedAnnouncement] = useState(false);
  return (
    <View style={preferencesStyles.container}>
      <View style={preferencesStyles.header} />
      <ScrollView contentContainerStyle={preferencesStyles.content}>
        <Text style={preferencesStyles.title}>Preferences</Text>
        <Text style={preferencesStyles.subtitle}>
          What are you using this app for? This can be changed in the settings
          later.
        </Text>

        <View style={preferencesStyles.checkboxRow}>
          <Text style={preferencesStyles.checkboxLabel}>Events</Text>
          <Checkbox
            style={[
              preferencesStyles.checkbox,
              isCheckedEvents && preferencesStyles.checkboxChecked,
            ]}
            value={isCheckedEvents}
            onValueChange={setIsCheckedEvents}
          />
        </View>

        <View style={preferencesStyles.checkboxRow}>
          <Text style={preferencesStyles.checkboxLabel}>Forum</Text>
          <Checkbox
            style={[
              preferencesStyles.checkbox,
              isCheckedForum && preferencesStyles.checkboxChecked,
            ]}
            value={isCheckedForum}
            onValueChange={setIsCheckedForum}
          />
        </View>

        <View style={preferencesStyles.checkboxRow}>
          <Text style={preferencesStyles.checkboxLabel}>
            Official Announcements
          </Text>
          <Checkbox
            style={[
              preferencesStyles.checkbox,
              isCheckedAnnouncement && preferencesStyles.checkboxChecked,
            ]}
            value={isCheckedAnnouncement}
            onValueChange={setIsCheckedAnnouncement}
          />
        </View>

        <TouchableOpacity
          style={preferencesStyles.continueButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={preferencesStyles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Preferences;
