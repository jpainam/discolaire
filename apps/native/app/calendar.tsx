import { Ionicons } from "@expo/vector-icons";
import { Card, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MOCK_EVENTS: Record<string, { title: string; color: string }[]> = {
  "2026-02-16": [{ title: "Parent-Teacher Meeting", color: "bg-accent" }],
  "2026-02-18": [{ title: "Mid-term Exams Begin", color: "bg-danger" }],
  "2026-02-20": [{ title: "Mid-term Exams End", color: "bg-danger" }],
  "2026-02-23": [{ title: "Science Fair", color: "bg-success" }],
  "2026-02-27": [{ title: "Staff Training Day", color: "bg-warning" }],
  "2026-03-02": [{ title: "Spring Break Starts", color: "bg-success" }],
};

const MOCK_SCHEDULE = [
  {
    time: "08:00 - 09:00",
    subject: "Mathematics",
    classroom: "6eme A",
    teacher: "Mr. Dupont",
  },
  {
    time: "09:00 - 10:00",
    subject: "French",
    classroom: "5eme B",
    teacher: "Mme. Martin",
  },
  {
    time: "10:15 - 11:15",
    subject: "Physics",
    classroom: "4eme A",
    teacher: "Mr. Bernard",
  },
  {
    time: "11:15 - 12:15",
    subject: "History",
    classroom: "3eme C",
    teacher: "Mme. Leroy",
  },
  {
    time: "14:00 - 15:00",
    subject: "English",
    classroom: "6eme A",
    teacher: "Mr. Smith",
  },
  {
    time: "15:00 - 16:00",
    subject: "Biology",
    classroom: "5eme B",
    teacher: "Mme. Dubois",
  },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(1); // February (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(15);
  const foreground = useThemeColor("foreground");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const selectedDateKey = formatDateKey(currentYear, currentMonth, selectedDay);
  const selectedEvents = MOCK_EVENTS[selectedDateKey] ?? [];

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(1);
  };

  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <Container
      className="p-4"
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
    >
      {/* Month Navigation */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Pressable onPress={goToPrevMonth} className="p-2 active:opacity-60">
          <Ionicons name="chevron-back" size={24} color={foreground} />
        </Pressable>
        <Text className="text-foreground text-lg font-semibold">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </Text>
        <Pressable onPress={goToNextMonth} className="p-2 active:opacity-60">
          <Ionicons name="chevron-forward" size={24} color={foreground} />
        </Pressable>
      </View>

      {/* Day Headers */}
      <View className="flex-row mb-1">
        {DAYS.map((day) => (
          <View key={day} className="flex-1 items-center py-1">
            <Text className="text-muted text-xs font-medium">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-row flex-wrap mb-6">
        {calendarCells.map((day, index) => {
          const dateKey = day
            ? formatDateKey(currentYear, currentMonth, day)
            : "";
          const hasEvents = day ? Boolean(MOCK_EVENTS[dateKey]) : false;
          const isSelected = day === selectedDay;

          return (
            <View
              key={index}
              className="items-center justify-center"
              style={{ width: "14.28%" }}
            >
              {day ? (
                <Pressable
                  onPress={() => setSelectedDay(day)}
                  className={`w-9 h-9 items-center justify-center rounded-full ${isSelected ? "bg-accent" : ""}`}
                >
                  <Text
                    className={`text-sm ${isSelected ? "text-accent-foreground font-semibold" : "text-foreground"}`}
                  >
                    {day}
                  </Text>
                  {hasEvents && (
                    <View className="absolute bottom-0.5 w-1 h-1 rounded-full bg-danger" />
                  )}
                </Pressable>
              ) : (
                <View className="w-9 h-9" />
              )}
            </View>
          );
        })}
      </View>

      {/* Events for Selected Day */}
      {selectedEvents.length > 0 && (
        <View className="mb-4">
          <Text className="text-foreground font-semibold text-base mb-2 px-1">
            Events — {MONTH_NAMES[currentMonth]} {selectedDay}
          </Text>
          <View className="gap-2">
            {selectedEvents.map((event, i) => (
              <Card key={i} className="p-3 flex-row items-center gap-3">
                <View className={`w-3 h-3 rounded-full ${event.color}`} />
                <Text className="text-foreground text-sm font-medium">
                  {event.title}
                </Text>
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Daily Schedule */}
      <Text className="text-foreground font-semibold text-base mb-2 px-1">
        Daily Schedule
      </Text>
      <View className="gap-2">
        {MOCK_SCHEDULE.map((period, i) => (
          <Card key={i} className="p-3">
            <View className="flex-row items-start gap-3">
              <View className="pt-0.5">
                <Ionicons name="time-outline" size={16} color={foreground} />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-medium text-sm">
                  {period.subject}
                </Text>
                <Text className="text-muted text-xs mt-0.5">
                  {period.time} · {period.classroom} · {period.teacher}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </Container>
  );
}
