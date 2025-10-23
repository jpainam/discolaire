import { useState } from "react";
import {
  Appearance,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Colors } from "~/constants/Colors";
import { ThemedText } from "./ThemedText";

interface TabsProps {
  onTabChange: (tab: string) => void;
  tabs: string[];
  initialTab?: string;
}

const Tabs = ({ onTabChange, tabs, initialTab = tabs[0] }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const theme = useColorScheme();

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              isActive && {
                borderBottomColor:
                  theme === "light" ? Colors.light.tint : Colors.dark.tint,
                borderBottomWidth: 2,
              },
            ]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
          >
            <ThemedText
              style={[
                styles.tabText,
                isActive && {
                  fontWeight: "bold",
                  color:
                    theme === "light" ? Colors.light.text : Colors.dark.text,
                },
              ]}
            >
              {tab}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const theme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    //marginHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors[theme ?? "light"].border,
  },
  tabText: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default Tabs;
