import { TrendingUp } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Mock progress data - in a real app, this would come from an API
const progressData = {
  gpa: 3.8,
  totalGrade: "A-",
  attendance: 94,
  completedAssignments: 22,
  pendingAssignments: 3,
};

export default function AcademicProgress() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp size={18} color="#4361ee" />
        <Text style={styles.title}>Academic Progress</Text>
      </View>

      <View style={styles.gpaContainer}>
        <View style={styles.gpaCircle}>
          <Text style={styles.gpaValue}>{progressData.gpa}</Text>
          <Text style={styles.gpaLabel}>GPA</Text>
        </View>
        <View style={styles.gradeContainer}>
          <Text style={styles.gradeValue}>{progressData.totalGrade}</Text>
          <Text style={styles.gradeLabel}>Overall Grade</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progressData.attendance}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {progressData.completedAssignments}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {progressData.pendingAssignments}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  gpaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  gpaCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4361ee15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  gpaValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4361ee",
  },
  gpaLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  gradeContainer: {
    flex: 1,
  },
  gradeValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 2,
  },
  gradeLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 4,
  },
});
