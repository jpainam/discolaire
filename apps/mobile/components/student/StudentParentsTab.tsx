import { Briefcase, Mail, MapPin, Phone } from "lucide-react-native";
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Student } from "~/types/student";

interface StudentParentsTabProps {
  student: Student;
}

export default function StudentParentsTab({ student }: StudentParentsTabProps) {
  const handlePhoneCall = async (phoneNumber: string) => {
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = async (email: string) => {
    await Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={styles.container}>
      {student.parents.map((parent, index) => (
        <View key={index} style={styles.parentCard}>
          <View style={styles.parentHeader}>
            <Image
              source={{ uri: parent.photoUrl }}
              style={styles.parentImage}
            />
            <View style={styles.parentInfo}>
              <Text style={styles.parentName}>{parent.fullName}</Text>
              <Text style={styles.relationshipType}>{parent.relationship}</Text>
              <View style={styles.emergencyContainer}>
                {parent.isEmergencyContact && (
                  <View style={styles.emergencyBadge}>
                    <Text style={styles.emergencyText}>Emergency Contact</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Phone size={16} color="#4361ee" />
                <Text style={styles.contactLabel}>Phone</Text>
              </View>
              <TouchableOpacity
                onPress={() => handlePhoneCall(parent.phoneNumber)}
              >
                <Text style={styles.contactValue}>{parent.phoneNumber}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Mail size={16} color="#4361ee" />
                <Text style={styles.contactLabel}>Email</Text>
              </View>
              <TouchableOpacity onPress={() => handleEmail(parent.email)}>
                <Text style={styles.contactValue}>{parent.email}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <MapPin size={16} color="#4361ee" />
                <Text style={styles.contactLabel}>Address</Text>
              </View>
              <Text style={styles.contactValue}>{parent.address}</Text>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Briefcase size={16} color="#4361ee" />
                <Text style={styles.contactLabel}>Occupation</Text>
              </View>
              <Text style={styles.contactValue}>{parent.occupation}</Text>
            </View>
          </View>
        </View>
      ))}

      {student.parents.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No parent information available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  parentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  parentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  parentInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  relationshipType: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  emergencyContainer: {
    flexDirection: "row",
  },
  emergencyBadge: {
    backgroundColor: "#ef444420",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },
  contactSection: {},
  contactRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  contactLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactLabel: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  contactValue: {
    fontSize: 14,
    color: "#1e293b",
    textAlign: "right",
  },
  noDataContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
  },
  noDataText: {
    fontSize: 16,
    color: "#94a3b8",
  },
});
