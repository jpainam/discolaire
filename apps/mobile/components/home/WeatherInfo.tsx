import { Ionicons } from "@expo/vector-icons";
import { CloudRain, Sun } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { Colors } from "~/constants/Colors";
import { useColorScheme } from "~/hooks/useColorScheme";
import { ThemedText } from "../ThemedText";

// Mock weather data - in a real app, this would come from a weather API
const weatherData = {
  temperature: 72,
  condition: "Partly Cloudy",
  location: "School Campus",
  high: 75,
  low: 65,
};

export default function WeatherInfo() {
  // Function to get the appropriate weather icon based on condition
  const theme = useColorScheme();
  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes("cloud"))
      return (
        <Ionicons
          name={theme == "light" ? "cloud-outline" : "cloudy"}
          size={28}
          color={Colors[theme].icon}
        />
      );
    if (condition.includes("rain"))
      return <CloudRain size={28} color="#4361ee" />;
    return <Sun size={28} color="#f59e0b" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.weatherContent}>
        <View style={styles.mainInfo}>
          {getWeatherIcon()}
          <ThemedText style={styles.temperature}>
            {weatherData.temperature}°
          </ThemedText>
        </View>

        <View style={styles.weatherDetails}>
          <ThemedText style={styles.condition}>
            {weatherData.condition}
          </ThemedText>
          <ThemedText style={styles.location}>
            {weatherData.location}
          </ThemedText>
          <ThemedText style={styles.highLow}>
            H: {weatherData.high}° L: {weatherData.low}°
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const theme = "light";
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors[theme].cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mainInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  temperature: {
    fontSize: 32,
    fontWeight: "600",
    color: Colors[theme].text,
    marginLeft: 8,
  },
  weatherDetails: {
    flex: 1,
  },
  condition: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors[theme].text,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 2,
  },
  highLow: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
  },
});
