import { Cloud, CloudRain, Sun } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    if (condition.includes("cloud")) return <Cloud size={28} color="#4361ee" />;
    if (condition.includes("rain"))
      return <CloudRain size={28} color="#4361ee" />;
    return <Sun size={28} color="#f59e0b" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.weatherContent}>
        <View style={styles.mainInfo}>
          {getWeatherIcon()}
          <Text style={styles.temperature}>{weatherData.temperature}°</Text>
        </View>

        <View style={styles.weatherDetails}>
          <Text style={styles.condition}>{weatherData.condition}</Text>
          <Text style={styles.location}>{weatherData.location}</Text>
          <Text style={styles.highLow}>
            H: {weatherData.high}° L: {weatherData.low}°
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
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
    color: "#1e293b",
    marginLeft: 8,
  },
  weatherDetails: {
    flex: 1,
  },
  condition: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 2,
  },
  highLow: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
