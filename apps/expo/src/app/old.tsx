import { useState } from "react";
import { Button, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import type { RouterOutputs } from "~/utils/api";
import { Text, View } from "~/components/Themed";
import { api } from "~/utils/api";
import { useSignIn, useSignOut, useUser } from "~/utils/auth";

function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
  onDelete: () => void;
}) {
  return (
    <View>
      <View>
        <Link
          asChild
          href={{
            pathname: "/post/[id]",
            params: { id: props.post.id },
          }}
        >
          <Pressable>
            <Text>{props.post.title}</Text>
            <Text>{props.post.content}</Text>
          </Pressable>
        </Link>
      </View>
      <Pressable onPress={props.onDelete}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
}

function CreatePost() {
  const utils = api.useUtils();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { mutate, error } = api.post.create.useMutation({
    async onSuccess() {
      setTitle("");
      setContent("");
      await utils.post.all.invalidate();
    },
  });

  return (
    <View>
      <TextInput value={title} onChangeText={setTitle} placeholder="Title" />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text>{error.data.zodError.fieldErrors.title}</Text>
      )}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <Text>{error.data.zodError.fieldErrors.content}</Text>
      )}
      <Pressable
        onPress={() => {
          mutate({
            title,
            content,
          });
        }}
      >
        <Text>Create</Text>
      </Pressable>
      {error?.data?.code === "UNAUTHORIZED" && (
        <Text>You need to be logged in to create a post</Text>
      )}
    </View>
  );
}

function MobileAuth() {
  const user = useUser();
  const signIn = useSignIn();
  const signOut = useSignOut();

  return (
    <>
      <Text className="pb-2 text-center text-xl font-semibold text-white">
        {user?.name ?? "Not logged in"}
      </Text>
      <Button
        onPress={() => (user ? signOut() : signIn())}
        title={user ? "Sign Out" : "Sign In With Discord"}
        color={"#5B65E9"}
      />
    </>
  );
}

export default function Index() {
  const utils = api.useUtils();

  const postQuery = api.post.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => utils.post.all.invalidate(),
  });

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-background p-4">
        <Text className="pb-2 text-center text-5xl font-bold text-foreground">
          Create <Text className="text-primary">T3</Text> Turbo
        </Text>

        <MobileAuth />
        <Button
          title="Welcome"
          onPress={() => {
            router.push("/welcome");
          }}
        ></Button>
        <View className="py-2">
          <Text className="font-semibold italic text-primary">
            Press on a post
          </Text>
        </View>

        <FlashList
          data={postQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <PostCard
              post={p.item}
              onDelete={() => deletePostMutation.mutate(p.item.id)}
            />
          )}
        />

        <CreatePost />
      </View>
    </SafeAreaView>
  );
}
