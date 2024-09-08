import { useState } from "react";
import { ActivityIndicator, Platform, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { FlashList } from "@shopify/flash-list";
import { useDebounce } from "use-debounce";

import { Text, useThemeColor, View } from "~/components/Themed";
import { api } from "~/utils/api";

export default function ModalScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const [searchText, setSearchText] = useState<string>("");
  const [debounceValue] = useDebounce(searchText, 1000);
  const studentsQuery = api.student.all.useQuery({
    q: debounceValue,
  });
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTitle: "Search",
          headerBlurEffect: "regular",
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerStyle: {
            backgroundColor: backgroundColor,
          },
          headerSearchBarOptions: {
            placeholder: "Search students",
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
        renderItem={({ item }) => {
          return (
            <StudentListItem
              id={item.id}
              name={item.lastName + ", " + item.firstName}
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

interface StudentListItemProps {
  id: string;
  name: string;
  //avatar: string;
}
function StudentListItem({ id, name }: StudentListItemProps) {
  return (
    <View>
      <Link
        asChild
        href={{
          pathname: "/student/[id]",
          params: { id: id },
        }}
      >
        <Pressable>
          <Text>{name}</Text>
        </Pressable>
      </Link>
    </View>
  );
}
