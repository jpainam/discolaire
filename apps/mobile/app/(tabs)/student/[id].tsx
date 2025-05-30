import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StudentDetails } from "~/components/StudentDetails";
import { StudentProfile } from "~/components/StudentProfile";
import Tabs from "~/components/Tabs";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { trpc } from "~/utils/api";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: student,
    isPending,
    isRefetching,
    refetch,
  } = useQuery(trpc.student.get.queryOptions(id));
  const [activeTab, setActiveTab] = useState("Détails");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <ThemedView>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {isPending ? (
          <ThemedView
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: top,
            }}
          >
            <ActivityIndicator size="large" />
          </ThemedView>
        ) : (
          <>
            {!student ? (
              <ThemedView
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: top,
                }}
              >
                <ThemedView>
                  <ThemedText>Elève non trouvé</ThemedText>
                </ThemedView>
              </ThemedView>
            ) : (
              <>
                <StudentProfile student={student} />
                <Tabs
                  onTabChange={handleTabChange}
                  tabs={["Détails", "Notes", "Présence", "Transactions"]}
                  initialTab="Détails"
                />
                {activeTab === "Détails" && <StudentDetails />}
              </>
            )}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}
