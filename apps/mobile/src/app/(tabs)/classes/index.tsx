import { ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { useThemeColor, View } from "~/components/Themed";
import { api } from "~/utils/api";
import { ClassroomListItem } from "./classroom-list-item";

const Page = () => {
  const classroomsQuery = api.classroom.all.useQuery();
  const borderColor = useThemeColor({}, "borderColor");

  const data = classroomsQuery.data;
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {classroomsQuery.isPending && <ActivityIndicator />}

      {classroomsQuery.data && (
        <FlashList
          data={data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => (
            <View style={{ borderColor: borderColor, borderWidth: 0.5 }} />
          )}
          renderItem={({ item }) => (
            <ClassroomListItem
              key={item.id}
              id={item.id}
              name={item.name ?? ""}
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
