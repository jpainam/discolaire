import {
  BookOpen,
  Bus,
  Calendar,
  SquareCheck as CheckSquare,
  CreditCard,
  FileText,
  BookOpen as Library,
  UserPlus,
} from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const quickActions = [
  { id: 1, title: "Attendance", icon: CheckSquare, color: "#4361ee" },
  { id: 2, title: "Homework", icon: FileText, color: "#3b82f6" },
  { id: 3, title: "Timetable", icon: Calendar, color: "#8b5cf6" },
  { id: 4, title: "Results", icon: BookOpen, color: "#ec4899" },
  { id: 5, title: "Teachers", icon: UserPlus, color: "#f97316" },
  { id: 6, title: "Fees", icon: CreditCard, color: "#10b981" },
  { id: 7, title: "Library", icon: Library, color: "#6366f1" },
  { id: 8, title: "Transport", icon: Bus, color: "#f59e0b" },
];

export default function QuickActions() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Quick Actions</Text>
      </View>

      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${action.color}10` },
              ]}
            >
              <action.icon size={20} color={action.color} />
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  actionItem: {
    width: "25%",
    padding: 4,
    alignItems: "center",
    marginBottom: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 12,
    color: "#475569",
    textAlign: "center",
  },
});
