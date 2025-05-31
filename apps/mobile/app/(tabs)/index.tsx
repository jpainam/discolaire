import React from "react";
import {
  Appearance,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AcademicProgress from "~/components/home/AcademicProgress";
import NewsFeed from "~/components/home/NewsFeed";
import Notifications from "~/components/home/Notifications";
import QuickActions from "~/components/home/QuickActions";
import TodaySchedule from "~/components/home/TodaySchedule";
import UpcomingEvents from "~/components/home/UpcomingEvents";
import WeatherInfo from "~/components/home/WeatherInfo";
import WelcomeHeader from "~/components/home/WelcomeHeader";
import { Colors } from "~/constants/Colors";

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate fetching data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* <StatusBar style="dark" /> */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <WelcomeHeader />

        <View style={styles.weatherAndActions}>
          <WeatherInfo />
          <QuickActions />
        </View>

        <View style={styles.twoColumnLayout}>
          <AcademicProgress />
          <TodaySchedule />
        </View>

        <UpcomingEvents />
        <NewsFeed />
        <Notifications />

        {/* Add padding at the bottom for better scrolling experience */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const theme = Appearance.getColorScheme() ?? "light";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors[theme].background,
  },
  scrollContent: {
    padding: 16,
  },
  weatherAndActions: {
    marginBottom: 16,
  },
  twoColumnLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
