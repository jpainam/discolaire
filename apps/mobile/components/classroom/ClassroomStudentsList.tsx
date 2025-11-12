import {
  ActivityIndicator,
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants/theme";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import { getFullName } from "~/utils";
import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";
import { Avatar } from "../Avatar";
import { ThemedView } from "../ThemedView";

export default function ClassroomStudentsList({
  classroomId,
}: {
  classroomId: string;
}) {
  const { data: students, isPending } = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  const router = useRouter();

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

  const renderStudent = ({
    item,
  }: {
    item: RouterOutputs["classroom"]["students"][number];
  }) => (
    <TouchableOpacity
      onPress={() => {
        router.push(`/student/${item.id}`);
      }}
      key={item.id}
      style={styles.studentCard}
    >
      <View style={styles.studentInfo}>
        <Avatar imageUrl={item.user?.avatar} style={styles.avatar} />
        <View style={styles.studentDetails}>
          <Text style={styles.studentName}>{getFullName(item)}</Text>
          <Text style={styles.studentId}>ID: {item.registrationNumber}</Text>
        </View>
      </View>
      {/* Remplacer item.id.lenght par la moyenne de l'eleve */}
      <View style={styles.studentGrades}>
        <Text style={styles.gradeLabel}>GPA</Text>
        <Text
          style={[
            styles.gradeValue,
            item.id.length >= 3.5
              ? styles.excellentGrade
              : item.id.length >= 3.0
                ? styles.goodGrade
                : item.id.length >= 2.5
                  ? styles.averageGrade
                  : styles.lowGrade,
          ]}
        >
          {15.3}
        </Text>
      </View>

      {/* Remplacer item.id.lenght par le pourcentage de présence de l'élève */}
      <View style={styles.attendanceIndicator}>
        <View
          style={[
            styles.attendanceDot,
            item.id.length >= 90
              ? styles.excellentAttendance
              : item.id.length >= 80
                ? styles.goodAttendance
                : item.id.length >= 70
                  ? styles.averageAttendance
                  : styles.poorAttendance,
          ]}
        />
        <Text style={styles.attendanceText}>{85}%</Text>
      </View>

      <ChevronRight size={20} color={Colors[theme].colors.neutral[400]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {students?.length} student{students?.length !== 1 ? "s" : ""}
        </Text>
      </View>
      {students?.length == 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No students in this classroom</Text>
        </View>
      ) : (
        students?.map((student) => {
          return renderStudent({ item: student });
        })
      )}
      {/* <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {students?.length} student{students?.length !== 1 ? "s" : ""}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No students in this classroom</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      /> */}
    </View>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
  },
  headerText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors[theme].colors.background,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors[theme].colors.neutral[200],
  },
  studentInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 12,
    color: Colors[theme].colors.text.primary,
    marginBottom: 2,
  },
  studentId: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.tertiary,
  },
  studentGrades: {
    alignItems: "center",
    marginRight: 12,
  },
  gradeLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.tertiary,
    marginBottom: 2,
  },
  gradeValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
  excellentGrade: {
    color: Colors[theme].colors.success[500],
  },
  goodGrade: {
    color: Colors[theme].colors.success[400],
  },
  averageGrade: {
    color: Colors[theme].colors.warning[500],
  },
  lowGrade: {
    color: Colors[theme].colors.error[500],
  },
  attendanceIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  attendanceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  excellentAttendance: {
    backgroundColor: Colors[theme].colors.success[500],
  },
  goodAttendance: {
    backgroundColor: Colors[theme].colors.success[400],
  },
  averageAttendance: {
    backgroundColor: Colors[theme].colors.warning[500],
  },
  poorAttendance: {
    backgroundColor: Colors[theme].colors.error[500],
  },
  attendanceText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: Colors[theme].colors.text.secondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
  },
});
