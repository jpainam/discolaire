import { Calendar, ChevronRight } from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Mock events data - in a real app, this would come from an API
const eventsData = [
  {
    id: "1",
    title: "Parent-Teacher Meeting",
    date: "May 15, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Main Hall",
    color: "#4361ee",
  },
  {
    id: "2",
    title: "Math Olympiad",
    date: "May 18, 2025",
    time: "9:00 AM - 12:00 PM",
    location: "Auditorium",
    color: "#f97316",
  },
  {
    id: "3",
    title: "Annual Sports Day",
    date: "May 22, 2025",
    time: "All Day",
    location: "School Ground",
    color: "#10b981",
  },
];

export default function UpcomingEvents() {
  const renderEventItem = ({
    item,
  }: {
    item: {
      color: string;
      title: string;
      date: string;
      time: string;
      location: string;
    };
  }) => (
    <TouchableOpacity style={styles.eventItem} activeOpacity={0.8}>
      <View
        style={[styles.eventColorIndicator, { backgroundColor: item.color }]}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>
          {item.date} • {item.time}
        </Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
      </View>
      <View style={styles.eventActions}>
        <ChevronRight size={18} color="#94a3b8" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Calendar size={18} color="#4361ee" />
          <Text style={styles.title}>Upcoming Events</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={16} color="#4361ee" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={eventsData}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    color: "#4361ee",
    marginRight: 4,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  eventColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: "#94a3b8",
  },
  eventActions: {
    padding: 4,
  },
});
