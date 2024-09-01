import { ActivityIndicator, Alert, Pressable } from "react-native";
import { Link, router } from "expo-router";

import { Text, View } from "~/components/Themed";
import { api } from "~/utils/api";

function ListItem({
  name,
  id,
  levelName,
}: {
  name: string;
  id: string;
  levelName: string;
}) {
  return (
    <View>
      <View>
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: id },
          }}
        >
          <Pressable>
            <Text>{name}</Text>
            <Text>{levelName}</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const Page = () => {
  const classroomsQuery = api.classroom.all.useQuery();
  if (classroomsQuery.isError) {
    const errorMessage = classroomsQuery.error.message;
    if (errorMessage == "UNAUTHORIZED") {
      router.replace("/auth");
    } else {
      Alert.alert("Error", JSON.stringify(classroomsQuery.error.message));
    }
  }
  return (
    <View>
      {classroomsQuery.isPending && <ActivityIndicator />}
      <Text>{JSON.stringify(classroomsQuery.data)}</Text>
      {/* {classroomsQuery.data && (
        <FlashList
          data={classroomsQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(_p, index) => (
            <ListItem name={"Name"} id={`${index}-index`} levelName={"name"} />
          )}
        />
      )} */}
    </View>
  );
};
export default Page;
