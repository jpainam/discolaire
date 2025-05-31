import { Stack, useLocalSearchParams } from "expo-router";
import {
  BookOpenText,
  CreditCard,
  FileText,
  UserCircle,
  UserRound,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Appearance,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStudent } from "~//data/students";
import StudentBasicInfo from "~/components/student/StudentBasicInfo";
import StudentFeesTab from "~/components/student/StudentFeesTab";
import StudentGradesTab from "~/components/student/StudentGradesTab";
import StudentParentsTab from "~/components/student/StudentParentsTab";
import StudentTransactionsTab from "~/components/student/StudentTransactionsTab";
import { Colors } from "~/constants/Colors";

// Define tab types for TypeScript
type TabType = "info" | "parents" | "grades" | "fees" | "transactions";

export default function StudentProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Student ID:", id);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isLoading, _] = useState(false);

  // This would normally fetch data from your API
  const student = getStudent("1");

  if (!student) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Student not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return <StudentBasicInfo student={student} />;
      case "parents":
        return <StudentParentsTab student={student} />;
      case "grades":
        return <StudentGradesTab student={student} />;
      case "fees":
        return <StudentFeesTab student={student} />;
      case "transactions":
        return <StudentTransactionsTab student={student} />;
      default:
        return <StudentBasicInfo student={student} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      {/* Student Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: student.photoUrl }}
            style={styles.profileImage}
          />
          {student.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        <View style={styles.nameContainer}>
          <Text
            style={styles.studentName}
          >{`${student.firstName} ${student.lastName}`}</Text>
          <View style={styles.classContainer}>
            <Text style={styles.className}>{student.currentClass}</Text>
            {student.isRepeating && (
              <View style={styles.repeatingBadge}>
                <Text style={styles.repeatingBadgeText}>Repeating</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "info" && styles.activeTab]}
            onPress={() => setActiveTab("info")}
          >
            <UserCircle
              size={18}
              color={activeTab === "info" ? "#4361ee" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "info" && styles.activeTabText,
              ]}
            >
              Information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "parents" && styles.activeTab]}
            onPress={() => setActiveTab("parents")}
          >
            <UserRound
              size={18}
              color={activeTab === "parents" ? "#4361ee" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "parents" && styles.activeTabText,
              ]}
            >
              Parents
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "grades" && styles.activeTab]}
            onPress={() => setActiveTab("grades")}
          >
            <BookOpenText
              size={18}
              color={activeTab === "grades" ? "#4361ee" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "grades" && styles.activeTabText,
              ]}
            >
              Grades
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "fees" && styles.activeTab]}
            onPress={() => setActiveTab("fees")}
          >
            <CreditCard
              size={18}
              color={activeTab === "fees" ? "#4361ee" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "fees" && styles.activeTabText,
              ]}
            >
              Fees
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "transactions" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("transactions")}
          >
            <FileText
              size={18}
              color={activeTab === "transactions" ? "#4361ee" : "#64748b"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "transactions" && styles.activeTabText,
              ]}
            >
              Transactions
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4361ee" />
          </View>
        ) : (
          renderTabContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: "#64748b",
    fontWeight: "500",
  },

  profileHeader: {
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4361ee",
  },
  newBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  nameContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  classContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  className: {
    fontSize: 16,
    color: "#64748b",
    marginRight: 8,
  },
  repeatingBadge: {
    backgroundColor: "#f97316",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  repeatingBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  tabContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tabScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4361ee",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeTabText: {
    color: "#4361ee",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
}); // import { useQuery } from "@tanstack/react-query";
// import { useLocalSearchParams } from "expo-router";
// import { useState } from "react";
// import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { StudentDetails } from "~/components/StudentDetails";
// import { StudentProfile } from "~/components/StudentProfile";
// import Tabs from "~/components/Tabs";
// import { ThemedText } from "~/components/ThemedText";
// import { ThemedView } from "~/components/ThemedView";
// import { trpc } from "~/utils/api";

// export default function Screen() {
//   const { top } = useSafeAreaInsets();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const {
//     data: student,
//     isPending,
//     isRefetching,
//     refetch,
//   } = useQuery(trpc.student.get.queryOptions(id));
//   console.log("student", student);
//   const [activeTab, setActiveTab] = useState("Détails");
//   const handleTabChange = (tab: string) => {
//     setActiveTab(tab);
//   };

//   return (
//     <ThemedView>
//       <ScrollView
//         contentContainerStyle={{ padding: 16 }}
//         refreshControl={
//           <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
//         }
//       >
//         {isPending ? (
//           <ThemedView
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               alignItems: "center",
//               paddingTop: top,
//             }}
//           >
//             <ActivityIndicator size="large" />
//           </ThemedView>
//         ) : (
//           <>
//             {!student ? (
//               <ThemedView
//                 style={{
//                   flex: 1,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   paddingTop: top,
//                 }}
//               >
//                 <ThemedView>
//                   <ThemedText>Elève non trouvé</ThemedText>
//                 </ThemedView>
//               </ThemedView>
//             ) : (
//               <>
//                 <StudentProfile student={student} />
//                 <Tabs
//                   onTabChange={handleTabChange}
//                   tabs={["Détails", "Notes", "Présence", "Transactions"]}
//                   initialTab="Détails"
//                 />
//                 {activeTab === "Détails" && <StudentDetails />}
//               </>
//             )}
//           </>
//         )}
//       </ScrollView>
//     </ThemedView>
//   );
// }
