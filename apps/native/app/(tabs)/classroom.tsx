import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Card, Input, Spinner } from "heroui-native";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function ClassroomScreen() {
  const router = useRouter();
  const { data: classrooms, isLoading } = useQuery(
    trpc.classroom.all.queryOptions(),
  );
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!classrooms) return [];
    if (!query.trim()) return classrooms;
    return classrooms.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [classrooms, query]);

  return (
    <Container
      className="p-6"
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
    >
      <View className="mb-4">
        <Input
          placeholder="Search classrooms..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center py-12">
          <Spinner size="sm" />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center py-12">
          <Text className="text-muted">
            {query ? "No classrooms match your search" : "No classrooms found"}
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {filtered.map((classroom) => (
            <Pressable
              key={classroom.id}
              onPress={() => router.push(`/classroom/${classroom.id}`)}
            >
              <Card className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 mr-3">
                    <Text className="text-foreground font-medium text-base mb-1">
                      {classroom.name}
                    </Text>
                    <Text className="text-muted text-sm">
                      {classroom.size} / {classroom.maxSize} students
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#888"
                  />
                </View>
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </Container>
  );
}
