import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import styles from "./src/styles/styles"
import AppNavigator from './src/navigation/AppNavigator';
import { useEffect, useState } from 'react';
export default function App() {

  return (
    <AppNavigator />
  );
}

