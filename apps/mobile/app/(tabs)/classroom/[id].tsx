import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  DollarSign,
  Users,
} from "lucide-react-native";
import type { JSX } from "react";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CapacityIndicator from "~/components/classroom/CapacityIndicator";
import ClassroomAssignments from "~/components/classroom/ClassroomAssignment";
import ClassroomFees from "~/components/classroom/ClassroomFees";
import {
  default as ClassroomStudentsList,
  default as StudentsList,
} from "~/components/classroom/ClassroomStudentsList";
import ClassroomSubjects from "~/components/classroom/ClassroomSubject";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { theme as t } from "~/constants/theme";
import { trpc } from "~/utils/api";

type TabName = "students" | "attendance" | "fees" | "subjects" | "assignments";

export default function ClassroomDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<TabName>("students");

  const { data: classroom, isPending } = useQuery(
    trpc.classroom.get.queryOptions(id)
  );

  if (isPending) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: t.colors.background,
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }
  if (!classroom) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Classroom not found</Text>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "students":
        return <ClassroomStudentsList classroomId={classroom.id} />;
      case "attendance":
        return <ClassroomStudentsList classroomId={classroom.id} />;
      case "fees":
        return <ClassroomFees classroomId={classroom.id} />;
      case "subjects":
        return <ClassroomSubjects classroomId={classroom.id} />;
      case "assignments":
        return <ClassroomAssignments classroomId={classroom.id} />;
      default:
        return <StudentsList classroomId={classroom.id} />;
    }
  };

  const TabButton = ({
    name,
    icon,
    label,
  }: {
    name: TabName;
    icon: JSX.Element;
    label: string;
  }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === name && styles.activeTabButton]}
      onPress={() => setActiveTab(name)}
    >
      {icon}
      <Text
        style={[styles.tabLabel, activeTab === name && styles.activeTabLabel]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{classroom.name}</Text>
          <View style={styles.headerSubtitle}>
            <Text style={styles.headerInfo}>{classroom.level.name}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.headerInfo}>{classroom.section?.name}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.headerInfo}>{classroom.cycle?.name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Leader</Text>
          <Text style={styles.infoValue}>
            {classroom.classroomLeader?.lastName}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Advisor</Text>
          <Text style={styles.infoValue}>
            {classroom.seniorAdvisor?.lastName}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Capacity</Text>
          <CapacityIndicator current={classroom.size} max={classroom.maxSize} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        <TabButton
          name="students"
          icon={
            <Users
              size={20}
              color={
                activeTab === "students"
                  ? t.colors.primary[500]
                  : t.colors.neutral[400]
              }
            />
          }
          label="Students"
        />
        <TabButton
          name="attendance"
          icon={
            <Calendar
              size={20}
              color={
                activeTab === "attendance"
                  ? t.colors.primary[500]
                  : t.colors.neutral[400]
              }
            />
          }
          label="Attendance"
        />
        <TabButton
          name="fees"
          icon={
            <DollarSign
              size={20}
              color={
                activeTab === "fees"
                  ? t.colors.primary[500]
                  : t.colors.neutral[400]
              }
            />
          }
          label="Fees"
        />
        <TabButton
          name="subjects"
          icon={
            <BookOpen
              size={20}
              color={
                activeTab === "subjects"
                  ? t.colors.primary[500]
                  : t.colors.neutral[400]
              }
            />
          }
          label="Subjects"
        />
        <TabButton
          name="assignments"
          icon={
            <ClipboardList
              size={20}
              color={
                activeTab === "assignments"
                  ? t.colors.primary[500]
                  : t.colors.neutral[400]
              }
            />
          }
          label="Assignments"
        />
      </ScrollView>

      <View style={styles.content}>{renderTabContent()}</View>
    </SafeAreaView>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: t.colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: t.colors.text.secondary,
  },
  separator: {
    marginHorizontal: 6,
    color: t.colors.neutral[300],
  },
  infoCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: t.colors.neutral[50],
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
  },
  infoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: t.colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: t.colors.text.primary,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingLeft: 16,
    marginBottom: 16,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: t.colors.neutral[100],
  },
  activeTabButton: {
    backgroundColor: t.colors.primary[50],
  },
  tabLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: t.colors.text.secondary,
    marginLeft: 6,
  },
  activeTabLabel: {
    color: t.colors.primary[500],
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
