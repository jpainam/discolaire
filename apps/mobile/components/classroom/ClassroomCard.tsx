import { useRouter } from "expo-router";
import React from "react";
import {
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants/theme";

import { Ionicons } from "@expo/vector-icons";
import type { RouterOutputs } from "@repo/api";
import { Colors as Colors2 } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { ThemedText } from "../ThemedText";
import CapacityIndicator from "./CapacityIndicator";

export default function ClassroomCard({
  classroom,
}: {
  classroom: RouterOutputs["classroom"]["all"][number];
}) {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";

  const handlePress = () => {
    router.push(`/classroom/${classroom.id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle" style={{ fontSize: 18, marginBottom: 2 }}>
            {classroom.name}
          </ThemedText>
          <ThemedText style={styles.level}>{classroom.level.name}</ThemedText>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: "#FFF3E0",
          }}
        >
          <ThemedText style={styles.sectionText}>
            {classroom.section?.name}
          </ThemedText>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoLabel}>Prof. Principal</Text>
          <ThemedText numberOfLines={1} style={{ fontSize: 14 }}>
            {classroom.headTeacher?.lastName ?? "N/A"}
          </ThemedText>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoLabel}>Cycle</Text>
          <ThemedText style={{ fontSize: 14 }}>
            {classroom.cycle?.name}
          </ThemedText>
        </View>
        <View style={styles.studentsContainer}>
          <Ionicons
            name={theme == "light" ? "people" : "people-outline"}
            size={16}
            color={Colors2[theme].icon}
          />
          <ThemedText style={styles.studentsText}>
            {classroom.size}/{classroom.maxSize} élèves
          </ThemedText>
        </View>
      </View>

      <CapacityIndicator current={classroom.size} max={classroom.maxSize} />
    </TouchableOpacity>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors2[theme].cardBackground,
    borderRadius: 16,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors2[theme].border,
    shadowColor: Colors[theme].colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },

  level: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors2[theme].textSecondary,
  },

  englishBadge: {
    backgroundColor: Colors[theme].colors.secondary[50],
  },
  sectionText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: Colors[theme].colors.accent[600],
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  infoLabel: {
    fontSize: 12,
    color: Colors2[theme].textSecondary,
    marginBottom: 2,
  },

  studentsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  studentsText: {
    fontSize: 13,
    color: Colors2[theme].textSecondary,
    marginLeft: 4,
  },
});
