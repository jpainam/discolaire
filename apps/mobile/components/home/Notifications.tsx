import { Bell, ChevronRight } from "lucide-react-native";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock notifications data - in a real app, this would come from an API
const notificationsData = [
  {
    id: "1",
    title: "Assignment Deadline",
    message: "Science project submission due tomorrow",
    time: "30 minutes ago",
    read: false,
    type: "warning",
  },
  {
    id: "2",
    title: "Attendance Alert",
    message: "You were marked absent for Mathematics on Monday",
    time: "2 hours ago",
    read: false,
    type: "alert",
  },
  {
    id: "3",
    title: "Fee Payment",
    message: "Library fee payment successful",
    time: "1 day ago",
    read: true,
    type: "success",
  },
];

export default function Notifications() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "#f59e0b";
      case "alert":
        return "#ef4444";
      case "success":
        return "#10b981";
      default:
        return "#4361ee";
    }
  };

  const renderNotificationItem = ({
    item,
  }: {
    item: {
      read: boolean;
      type: string;
      title: string;
      message: string;
      time: string;
    };
  }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        item.read ? styles.readNotification : styles.unreadNotification,
      ]}
      activeOpacity={0.8}
    >
      <View
        style={[
          styles.notificationDot,
          { backgroundColor: getTypeColor(item.type) },
        ]}
      />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <ChevronRight size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bell size={18} color="#4361ee" />
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>3</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={16} color="#4361ee" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={notificationsData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
    marginRight: 8,
  },
  countBadge: {
    backgroundColor: "#4361ee",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4361ee",
    marginRight: 4,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  unreadNotification: {
    backgroundColor: "#f8fafc",
  },
  readNotification: {
    opacity: 0.8,
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
