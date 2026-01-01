import type { RouterOutputs } from "@repo/api";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react-native";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants/Colors";
import { getFullName } from "~/utils";
import { trpc } from "~/utils/api";
import { ThemedText } from "../ThemedText";

export default function StudentParentsTab({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const { data: studentContacts, isPending } = useQuery(
    trpc.student.contacts.queryOptions(student.id),
  );
  const handlePhoneCall = async (phoneNumber: string) => {
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = async (email: string) => {
    await Linking.openURL(`mailto:${email}`);
  };

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size="large"
          style={{ flex: 1, justifyContent: "center" }}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {studentContacts?.map((std, index) => (
        <View key={index} style={styles.parentCard}>
          <View style={styles.parentHeader}>
            <Image
              source={{ uri: std.contact.avatar ?? "" }}
              style={styles.parentImage}
            />
            <View style={styles.parentInfo}>
              <ThemedText style={styles.parentName}>
                {getFullName(std.contact)}
              </ThemedText>
              <ThemedText style={styles.relationshipType}>
                {std.relationship?.name}
              </ThemedText>
              <View style={styles.emergencyContainer}>
                {std.emergencyContact && (
                  <View style={styles.emergencyBadge}>
                    <ThemedText style={styles.emergencyText}>
                      Emergency Contact
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactSection}>
            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Phone size={16} color={Colors[theme].tint} />
                <Text style={styles.contactLabel}>Phone</Text>
              </View>
              <TouchableOpacity
                onPress={() => handlePhoneCall(std.contact.phoneNumber1 ?? "")}
              >
                <Text style={styles.contactValue}>
                  {std.contact.phoneNumber1 ?? ""}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Mail size={16} color={Colors[theme].tint} />
                <Text style={styles.contactLabel}>Email</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEmail(std.contact.user?.email ?? "")}
              >
                <Text style={styles.contactValue}>
                  {std.contact.user?.email}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <MapPin size={16} color={Colors[theme].tint} />
                <Text style={styles.contactLabel}>Address</Text>
              </View>
              <Text style={styles.contactValue}>{std.contact.address}</Text>
            </View>

            <View style={styles.contactRow}>
              <View style={styles.contactLabelContainer}>
                <Briefcase size={16} color={Colors[theme].tint} />
                <Text style={styles.contactLabel}>Occupation</Text>
              </View>
              <Text style={styles.contactValue}>{std.contact.occupation}</Text>
            </View>
          </View>
        </View>
      ))}

      {studentContacts?.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No parent information available</Text>
        </View>
      )}
    </View>
  );
}

const theme = "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parentCard: {
    backgroundColor: Colors[theme].cardBackground,
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
    //color: "#1e293b",
    marginBottom: 4,
  },
  relationshipType: {
    fontSize: 14,
    //color: "#64748b",
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
    //color: "#ef4444",
  },
  divider: {
    height: 1,
    backgroundColor: Colors[theme].border,
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
    color: Colors[theme].textSecondary,
    marginLeft: 8,
  },
  contactValue: {
    fontSize: 14,
    color: Colors[theme].text,
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
