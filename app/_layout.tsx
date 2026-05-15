import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <View style={styles.container}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="products" />
            <Stack.Screen name="order-history" />
            <Stack.Screen name="order-details" />
            <Stack.Screen name="product-details" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="wishlist" />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="address" />
            <Stack.Screen name="profile" />
          </Stack>
        </View>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    ...(Platform.OS === "web" && {
      // @ts-ignore - zoom is a web-only property
      zoom: "80%",
    }),
  },
});


