import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const isWeb = Platform.OS === 'web';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface TabItem {
  name: string;
  icon: IoniconsName;
  activeIcon: IoniconsName;
  path: string;
}

const BottomTab = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { name: 'Home', icon: 'home-outline', activeIcon: 'home', path: '/dashboard' },
    { name: 'Products', icon: 'grid-outline', activeIcon: 'grid', path: '/products' },
    { name: 'Cart', icon: 'cart-outline', activeIcon: 'cart', path: '/cart' },
    { name: 'Wishlist', icon: 'heart-outline', activeIcon: 'heart', path: '/wishlist' },
  ];

  const isActive = (path: string) => pathname === path;

  // REMOVED: The web restriction is gone! It will now render on all platforms.

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.tabBarBackground}>
        <View style={[styles.tabBar, isWeb && styles.webWidthLimit]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isActive(tab.path) ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive(tab.path) ? '#667eea' : '#999'}
                />
                {isActive(tab.path) && <View style={styles.activeDot} />}
              </View>
              <Text style={[styles.tabLabel, isActive(tab.path) && styles.tabLabelActive]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
  tabBarBackground: {
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  tabBar: {
    flexDirection: 'row',
    height: isWeb ? 70 : 85,
    paddingBottom: isWeb ? 0 : (Platform.OS === 'ios' ? 20 : 20),
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  webWidthLimit: {
    maxWidth: 800, 
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#EBF0FF',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  iconContainer: {
    position: 'relative',
    height: isWeb ? 26 : 30,
    justifyContent: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: isWeb ? -4 : -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#667eea',
    alignSelf: 'center',
  },
  tabLabel: {
    fontSize: isWeb ? 12 : 10,
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
