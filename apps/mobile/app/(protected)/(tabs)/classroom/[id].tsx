/* eslint-disable react-hooks/static-components */
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
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClassroomAssignments from "~/components/classroom/ClassroomAssignment";
import ClassroomFees from "~/components/classroom/ClassroomFees";
import ClassroomStudentsList from "~/components/classroom/ClassroomStudentsList";
import ClassroomSubjects from "~/components/classroom/ClassroomSubject";
import { ThemedView } from "~/components/ThemedView";

import { Colors as Colors2 } from "~/constants/Colors";
import { Colors } from "~/constants/theme";
import { useColorScheme } from "~/hooks/useColorScheme";
import { trpc } from "~/utils/api";

type TabName = "students" | "attendance" | "fees" | "subjects" | "assignments";

export default function ClassroomDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<TabName>("students");

  const { data: classroom, isPending } = useQuery(
    trpc.classroom.get.queryOptions(id),
  );
  const theme = useColorScheme();
  //const { top } = useSafeAreaInsets();

  if (isPending) {
    return (
      <SafeAreaView>
        <ThemedView
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors2[theme].background,
          }}
        >
          <ActivityIndicator size={"large"} />
        </ThemedView>
      </SafeAreaView>
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
        return <ClassroomStudentsList classroomId={classroom.id} />;
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
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView>
        <View style={[styles.header]}>
          <Text style={styles.headerTitle}>{classroom.name}</Text>
          <View style={styles.headerSubtitle}>
            <Text style={styles.headerInfo}>{classroom.level.name}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.headerInfo}>{classroom.section?.name}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.headerInfo}>{classroom.cycle?.name}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.headerInfo}>{classroom.size} élèves</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", paddingHorizontal: 8, gap: 8 }}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Leader</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {classroom.headTeacher?.lastName}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Advisor</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {classroom.seniorAdvisor?.lastName ?? "N/A"}
            </Text>
          </View>
        </View>
        <View style={{ height: 48, marginBottom: 16 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, alignItems: "center" }}
          >
            <TabButton
              name="students"
              icon={
                <Users
                  size={20}
                  color={
                    activeTab === "students"
                      ? Colors[theme].colors.primary[500]
                      : Colors[theme].colors.neutral[400]
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
                      ? Colors[theme].colors.primary[500]
                      : Colors[theme].colors.neutral[400]
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
                      ? Colors[theme].colors.primary[500]
                      : Colors[theme].colors.neutral[400]
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
                      ? Colors[theme].colors.primary[500]
                      : Colors[theme].colors.neutral[400]
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
                      ? Colors[theme].colors.primary[500]
                      : Colors[theme].colors.neutral[400]
                  }
                />
              }
              label="Assignments"
            />
          </ScrollView>
        </View>

        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const theme = "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors2[theme].background,
  },
  header: {
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 12,
  },

  headerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: Colors[theme].colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
  },
  separator: {
    marginHorizontal: 6,
    color: Colors[theme].colors.neutral[300],
  },
  infoCards: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors[theme].colors.neutral[100],
    borderRadius: 12,
    padding: 12,
  },
  infoLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: Colors[theme].colors.text.primary,
  },

  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 16,
    borderRadius: 10,
    backgroundColor: Colors2[theme].secondaryBackground,
  },
  activeTabButton: {
    backgroundColor: Colors[theme].colors.primary[50],
  },
  tabLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
    marginLeft: 6,
  },
  activeTabLabel: {
    color: Colors[theme].colors.primary[500],
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
