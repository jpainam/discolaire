import type { RouterOutputs } from "@repo/api";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { trpc } from "~/utils/api";

export default function StudentGradesTab({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const [expandedTerm, setExpandedTerm] = useState<string | null>("Current");
  const { data: grades } = useQuery(
    trpc.student.grades.queryOptions({ id: student.id })
  );
  const gradesByTerm: {
    name: string;
    termId: string;
    grades: {
      score: number;
      subject: string;
      coeff: number;
      teacher: string;
      scale: number;
    }[];
  }[] = [];
  if (grades) {
    grades.forEach((grade) => {
      const term = gradesByTerm.find(
        (t) => t.termId === grade.gradeSheet.termId
      );
      if (term) {
        term.grades.push({
          subject: grade.gradeSheet.subject.course.name,
          score: grade.grade,
          teacher: "Tom",
          coeff: grade.gradeSheet.subject.coefficient,
          scale: grade.gradeSheet.scale,
        });
      } else {
        gradesByTerm.push({
          name: grade.gradeSheet.term.name,
          termId: grade.gradeSheet.termId,
          grades: [
            {
              subject: grade.gradeSheet.subject.course.name,
              score: grade.grade,
              teacher: "Tom",
              scale: grade.gradeSheet.scale,
              coeff: grade.gradeSheet.subject.coefficient,
            },
          ],
        });
      }
    });
  }

  const toggleTermExpansion = (term: string) => {
    if (expandedTerm === term) {
      setExpandedTerm(null);
    } else {
      setExpandedTerm(term);
    }
  };

  // Calculate GPA for a term
  const calculateGPA = (grades?: { score: number }[]) => {
    if (!grades || grades.length === 0) return 0;

    const totalPoints = grades.reduce((sum, grade) => sum + grade.score, 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  // Get grade color based on score
  const getGradeColor = (score: number) => {
    if (score >= 90) return "#10b981"; // A - Excellent (Green)
    if (score >= 80) return "#4361ee"; // B - Good (Blue)
    if (score >= 70) return "#f97316"; // C - Average (Orange)
    if (score >= 60) return "#f59e0b"; // D - Below Average (Yellow)
    return "#ef4444"; // F - Failing (Red)
  };

  // Get letter grade based on score
  const getLetterGrade = (score: number) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const renderGradeItem = ({
    item,
  }: {
    item: { subject: string; teacher: string; score: number };
  }) => (
    <View style={styles.gradeItem}>
      <View style={styles.subjectContainer}>
        <Text style={styles.subjectName}>{item.subject}</Text>
        <Text style={styles.teacherName}>{item.teacher}</Text>
      </View>

      <View
        style={[
          styles.scoreContainer,
          { backgroundColor: `${getGradeColor(item.score)}15` },
        ]}
      >
        <Text style={[styles.scoreText, { color: getGradeColor(item.score) }]}>
          {item.score}
        </Text>
        <Text
          style={[styles.letterGrade, { color: getGradeColor(item.score) }]}
        >
          {getLetterGrade(item.score)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {gradesByTerm.map((term) => (
        <View key={term.name} style={styles.termCard}>
          <TouchableOpacity
            style={styles.termHeader}
            onPress={() => toggleTermExpansion(term.name)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.termName}>{term.name}</Text>
              <Text style={styles.termDates}>{"2022-2023"}</Text>
            </View>

            <View style={styles.termHeaderRight}>
              <View style={styles.gpaContainer}>
                <Text style={styles.gpaLabel}>GPA</Text>
                <Text style={styles.gpaValue}>{calculateGPA(term.grades)}</Text>
              </View>

              {expandedTerm === term.name ? (
                <ChevronUp size={20} color="#64748b" />
              ) : (
                <ChevronDown size={20} color="#64748b" />
              )}
            </View>
          </TouchableOpacity>

          {expandedTerm === term.name && (
            <View style={styles.gradesContainer}>
              <FlatList
                data={term.grades}
                renderItem={renderGradeItem}
                keyExtractor={(item, index) =>
                  `${term.name}-${item.subject}-${index}`
                }
                scrollEnabled={false}
              />

              {term.grades.length === 0 && (
                <View style={styles.noGradesContainer}>
                  <Text style={styles.noGradesText}>
                    No grades available for this term
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      {gradesByTerm.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No academic records available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  termCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 2,
  },
  termHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
  },
  termName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  termDates: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  termHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  gpaContainer: {
    backgroundColor: "#4361ee15",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
  },
  gpaLabel: {
    fontSize: 10,
    color: "#4361ee",
    fontWeight: "500",
  },
  gpaValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4361ee",
  },
  gradesContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  subjectContainer: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 12,
    color: "#64748b",
  },
  scoreContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "700",
  },
  letterGrade: {
    fontSize: 14,
    fontWeight: "600",
  },
  noGradesContainer: {
    padding: 16,
    alignItems: "center",
  },
  noGradesText: {
    fontSize: 14,
    color: "#94a3b8",
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
