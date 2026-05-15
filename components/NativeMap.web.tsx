import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
 
export default function NativeMap() {
  return (
    <View style={styles.mapLoading}>
      <Ionicons name="map-outline" size={40} color="#CCC" />
      <Text style={styles.mapLoadingText}>
        Interactive map is currently optimized for the mobile app. Please type
        your address manually above.
      </Text>
    </View>
  );
}
 
const styles = StyleSheet.create({
  mapLoading: {
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapLoadingText: { marginTop: 12, color: "#666", textAlign: "center" },
});