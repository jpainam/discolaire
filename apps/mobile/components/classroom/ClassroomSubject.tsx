import { Colors } from "~/constants/theme";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, User } from "lucide-react-native";

import {
  ActivityIndicator,
  Appearance,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { ThemedView } from "../ThemedView";

export default function ClassroomSubjects({
  classroomId,
}: {
  classroomId: string;
}) {
  const { data: subjects, isPending } = useQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const renderSubjectItem = ({
    item,
  }: {
    item: RouterOutputs["classroom"]["subjects"][number];
  }) => (
    <TouchableOpacity style={styles.subjectItem}>
      <View
        style={[
          styles.subjectIconContainer,
          { backgroundColor: item.course.color + "20" },
        ]}
      >
        <BookOpen size={20} color={item.course.color} />
      </View>

      <View style={styles.subjectInfo}>
        <Text style={styles.subjectName}>{item.course.name}</Text>

        <View style={styles.subjectDetails}>
          <View style={styles.detailItem}>
            <User size={14} color={Colors[theme].colors.text.tertiary} />
            <Text style={styles.detailText}>{item.teacher?.lastName}</Text>
          </View>

          <View style={styles.detailItem}>
            <Clock size={14} color={Colors[theme].colors.text.tertiary} />
            <Text style={styles.detailText}>{item.coefficient} hrs/week</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const theme = useColorScheme() ?? "light";
  const colors = Colors[theme].colors;

  if (isPending) {
    return (
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size={"large"} />
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>
            {subjects?.length} Subject
            {subjects?.length !== 1 ? "s" : ""}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No subjects found for this classroom
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 12,
  },
  subjectItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors[theme].colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors[theme].colors.neutral[200],
  },
  subjectIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Colors[theme].colors.text.primary,
    marginBottom: 6,
  },
  subjectDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  detailText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.tertiary,
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
