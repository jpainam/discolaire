import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { Card, Skeleton, Tabs } from "heroui-native";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { trpc } from "@/utils/trpc";

function getFullName(person: {
  firstName?: string | null;
  lastName?: string | null;
}) {
  return [person.lastName, person.firstName].filter(Boolean).join(" ");
}

// ── Skeleton loading ──────────────────────────────────────────────

function DetailsSkeleton() {
  return (
    <View className="p-6 gap-4">
      <Skeleton className="h-6 w-3/4 rounded-md" />
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <View className="flex-row gap-3 mt-2">
        <Skeleton className="h-16 flex-1 rounded-lg" />
        <Skeleton className="h-16 flex-1 rounded-lg" />
        <Skeleton className="h-16 flex-1 rounded-lg" />
      </View>
      <Skeleton className="h-10 w-full rounded-lg mt-4" />
      <View className="gap-3 mt-2">
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </View>
    </View>
  );
}

function ListSkeleton() {
  return (
    <View className="gap-3 mt-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-lg" />
      ))}
    </View>
  );
}

// ── Tab content components ────────────────────────────────────────

function StudentsTab({ classroomId }: { classroomId: string }) {
  const { data: students, isLoading } = useQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );

  if (isLoading) return <ListSkeleton />;
  if (!students?.length) return <EmptyState text="No students enrolled" />;

  return (
    <View className="gap-3 mt-3">
      {students.map((student) => (
        <Card key={student.id} className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-foreground font-medium text-sm">
                {getFullName(student)}
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {student.registrationNumber ?? "—"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </View>
        </Card>
      ))}
    </View>
  );
}

