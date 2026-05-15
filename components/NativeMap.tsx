import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
 
export default function NativeMap({
  currentLocation,
  selectedLocation,
  handleMapPress,
  handleMarkerDragEnd,
}: any) {
  if (Platform.OS === 'web') return null;

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: currentLocation?.latitude || 17.4474,
        longitude: currentLocation?.longitude || 78.3752,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={handleMapPress}
    >
      {selectedLocation && (
        <Marker
          coordinate={selectedLocation}
          draggable
          onDragEnd={handleMarkerDragEnd}
        >
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.marker}>
            <Ionicons name="location" size={20} color="#FFF" />
          </LinearGradient>
        </Marker>
      )}
    </MapView>
  );
}
 
const styles = StyleSheet.create({
  map: { width: "100%", height: 400 },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
});