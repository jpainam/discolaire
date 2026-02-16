import { Ionicons } from "@expo/vector-icons";
import { Card, useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

import { Container } from "@/components/container";
import { useAuth } from "@/contexts/auth-context";

const MOCK_STATS = [
  { label: "Students", value: "342", icon: "people" as const, color: "bg-accent" },
  { label: "Classrooms", value: "12", icon: "school" as const, color: "bg-success" },
  { label: "Pending Fees", value: "28", icon: "cash-outline" as const, color: "bg-warning" },
  { label: "Attendance", value: "94%", icon: "checkmark-circle-outline" as const, color: "bg-default" },
];

const MOCK_SCHEDULE = [
  { time: "08:00", subject: "Mathematics", classroom: "6eme A" },
  { time: "09:00", subject: "French", classroom: "5eme B" },
  { time: "10:15", subject: "Physics", classroom: "4eme A" },
  { time: "11:15", subject: "History", classroom: "3eme C" },
];

const MOCK_EVENTS = [
  { date: "Feb 16", title: "Parent-Teacher Meeting", icon: "people-circle-outline" as const },
  { date: "Feb 18", title: "Mid-term Exams Begin", icon: "document-text-outline" as const },
  { date: "Feb 23", title: "Science Fair", icon: "flask-outline" as const },
];

const MOCK_ACTIVITY = [
  { text: "New student enrolled in 6eme A", time: "2h ago", icon: "person-add-outline" as const },
  { text: "Fee payment received — Moussa K.", time: "4h ago", icon: "card-outline" as const },
  { text: "Attendance marked for 5eme B", time: "Yesterday", icon: "checkmark-done-outline" as const },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { session } = useAuth();
  const foreground = useThemeColor("foreground");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Container className="p-5" scrollViewProps={{ showsVerticalScrollIndicator: false }}>
      {/* Greeting */}
      <View className="mb-5">
        <Text className="text-2xl font-bold text-foreground">
          {getGreeting()}, {session?.user.name?.split(" ")[0]}
        </Text>
        <Text className="text-muted text-sm mt-1">{today}</Text>
      </View>

      {/* Quick Stats */}
      <View className="flex-row flex-wrap gap-3 mb-5">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} className="p-4 flex-1" style={{ minWidth: "46%" }}>
            <View className="flex-row items-center gap-3">
              <View className={`w-10 h-10 rounded-xl items-center justify-center ${stat.color}`}>
                <Ionicons name={stat.icon} size={20} color={foreground} />
              </View>
              <View>
                <Text className="text-foreground text-xl font-bold">{stat.value}</Text>
                <Text className="text-muted text-xs">{stat.label}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      {/* Today's Schedule */}
      <Card variant="secondary" className="mb-5 p-4">
        <View className="flex-row items-center justify-between mb-3">
          <Card.Title>Today's Schedule</Card.Title>
          <Ionicons name="calendar-outline" size={18} color={foreground} />
        </View>
        <View className="gap-2">
          {MOCK_SCHEDULE.map((period, i) => (
            <View key={i} className="flex-row items-center gap-3 py-2">
              <Text className="text-accent font-semibold text-sm w-12">{period.time}</Text>
              <View className="w-0.5 h-full bg-separator self-stretch" />
              <View className="flex-1">
                <Text className="text-foreground text-sm font-medium">{period.subject}</Text>
                <Text className="text-muted text-xs">{period.classroom}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Upcoming Events */}
      <Card variant="secondary" className="mb-5 p-4">
        <View className="flex-row items-center justify-between mb-3">
          <Card.Title>Upcoming Events</Card.Title>
          <Ionicons name="megaphone-outline" size={18} color={foreground} />
        </View>
        <View className="gap-2">
          {MOCK_EVENTS.map((event, i) => (
            <View key={i} className="flex-row items-center gap-3 py-2">
              <View className="w-8 h-8 rounded-lg bg-surface items-center justify-center">
                <Ionicons name={event.icon} size={16} color={foreground} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-sm font-medium">{event.title}</Text>
                <Text className="text-muted text-xs">{event.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>

      {/* Recent Activity */}
      <Card variant="secondary" className="mb-5 p-4">
        <View className="flex-row items-center justify-between mb-3">
          <Card.Title>Recent Activity</Card.Title>
          <Ionicons name="time-outline" size={18} color={foreground} />
        </View>
        <View className="gap-2">
          {MOCK_ACTIVITY.map((item, i) => (
            <View key={i} className="flex-row items-center gap-3 py-2">
              <View className="w-8 h-8 rounded-lg bg-surface items-center justify-center">
                <Ionicons name={item.icon} size={16} color={foreground} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground text-sm font-medium">{item.text}</Text>
                <Text className="text-muted text-xs">{item.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </Card>
    </Container>
  );
}
