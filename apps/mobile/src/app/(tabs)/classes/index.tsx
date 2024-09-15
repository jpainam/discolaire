import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useDebounce } from "use-debounce";

import type { RouterOutputs } from "~/utils/api";
import { Loader } from "~/components/Loader";
import { useThemeColor, View } from "~/components/Themed";
import { api } from "~/utils/api";
import { ClassroomListItem } from "./classroom-list-item";

type Classroom = RouterOutputs["classroom"]["all"][number];
const Page = () => {
  const [items, setItems] = useState<Classroom[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const classroomsQuery = api.classroom.all.useQuery();
  const [debounceValue] = useDebounce(searchText, 500);

  useEffect(() => {
    if (!classroomsQuery.data) return;
    setItems(classroomsQuery.data);
  }, [classroomsQuery.data]);

  useEffect(() => {
    if (!classroomsQuery.data) return;
    setItems(
      classroomsQuery.data.filter((item) =>
        item.name.toLowerCase().includes(debounceValue.toLowerCase()),
      ),
    );
  }, [classroomsQuery.data, debounceValue]);

  const borderColor = useThemeColor({}, "borderColor");

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {classroomsQuery.isPending && <Loader />}
      <Stack.Screen
        options={{
          headerTitle: "Classes",
          headerBlurEffect: "regular",
          headerShadowVisible: false,
          headerTransparent: true,
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: backgroundColor,
          // },
          headerSearchBarOptions: {
            placeholder: "Rechercher...",
            onChangeText: (text) => {
              setSearchText(text.nativeEvent.text);
            },
            onSearchButtonPress: (text) => {
              setSearchText(text.nativeEvent.text);
            },
            hideWhenScrolling: false,
          },
        }}
      />
      {classroomsQuery.data && (
        <FlashList
          data={items}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => (
            <View style={{ borderColor: borderColor, borderWidth: 0.5 }} />
          )}
          renderItem={({ item }) => (
            <ClassroomListItem
              key={item.id}
              id={item.id}
              name={item.name}
              size={item.size}
              maxSize={item.maxSize}
            />
          )}
        />
      )}
    </View>
  );
};
export default Page;
