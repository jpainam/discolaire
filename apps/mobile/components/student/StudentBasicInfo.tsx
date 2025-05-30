import { Calendar, Heart, Chrome as Home, MapPin } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Student } from "~/types/student";

interface StudentBasicInfoProps {
  student: Student;
}

export default function StudentBasicInfo({ student }: StudentBasicInfoProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Calendar size={16} color="#4361ee" />
              <Text style={styles.infoLabel}>Date of Birth</Text>
            </View>
            <Text style={styles.infoValue}>{student.dateOfBirth}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <MapPin size={16} color="#4361ee" />
              <Text style={styles.infoLabel}>Place of Birth</Text>
            </View>
            <Text style={styles.infoValue}>{student.placeOfBirth}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Heart size={16} color="#4361ee" />
              <Text style={styles.infoLabel}>Religious Status</Text>
            </View>
            <View style={styles.badgeContainer}>
              {student.isAdventist && (
                <View style={[styles.badge, styles.adventistBadge]}>
                  <Text style={styles.badgeText}>Adventist</Text>
                </View>
              )}
              {student.isBaptized && (
                <View style={[styles.badge, styles.baptizedBadge]}>
                  <Text style={styles.badgeText}>Baptized</Text>
                </View>
              )}
              {!student.isAdventist && !student.isBaptized && (
                <Text style={styles.infoValue}>None</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Residence Information</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Home size={16} color="#4361ee" />
              <Text style={styles.infoLabel}>Address</Text>
            </View>
            <Text style={styles.infoValue}>{student.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Status</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Class</Text>
            <Text style={styles.infoValue}>{student.currentClass}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admission Date</Text>
            <Text style={styles.infoValue}>{student.admissionDate}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>New Student</Text>
              <View
                style={[
                  styles.statusIndicator,
                  student.isNew ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    student.isNew
                      ? styles.statusTextActive
                      : styles.statusTextInactive,
                  ]}
                >
                  {student.isNew ? "Yes" : "No"}
                </Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Repeating</Text>
              <View
                style={[
                  styles.statusIndicator,
                  student.isRepeating
                    ? styles.statusActive
                    : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    student.isRepeating
                      ? styles.statusTextActive
                      : styles.statusTextInactive,
                  ]}
                >
                  {student.isRepeating ? "Yes" : "No"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    textAlign: "right",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  adventistBadge: {
    backgroundColor: "#4361ee20",
  },
  baptizedBadge: {
    backgroundColor: "#10b98120",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#10b981",
  },
  statusInactive: {
    backgroundColor: "#e2e8f0",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextActive: {
    color: "#ffffff",
  },
  statusTextInactive: {
    color: "#64748b",
  },
});
