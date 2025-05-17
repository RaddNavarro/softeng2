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
    marginRight: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C7E7B",
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePicker: {
    marginBottom: 20,
  },
  placeholderImage: {
    height: 150,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  placeholderText: {
    marginTop: 10,
    color: "#888",
  },
  previewImage: {
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  postButton: {
    backgroundColor: "#2C7E7B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  postButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C7E7B",
  },
  postDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  postBody: {
    fontSize: 14,
    color: "#333",
  },
  postsSection: {
    flex: 1,
    backgroundColor: "#E7F0E6",
    padding: 20,
  },
  verticalList: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginVertical: 10,
  },
  postSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginTop: 30,
  },
  announcementsSection: {
    backgroundColor: "#E7F0E6",
  },
  horizontalList: {
    paddingRight: 20,
  },
  eventCard: {
    backgroundColor: "#E0F2F1",
    padding: 15,
    borderRadius: 10,
    marginRight: 12,
    width: 220,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2C7E7B",
  },
  eventDate: {
    fontSize: 13,
    color: "#555",
    marginTop: 3,
  },
  eventLocation: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 10,
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

export const createPostStyles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export const dateCompStyles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 320,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    gap: 5,
    width: 220,
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    fontSize: 14,
    color: "#333",
  },
});
