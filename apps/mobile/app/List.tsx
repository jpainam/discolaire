import React from "react";
import { Image, SafeAreaView, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Text } from "~/components/nativewindui/Text";

// Define the Student type
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classroom: string;
  avatar: string;
}

// Mock data for students
const students: Student[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    classroom: "10A",
    avatar: "https://example.com/avatar1.jpg",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    classroom: "11B",
    avatar: "https://example.com/avatar2.jpg",
  },
  // Add more students as needed
];

// Type the StudentItem component
const StudentItem: React.FC<{ item: Student }> = ({ item }) => (
  <View className="flex-row items-center p-4">
    <View className="flex-1">
      <Text className="text-lg font-semibold">{`${item.firstName} ${item.lastName}`}</Text>
      <Text className="text-sm text-gray-600">Class: {item.classroom}</Text>
    </View>
    <Image source={{ uri: item.avatar }} className="h-12 w-12 rounded-full" />
  </View>
);

const Separator = () => <View className="h-px bg-gray-200" />;

export default function Screen() {
  return (
    <SafeAreaView className="flex-1">
      <FlashList<Student>
        data={students}
        renderItem={({ item }) => <StudentItem item={item} />}
        keyExtractor={(item) => item.id}
        estimatedItemSize={50}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
}
