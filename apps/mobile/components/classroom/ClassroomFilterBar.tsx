import { useQuery } from "@tanstack/react-query";
import {
  Appearance,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "~/constants/theme";
import { useClassroomFilterStore } from "~/stores/classroom";
import { trpc } from "~/utils/api";

export default function ClassroomFilterBar() {
  //const theme = useColorScheme() ?? "light";
  const cyclesQuery = useQuery(trpc.classroomCycle.all.queryOptions());
  const sectionsQuery = useQuery(trpc.classroomSection.all.queryOptions());
  const { setSection, section, cycle, setCycle } = useClassroomFilterStore();
  if (cyclesQuery.isPending || sectionsQuery.isPending) {
    return <View></View>;
  }
  return (
    <View style={styles.container}>
      {/* <View style={styles.filterHeader}>
        <View style={styles.filterIcon}>
          <Filter size={16} color={Colors[theme].icon} />
          <Text style={styles.filterText}>Filtres</Text>
        </View>
      </View> */}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <View style={styles.filterSection}>
          {/* <Text style={styles.filterLabel}>Section:</Text> */}
          <View style={styles.filterOptions}>
            {sectionsQuery.data?.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterOption,
                    item.id === section && styles.selectedOption,
                  ]}
                  onPress={() => setSection(item.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      section === item.id && styles.selectedOptionText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.filterSection}>
          {/* <Text style={styles.filterLabel}>Cycle:</Text> */}
          <View style={styles.filterOptions}>
            {cyclesQuery.data?.map((item) => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.filterOption,
                    item.id === cycle && styles.selectedOption,
                  ]}
                  onPress={() => setCycle(item.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      cycle === item.id && styles.selectedOptionText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  filterIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
    marginLeft: 6,
  },
  filtersContainer: {
    paddingBottom: 8,
  },
  filterSection: {
    marginRight: 16,
  },
  filterLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: Colors[theme].colors.text.secondary,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    backgroundColor: Colors[theme].colors.neutral[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedOption: {
    backgroundColor: Colors[theme].colors.primary[500],
  },
  optionText: {
    fontFamily: "Inter-Medium",
    fontSize: 13,
    color: Colors[theme].colors.text.secondary,
  },
  selectedOptionText: {
    color: Colors[theme].colors.background,
  },
});
