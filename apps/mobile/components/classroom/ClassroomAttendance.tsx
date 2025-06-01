// import { theme } from "~/constants/theme";

// import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { formatDate } from "~/utils/date-utils";

// export default function AttendanceView({
//   classroomId,
// }: {
//   classroomId: string;
// }) {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [attendanceData, setAttendanceData] = useState<any[]>([]);

//   // Function to get attendance for the selected date
//   useEffect(() => {
//     // Filter students by classroom ID
//     const classroomStudents = mockStudents.filter(
//       (student) => student.classroomId === classroomId
//     );

//     // Create attendance data for the selected date
//     const dateStr = selectedDate.toISOString().split("T")[0];
//     const filteredAttendance = mockAttendance.filter(
//       (record) => record.date === dateStr && record.classroomId === classroomId
//     );

//     // Map student data with attendance status
//     const data = classroomStudents.map((student) => {
//       const attendanceRecord = filteredAttendance.find(
//         (record) => record.studentId === student.id
//       );

//       return {
//         ...student,
//         status: attendanceRecord ? attendanceRecord.status : "unknown",
//       };
//     });

//     setAttendanceData(data);
//   }, [classroomId, selectedDate]);

//   const goToPreviousDay = () => {
//     const prevDay = new Date(selectedDate);
//     prevDay.setDate(prevDay.getDate() - 1);
//     setSelectedDate(prevDay);
//   };

//   const goToNextDay = () => {
//     const nextDay = new Date(selectedDate);
//     nextDay.setDate(nextDay.getDate() + 1);
//     setSelectedDate(nextDay);
//   };

//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case "present":
//         return "Present";
//       case "absent":
//         return "Absent";
//       case "late":
//         return "Late";
//       case "excused":
//         return "Excused";
//       default:
//         return "Unknown";
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "present":
//         return theme.colors.success[500];
//       case "absent":
//         return theme.colors.error[500];
//       case "late":
//         return theme.colors.warning[500];
//       case "excused":
//         return theme.colors.secondary[500];
//       default:
//         return theme.colors.neutral[400];
//     }
//   };

//   const renderAttendanceItem = ({ item }: { item: any }) => (
//     <View style={styles.attendanceItem}>
//       <View style={styles.studentInfo}>
//         <Text style={styles.studentName}>{item.name}</Text>
//       </View>
//       <View
//         style={[
//           styles.statusBadge,
//           { backgroundColor: `${getStatusColor(item.status)}20` },
//         ]}
//       >
//         <View
//           style={[
//             styles.statusDot,
//             { backgroundColor: getStatusColor(item.status) },
//           ]}
//         />
//         <Text
//           style={[styles.statusText, { color: getStatusColor(item.status) }]}
//         >
//           {getStatusLabel(item.status)}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.dateSelector}>
//         <TouchableOpacity onPress={goToPreviousDay} style={styles.dateButton}>
//           <ChevronLeft size={20} color={theme.colors.primary[500]} />
//         </TouchableOpacity>
//         <View style={styles.currentDate}>
//           <Calendar
//             size={16}
//             color={theme.colors.text.secondary}
//             style={styles.calendarIcon}
//           />
//           <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
//         </View>
//         <TouchableOpacity onPress={goToNextDay} style={styles.dateButton}>
//           <ChevronRight size={20} color={theme.colors.primary[500]} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsContainer}>
//         <View
//           style={[
//             styles.statItem,
//             { backgroundColor: `${theme.colors.success[500]}15` },
//           ]}
//         >
//           <Text style={styles.statValue}>
//             {attendanceData.filter((s) => s.status === "present").length}
//           </Text>
//           <Text
//             style={[styles.statLabel, { color: theme.colors.success[600] }]}
//           >
//             Present
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.statItem,
//             { backgroundColor: `${theme.colors.error[500]}15` },
//           ]}
//         >
//           <Text style={styles.statValue}>
//             {attendanceData.filter((s) => s.status === "absent").length}
//           </Text>
//           <Text style={[styles.statLabel, { color: theme.colors.error[600] }]}>
//             Absent
//           </Text>
//         </View>
//         <View
//           style={[
//             styles.statItem,
//             { backgroundColor: `${theme.colors.warning[500]}15` },
//           ]}
//         >
//           <Text style={styles.statValue}>
//             {attendanceData.filter((s) => s.status === "late").length}
//           </Text>
//           <Text
//             style={[styles.statLabel, { color: theme.colors.warning[600] }]}
//           >
//             Late
//           </Text>
//         </View>
//       </View>

//       <FlatList
//         data={attendanceData}
//         renderItem={renderAttendanceItem}
//         keyExtractor={(item) => item.id}
//         ListHeaderComponent={
//           <Text style={styles.sectionTitle}>Attendance List</Text>
//         }
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>
//               No attendance records for this date
//             </Text>
//           </View>
//         }
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   dateSelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     backgroundColor: theme.colors.neutral[50],
//     borderRadius: 12,
//     padding: 8,
//   },
//   dateButton: {
//     padding: 8,
//   },
//   currentDate: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   calendarIcon: {
//     marginRight: 4,
//   },
//   dateText: {
//     fontFamily: "Inter-SemiBold",
//     fontSize: 14,
//     color: theme.colors.text.primary,
//   },
//   statsContainer: {
//     flexDirection: "row",
//     marginBottom: 24,
//   },
//   statItem: {
//     flex: 1,
//     borderRadius: 12,
//     padding: 12,
//     alignItems: "center",
//     marginRight: 8,
//   },
//   statValue: {
//     fontFamily: "Inter-Bold",
//     fontSize: 20,
//     color: theme.colors.text.primary,
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontFamily: "Inter-Medium",
//     fontSize: 12,
//   },
//   sectionTitle: {
//     fontFamily: "Inter-SemiBold",
//     fontSize: 16,
//     color: theme.colors.text.primary,
//     marginBottom: 12,
//   },
//   attendanceItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: theme.colors.background,
//     borderRadius: 12,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: theme.colors.neutral[200],
//   },
//   studentInfo: {
//     flex: 1,
//   },
//   studentName: {
//     fontFamily: "Inter-Medium",
//     fontSize: 15,
//     color: theme.colors.text.primary,
//   },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 6,
//   },
//   statusText: {
//     fontFamily: "Inter-Medium",
//     fontSize: 12,
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   emptyContainer: {
//     padding: 24,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyText: {
//     fontFamily: "Inter-Regular",
//     fontSize: 14,
//     color: theme.colors.text.secondary,
//   },
// });
