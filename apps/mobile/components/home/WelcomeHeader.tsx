/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

// Mock user data - in a real app, this would come from authentication context
const userData = {
  name: "Emma",
  role: "Student",
  grade: "10th Grade",
  avatarUrl:
    "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=256",
};

export default function WelcomeHeader() {
  // Get current time to display appropriate greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";

  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.userInfo}>
          <ThemedText style={styles.greeting}>{greeting},</ThemedText>
          <ThemedText style={styles.userName}>{userData.name}</ThemedText>
          <ThemedText style={styles.userRole}>
            {userData.role} • {userData.grade}
          </ThemedText>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.notificationIcon}>
            <Ionicons
              size={22}
              name={
                theme == "light"
                  ? "notifications-outline"
                  : "notifications-sharp"
              }
              color={Colors[theme].icon}
            />

            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </View>

          <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
        </View>
      </View>
    </ThemedView>
  );
}

const theme = "light";
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: theme == "light" ? "#64748b" : Colors.dark.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme == "light" ? "#1e293b" : Colors.dark.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: theme == "light" ? "#64748b" : Colors.dark.textSecondary,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    position: "relative",
    marginRight: 16,
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4361ee",
  },
});
