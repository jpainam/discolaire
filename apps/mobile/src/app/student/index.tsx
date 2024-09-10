import { useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import { useDebounce } from "use-debounce";

import { useThemeColor, View } from "~/components/Themed";
import { api } from "~/utils/api";
import { StudentListItem } from "./student-list-item";

export default function ModalScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "borderColor");
  const [searchText, setSearchText] = useState<string>("");
  const [debounceValue] = useDebounce(searchText, 1000);
  const studentsQuery = api.student.all.useQuery({
    q: debounceValue,
  });
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Elèves",
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            onChangeText: (text) => {
              setSearchText(text.nativeEvent.text);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSearchButtonPress: (ev: any) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              console.log(ev?.nativeEvent?.text);
            },
            hideWhenScrolling: false,
          },
        }}
      />
      {studentsQuery.isPending && <ActivityIndicator />}

      <FlashList
        data={studentsQuery.data}
        estimatedItemSize={20}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderColor: borderColor,
              borderWidth: 0.5,
            }}
          />
        )}
        renderItem={({ item }) => {
          return (
            <StudentListItem
              id={item.id}
              key={item.id}
              name={item.lastName + ", " + item.firstName}
              dateOfBirth={item.dateOfBirth}
              //avatar={item.avatar}
            />
          );
        }}
      />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
