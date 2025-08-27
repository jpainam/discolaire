import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Appearance,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "~/components/Avatar";
import BoxedIcon from "~/components/BoxedIcon";
import { ThemedText } from "~/components/ThemedText";
import { ThemedView } from "~/components/ThemedView";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { authClient } from "~/utils/auth";

export default function Screen() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
  });
  const { data: session } = authClient.useSession();

  const theme = useColorScheme() ?? "light";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        backgroundColor: Colors[theme].background,
        paddingBottom: 40,
      }}
    >
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
        }}
      >
        <Avatar imageUrl={session?.user.image} />

        <ThemedView>
          <ThemedText type="defaultSemiBold">John Doe</ThemedText>
          <ThemedText style={{ fontSize: 14, opacity: 0.8 }}>
            john@example.com
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={{ paddingVertical: 12 }}>
        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

        <ThemedView>
          <ThemedView style={[styles.rowWrapper]}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <BoxedIcon name={"language"} backgroundColor={"blue"} />

              <ThemedText style={styles.rowLabel}>Language</ThemedText>

              <ThemedText style={styles.rowSpacer} />

              <ThemedText style={styles.rowValue}>English</ThemedText>

              <Ionicons
                color={Colors[theme].icon}
                name="chevron-forward"
                size={19}
              />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.rowWrapper}>
            <TouchableOpacity
              onPress={() => {
                // handle onPress
              }}
              style={styles.row}
            >
              <BoxedIcon name={"location"} backgroundColor={"green"} />
              <ThemedText style={styles.rowLabel}>Location</ThemedText>

              <ThemedView style={styles.rowSpacer} />

              <ThemedText style={styles.rowValue}>Los Angeles, CA</ThemedText>

              <Ionicons color="#bcbcbc" name="chevron-forward" size={19} />
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.rowWrapper}>
            <ThemedView style={styles.row}>
              <Text style={styles.rowLabel}>Email Notifications</Text>

              <ThemedView style={styles.rowSpacer} />

              <Switch
                onValueChange={(emailNotifications) =>
                  setForm({ ...form, emailNotifications })
                }
                style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                value={form.emailNotifications}
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={[styles.rowWrapper, styles.rowLast]}>
            <ThemedView style={styles.row}>
              <ThemedText style={styles.rowLabel}>
                Push Notifications
              </ThemedText>

              <ThemedView style={styles.rowSpacer} />

              <Switch
                onValueChange={(pushNotifications) =>
                  setForm({ ...form, pushNotifications })
                }
                style={{ transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] }}
                value={form.pushNotifications}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ThemedView>

      <ThemedView>
        <TouchableOpacity
          onPress={async () => {
            await authClient.signOut();
            router.push("/auth");
          }}
          style={[styles.rowWrapper, styles.rowLast]}
        >
          <ThemedView style={styles.row}>
            <ThemedText style={[styles.rowLabel, styles.rowLabelLogout]}>
              Log Out
            </ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </ThemedView>

      <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
    </ScrollView>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  /** Header */

  /** Content */

  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    //color: "#a69f9f",
  },
  /** Section */

  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: "500",
    opacity: 0.8,
    textTransform: "uppercase",
  },

  /** Row */
  row: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    //backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: Colors[theme].border,
  },

  rowLabel: {
    fontSize: 14,
    flex: 1,
    letterSpacing: 0.24,
    //color: "#000",
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.4,
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: "100%",
    textAlign: "center",
    fontWeight: "600",
    //color: "#dc2626",
  },
});
