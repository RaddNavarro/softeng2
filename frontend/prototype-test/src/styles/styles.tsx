import { StyleSheet, Platform, StatusBar, Dimensions } from "react-native";
import { COLORS } from "../components/colors";

const { width, height } = Dimensions.get("window");

export const logInStyles = StyleSheet.create({
  // for login
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.45,
    zIndex: 1,
  },
  logo: {
    width: "80%",
    height: undefined,
    aspectRatio: 2.5,
    marginTop: height * 0.2, // adjusted for visual alignment
    marginBottom: 24,
    zIndex: 3,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#C4C4C4",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#24923D",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#222",
    textDecorationLine: "underline",
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  label: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});

export const preferencesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#278086",
  },
  header: {
    height: height * 0.25,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1C1C1C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 32,
    paddingRight: 40,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#1C1C1C",
  },
  checkbox: {
    height: 22,
    width: 22,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: "#CCCCCC",
  },
  checkboxChecked: {
    backgroundColor: "#6B4EFF",
    borderColor: "#6B4EFF",
  },
  continueButton: {
    width: "35%",
    height: 48,
    backgroundColor: "#24C869",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 24,
    alignSelf: "flex-end",
    marginRight: 16,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
});

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export const headerStyles = StyleSheet.create({
  view: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 150,
  },
  rowContainer: {
    backgroundColor: "white",
    marginTop: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  plusIconStyles: {
    bottom: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.fernGreen,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    elevation: 8,
  },
  bottomBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginHorizontal: 4,
  },
});

export const browseOrgsStyles = StyleSheet.create({
  list: {
    padding: 10,
    paddingBottom: 250,
    marginTop: 150,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: COLORS.whiteSmoke,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
  },
  category: {
    color: "gray",
    textAlign: "center",
  },
});