function FeesTab({ classroomId }: { classroomId: string }) {
  const { data: fees, isLoading } = useQuery(
    trpc.classroom.fees.queryOptions(classroomId),
  );

  if (isLoading) return <ListSkeleton />;
  if (!fees?.length) return <EmptyState text="No fees configured" />;

  return (
    <View className="gap-3 mt-3">
      {fees.map((fee) => (
        <Card key={fee.id} className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-foreground font-medium text-sm">
                {fee.name}
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {fee.amount?.toLocaleString() ?? "—"} · Due{" "}
                {fee.dueDate
                  ? new Date(fee.dueDate).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}

function SubjectsTab({ classroomId }: { classroomId: string }) {
  const { data: subjects, isLoading } = useQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  if (isLoading) return <ListSkeleton />;
  if (!subjects?.length) return <EmptyState text="No subjects assigned" />;

  return (
    <View className="gap-3 mt-3">
      {subjects.map((subject) => (
        <Card key={subject.id} className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-foreground font-medium text-sm">
                {subject.course?.name ?? subject.name}
              </Text>
              {subject.teacher && (
                <Text className="text-muted text-xs mt-0.5">
                  {getFullName(subject.teacher)}
                </Text>
              )}
            </View>
            {subject.coefficient != null && (
              <Text className="text-muted text-xs">
                Coeff. {subject.coefficient}
              </Text>
            )}
          </View>
        </Card>
      ))}
    </View>
  );
}

function AssignmentsTab({ classroomId }: { classroomId: string }) {
  const { data: assignments, isLoading } = useQuery(
    trpc.classroom.assignments.queryOptions(classroomId),
  );

  if (isLoading) return <ListSkeleton />;
  if (!assignments?.length) return <EmptyState text="No assignments yet" />;

  return (
    <View className="gap-3 mt-3">
      {assignments.map((assignment) => (
        <Card key={assignment.id} className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-foreground font-medium text-sm">
                {assignment.name}
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {assignment.subject?.course?.name ?? "—"} ·{" "}
                {assignment.term?.name ?? "—"}
              </Text>
            </View>
            {assignment.date && (
              <Text className="text-muted text-xs">
                {new Date(assignment.date).toLocaleDateString()}
              </Text>
            )}
          </View>
        </Card>
      ))}
    </View>
  );
}

function AttendanceTab({ classroomId }: { classroomId: string }) {
  const { data: attendances, isLoading } = useQuery(
    trpc.attendance.all.queryOptions({ classroomId, limit: 50 }),
  );

  if (isLoading) return <ListSkeleton />;
  if (!attendances?.length)
    return <EmptyState text="No attendance records" />;

  return (
    <View className="gap-3 mt-3">
      {attendances.map((attendance) => (
        <Card key={attendance.id} className="p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-foreground font-medium text-sm">
                {getFullName(attendance.student)}
              </Text>
              <Text className="text-muted text-xs mt-0.5">
                {attendance.type} · {attendance.term?.name ?? "—"}
              </Text>
            </View>
            <Text className="text-muted text-xs">
              {new Date(attendance.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View className="items-center justify-center py-12">
      <Text className="text-muted text-sm">{text}</Text>
    </View>
  );
}

// ── Info stat card ────────────────────────────────────────────────

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex-1 items-center p-3">
      <Text className="text-foreground text-lg font-semibold">{value}</Text>
      <Text className="text-muted text-xs mt-0.5">{label}</Text>
    </Card>
  );
}

// ── Main screen ───────────────────────────────────────────────────

export default function ClassroomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: classroom,
    isLoading,
    isRefetching,
  } = useQuery(trpc.classroom.get.queryOptions(id));

  const [activeTab, setActiveTab] = useState("students");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries(trpc.classroom.get.pathFilter());
    await queryClient.invalidateQueries(trpc.classroom.students.pathFilter());
    await queryClient.invalidateQueries(trpc.classroom.fees.pathFilter());
    await queryClient.invalidateQueries(trpc.classroom.subjects.pathFilter());
    await queryClient.invalidateQueries(
      trpc.classroom.assignments.pathFilter(),
    );
    await queryClient.invalidateQueries(trpc.attendance.all.pathFilter());
    setRefreshing(false);
  }, [queryClient]);

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading..." }} />
        <View className="flex-1 bg-background">
          <DetailsSkeleton />
        </View>
      </>
    );
  }

  if (!classroom) {
    return (
      <>
        <Stack.Screen options={{ title: "Not Found" }} />
        <View className="flex-1 bg-background items-center justify-center">
          <Text className="text-muted">Classroom not found</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: classroom.name,
        }}
      />
      <View className="flex-1 bg-background">
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing || isRefetching}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Classroom info header */}
          <View className="px-6 pt-4 pb-2">
            <Text className="text-muted text-sm mb-3">
              {[classroom.cycle?.name, classroom.section?.name, classroom.level?.name]
                .filter(Boolean)
                .join(" · ")}
            </Text>

            <View className="flex-row gap-3 mb-3">
              <StatCard label="Students" value={classroom.size} />
              <StatCard label="Max" value={classroom.maxSize} />
              <StatCard
                label="Girls / Boys"
                value={`${classroom.femaleCount} / ${classroom.maleCount}`}
              />
            </View>

            {classroom.headTeacher && (
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="person-outline" size={14} color="#888" />
                <Text className="text-muted text-xs">
                  Head teacher: {getFullName(classroom.headTeacher)}
                </Text>
              </View>
            )}
            {classroom.classroomLeader && (
              <View className="flex-row items-center gap-2">
                <Ionicons name="star-outline" size={14} color="#888" />
                <Text className="text-muted text-xs">
                  Class leader: {getFullName(classroom.classroomLeader)}
                </Text>
              </View>
            )}
          </View>

          {/* Tabs */}
          <View className="px-6 pt-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              variant="secondary"
            >
              <Tabs.List>
                <Tabs.ScrollView>
                  <Tabs.Indicator />
                  <Tabs.Trigger value="students">
                    <Tabs.Label>Students</Tabs.Label>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="fees">
                    <Tabs.Label>Fees</Tabs.Label>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="subjects">
                    <Tabs.Label>Subjects</Tabs.Label>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="assignments">
                    <Tabs.Label>Assignments</Tabs.Label>
                  </Tabs.Trigger>
                  <Tabs.Trigger value="attendance">
                    <Tabs.Label>Attendance</Tabs.Label>
                  </Tabs.Trigger>
                </Tabs.ScrollView>
              </Tabs.List>

              <Tabs.Content value="students">
                <StudentsTab classroomId={id} />
              </Tabs.Content>
              <Tabs.Content value="fees">
                <FeesTab classroomId={id} />
              </Tabs.Content>
              <Tabs.Content value="subjects">
                <SubjectsTab classroomId={id} />
              </Tabs.Content>
              <Tabs.Content value="assignments">
                <AssignmentsTab classroomId={id} />
              </Tabs.Content>
              <Tabs.Content value="attendance">
                <AttendanceTab classroomId={id} />
              </Tabs.Content>
            </Tabs>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
