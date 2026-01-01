/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { Colors } from "~/constants/theme";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Check, ClipboardList, Clock, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { ThemedView } from "../ThemedView";

export default function ClassroomAssignments({
  classroomId,
}: {
  classroomId: string;
}) {
  const { data: assignments, isPending } = useQuery(
    trpc.classroom.assignments.queryOptions(classroomId),
  );
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "completed" | "past-due"
  >("all");

  const theme = useColorScheme();
  if (isPending) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors[theme].colors.background,
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  // Filter based on selected filter
  const filteredAssignments = assignments?.filter((assignment) => {
    const today = new Date();
    const dueDate = new Date(assignment.dueDate);

    switch (filter) {
      case "upcoming":
        return dueDate >= today && !(assignment.dueDate < today);
      case "completed":
        return assignment.dueDate < today;
      case "past-due":
        return dueDate < today && !(assignment.dueDate < today);
      default:
        return true;
    }
  });

  // Sort assignments by due date (closest first)
  const sortedAssignments = [...(filteredAssignments ?? [])].sort((a, b) => {
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const renderAssignmentItem = ({
    item,
  }: {
    item: RouterOutputs["classroom"]["assignments"][number];
  }) => {
    const subjectColor = item.subject.course.color;
    const subjectName = item.subject.course.shortName;
    const dueDate = new Date(item.dueDate);
    const today = new Date();
    const isPastDue = dueDate < today && !item.dueDate;

    return (
      <TouchableOpacity style={styles.assignmentItem}>
        <View
          style={[
            styles.assignmentIconContainer,
            { backgroundColor: subjectColor + "20" },
          ]}
        >
          <ClipboardList size={20} color={subjectColor} />
        </View>

        <View style={styles.assignmentInfo}>
          <Text style={styles.assignmentName}>{item.title}</Text>
          <Text style={styles.subjectName}>{subjectName}</Text>

          <View style={styles.assignmentDetails}>
            <View style={styles.detailItem}>
              <Calendar size={14} color={Colors[theme].colors.text.tertiary} />
              <Text style={styles.detailText}>
                Due: {dueDate.toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.statusContainer}>
              {item.dueDate < today ? (
                <View style={styles.statusWrapper}>
                  <Check size={14} color={Colors[theme].colors.success[500]} />
                  <Text
                    style={[
                      styles.statusText,
                      { color: Colors[theme].colors.success[500] },
                    ]}
                  >
                    Completed
                  </Text>
                </View>
              ) : isPastDue ? (
                <View style={styles.statusWrapper}>
                  <X size={14} color={Colors[theme].colors.error[500]} />
                  <Text
                    style={[
                      styles.statusText,
                      { color: Colors[theme].colors.error[500] },
                    ]}
                  >
                    Past Due
                  </Text>
                </View>
              ) : (
                <View style={styles.statusWrapper}>
                  <Clock size={14} color={Colors[theme].colors.warning[500]} />
                  <Text
                    style={[
                      styles.statusText,
                      { color: Colors[theme].colors.warning[500] },
                    ]}
                  >
                    Pending
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "upcoming" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "upcoming" && styles.activeFilterText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "completed" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.activeFilterText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "past-due" && styles.activeFilterButton,
          ]}
          onPress={() => setFilter("past-due")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "past-due" && styles.activeFilterText,
            ]}
          >
            Past Due
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedAssignments}
        renderItem={renderAssignmentItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {sortedAssignments.length} Assignment
            {sortedAssignments.length !== 1 ? "s" : ""}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assignments found</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const theme = "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: Colors[theme].colors.neutral[100],
  },
  activeFilterButton: {
    backgroundColor: Colors[theme].colors.primary[500],
  },
  filterText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: Colors[theme].colors.text.secondary,
  },
  activeFilterText: {
    color: Colors[theme].colors.background,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 12,
  },
  assignmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: Colors[theme].colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors[theme].colors.neutral[200],
  },
  assignmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 2,
  },
  subjectName: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
    marginBottom: 8,
  },
  assignmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.tertiary,
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontFamily: "Inter-Medium",
    fontSize: 12,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
  },
});
