import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { Text } from "~/components/nativewindui/Text";
import { useColorScheme } from "~/lib/useColorScheme";

const Tab = createMaterialTopTabNavigator();

const OverviewTab = () => (
  <ScrollView className="p-4">
    <View className="mb-4">
      <Text className="mb-2 text-lg font-semibold">TODAY'S SCHEDULE</Text>
      <Text>6:30 am - 9:30 am • 3:30 pm - 5:00 pm</Text>
      <Link href="/" className="mt-1 text-blue-500">
        Full schedule
      </Link>
    </View>

    <View className="mb-4">
      <Text className="mb-2 text-lg font-semibold">PROGRAMS</Text>
      <View className="mb-1 flex-row justify-between">
        <Text>Basketball</Text>
        <Text className="text-red-500">Checked out</Text>
      </View>
      <View className="flex-row justify-between">
        <Text>Afterschool care</Text>
        <Text className="text-blue-500">Checked in</Text>
      </View>
    </View>

    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="font-semibold">BIRTHDAY</Text>
        <Text className="font-semibold">AGE</Text>
      </View>
      <View className="flex-row justify-between">
        <Text>August 19, 2018</Text>
        <Text>2 years, 37 days</Text>
      </View>
    </View>

    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="font-semibold">ALLERGIES</Text>
        <Text className="font-semibold">MEDICATIONS</Text>
      </View>
      <View className="flex-row justify-between">
        <Text>Peanuts</Text>
        <Text>Advil</Text>
      </View>
    </View>

    <View className="mb-4">
      <Text className="mb-1 font-semibold">ADDRESS</Text>
      <Text>2709 Main Street, Los Angeles, CA 91034</Text>
    </View>

    <View>
      <Text className="mb-1 font-semibold">SIBLINGS</Text>
      <Text>Daniel Andrews</Text>
      <Text className="text-gray-500">Hungry Sharks</Text>
    </View>
  </ScrollView>
);

const DocumentsTab = () => (
  <View>
    <Text>Documents Content</Text>
  </View>
);
const GuardiansTab = () => (
  <View>
    <Text>Guardians Content</Text>
  </View>
);
const SettingsTab = () => (
  <View>
    <Text>Settings Content</Text>
  </View>
);

export default function StudentScreen() {
  const { colors } = useColorScheme();
  const { id } = useLocalSearchParams();
  console.log("Student ID:", id);

  // Placeholder student data

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "yellow" }}>
      {/* <StudentDetails /> */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { textTransform: "none" },
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
        }}
      >
        <Tab.Screen key={"Overview"} name="Overview" component={OverviewTab} />
        <Tab.Screen
          key={"Documents"}
          name="Documents"
          component={DocumentsTab}
        />
        <Tab.Screen
          key={"Guardians"}
          name="Guardians"
          component={GuardiansTab}
        />
        <Tab.Screen key="Settings" name="Settings" component={SettingsTab} />
        <Tab.Screen
          key={"Guardians2"}
          name="Guardians2"
          component={GuardiansTab}
        />
        <Tab.Screen
          key={"Guardians3"}
          name="Guardians3"
          component={GuardiansTab}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
