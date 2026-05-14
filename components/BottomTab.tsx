import React, { ComponentProps } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router'; //
import { LinearGradient } from 'expo-linear-gradient'; //

const { width } = Dimensions.get('window');

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  name: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
  path: string;
}

const BottomTab = () => {
  const router = useRouter(); //
  const pathname = usePathname(); //

  // Define navigation items matching your RootLayout stack names
  const tabs: TabItem[] = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', path: '/dashboard' }, //
    { name: 'Products', icon: 'grid-outline', activeIcon: 'grid', path: '/products' }, //
    { name: 'Cart', icon: 'cart-outline', activeIcon: 'cart', path: '/cart' }, //
    { name: 'Profile', icon: 'person-outline', activeIcon: 'person', path: '/wishlist' }, //
  ];

  // Helper to check if the current tab is active based on the URL path
  const isActive = (path: string) => pathname === path;

  // Only show on mobile platforms to prevent overlapping with web NavigationBar
  if (Platform.OS === 'web') return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => router.push(tab.path as any)} // CHANGE: Trigger routing to defined path
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive(tab.path) ? tab.activeIcon : tab.icon} //
                size={24}
                color={isActive(tab.path) ? '#667eea' : '#999'} //
              />
              {isActive(tab.path) && <View style={styles.activeDot} />}
            </View>
            <Text style={[styles.tabLabel, isActive(tab.path) && styles.tabLabelActive]}>
              {tab.name} {/* CHANGE: Render the tab name label */}
            </Text>
          </TouchableOpacity>
        ))}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 4,
  },
  iconContainer: {
    position: 'relative',
    height: 30,
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#667eea',
    alignSelf: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#667eea',
    fontWeight: 'bold',
  },
});

export default BottomTab;