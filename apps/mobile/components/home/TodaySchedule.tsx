import { Clock } from "lucide-react-native";

import { ScrollView, StyleSheet, Text, View } from "react-native";

// Mock schedule data - in a real app, this would come from an API
const scheduleData = [
  {
    id: "1",
    subject: "Mathematics",
    time: "8:30 AM - 9:30 AM",
    teacher: "Ms. Johnson",
    room: "Room 301",
    color: "#4361ee",
  },
  {
    id: "2",
    subject: "Physics",
    time: "9:40 AM - 10:40 AM",
    teacher: "Mr. Smith",
    room: "Lab 2",
    color: "#8b5cf6",
  },
  {
    id: "3",
    subject: "English",
    time: "11:00 AM - 12:00 PM",
    teacher: "Mrs. Williams",
    room: "Room 205",
    color: "#f97316",
  },
];

export default function TodaySchedule() {
  const currentTime = new Date().getHours() * 60 + new Date().getMinutes();

  // Function to determine if a class is current, past, or upcoming
  const getClassStatus = (timeString: string) => {
    const [startTime, endTime] = timeString.split(" - ");
    // @ts-expect-error TODO fix this
    const [startHour, startMinute] = startTime.split(":");
    // @ts-expect-error TODO fix this
    const startHourNum = parseInt(startHour, 10);
    // @ts-expect-error TODO fix this
    const startMinuteNum = parseInt(startMinute, 10);
    const startTimeMinutes =
      (startHourNum +
        // @ts-expect-error TODO fix this
        (startTime.includes("PM") && startHourNum !== 12 ? 12 : 0)) *
        60 +
      startMinuteNum;
    // @ts-expect-error TODO fix this
    const [endHour, endMinute] = endTime.split(":");
    // @ts-expect-error TODO fix this
    const endHourNum = parseInt(endHour, 10);
    // @ts-expect-error TODO fix this
    const endMinuteNum = parseInt(endMinute, 10);
    const endTimeMinutes =
      // @ts-expect-error TODO fix this
      (endHourNum + (endTime.includes("PM") && endHourNum !== 12 ? 12 : 0)) *
        60 +
      endMinuteNum;

    if (currentTime < startTimeMinutes) return "upcoming";
    if (currentTime >= startTimeMinutes && currentTime <= endTimeMinutes)
      return "current";
    return "past";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock size={18} color="#4361ee" />
        <Text style={styles.title}>Today's Classes</Text>
      </View>

      <ScrollView
        style={styles.scheduleList}
        showsVerticalScrollIndicator={false}
      >
        {scheduleData.map((item) => {
          const status = getClassStatus(item.time);
          return (
            <View
              key={item.id}
              style={[
                styles.scheduleItem,
                status === "current" && styles.currentClass,
                status === "past" && styles.pastClass,
              ]}
            >
              <View
                style={[styles.subjectColor, { backgroundColor: item.color }]}
              />
              <View style={styles.scheduleDetails}>
                <Text style={styles.subjectName}>{item.subject}</Text>
                <Text style={styles.scheduleTime}>{item.time}</Text>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.teacherName}>{item.teacher}</Text>
                  <Text style={styles.roomNumber}>{item.room}</Text>
                </View>
              </View>

              {status === "current" && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Now</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  scheduleList: {
    maxHeight: 200,
  },
  scheduleItem: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    padding: 10,
    marginBottom: 8,
    position: "relative",
  },
  currentClass: {
    backgroundColor: "#4361ee10",
    borderWidth: 1,
    borderColor: "#4361ee20",
  },
  pastClass: {
    opacity: 0.6,
  },
  subjectColor: {
    width: 4,
    borderRadius: 2,
    marginRight: 10,
  },
  scheduleDetails: {
    flex: 1,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  scheduleTime: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  scheduleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teacherName: {
    fontSize: 11,
    color: "#94a3b8",
  },
  roomNumber: {
    fontSize: 11,
    color: "#94a3b8",
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#4361ee",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
});
