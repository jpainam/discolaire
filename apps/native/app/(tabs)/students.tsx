import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Input, Spinner } from "heroui-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { trpc } from "@/utils/trpc";

const PAGE_SIZE = 20;

function getFullName(student: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  return [student.lastName, student.firstName].filter(Boolean).join(" ");
}

export default function StudentsScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const handleSearchChange = useCallback((text: string) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
      setVisibleCount(PAGE_SIZE);
    }, 400);
  }, []);

  const { data: students, isLoading } = useQuery(
    trpc.student.all.queryOptions({
      limit: 100,
      query: debouncedSearch || undefined,
    }),
  );

  const visibleStudents = useMemo(() => {
    if (!students) return [];
    return students.slice(0, visibleCount);
  }, [students, visibleCount]);

  const insets = useSafeAreaInsets();

  const loadMore = useCallback(() => {
    if (!students) return;
    if (visibleCount >= students.length) return;
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, students.length));
  }, [students, visibleCount]);

  const renderItem = useCallback(
    ({
      item: student,
    }: {
      item: NonNullable<typeof students>[number];
    }) => (
      <Pressable className="mx-6 mb-3">
        <Card className="p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-foreground font-medium text-base mb-1">
                {getFullName(student)}
              </Text>
              <View className="flex-row items-center gap-3">
                {student.classroom?.name && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="school-outline"
                      size={14}
                      color="#888"
                    />
                    <Text className="text-muted text-xs">
                      {student.classroom.name}
                    </Text>
                  </View>
                )}
                {student.registrationNumber && (
                  <Text className="text-muted text-xs">
                    #{student.registrationNumber}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </Card>
      </Pressable>
    ),
    [],
  );

  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-4 pb-2">
        <Input
          placeholder="Search students..."
          value={search}
          onChangeText={handleSearchChange}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Spinner size="sm" />
        </View>
      ) : (
        <FlatList
          data={visibleStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-muted">
                {debouncedSearch
                  ? "No students match your search"
                  : "No students found"}
              </Text>
            </View>
          }
          ListFooterComponent={
            students && visibleCount < students.length ? (
              <View className="items-center py-4">
                <Spinner size="sm" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
