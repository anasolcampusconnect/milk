import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // <-- 1. Import AuthContext

const LivestockOnboarding = () => {
  const route = useRouter();
  const { isLoggedIn } = useAuth(); // <-- 2. Get login state

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={require('../assets/images/cow1jpg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >


              <View style={styles.tagContainer}>


                <View style={[styles.glassTag, styles.tag1]}>
                  <Text style={styles.tagText}>Natural Envi:</Text>
                  <Ionicons name="grid" size={14} color="white" />
                </View>


                <View style={[styles.glassTag, styles.tag2]}>
                  <Ionicons name="grid" size={14} color="white" />
                  <Text style={[styles.tagText, { marginLeft: 8 }]}>Weight 400kg +</Text>
                </View>


                <View style={[styles.glassTag, styles.tag3]}>
                  <Text style={styles.tagText}>Free Diseases</Text>
                  <Ionicons name="grid" size={14} color="white" />
                </View>
              </View>


              <View style={styles.bottomSection}>
                <Text style={styles.title}>
                  The New Era of{"\n"}Livestock Farming
                </Text>

                <Text style={styles.subtitle}>
                  The New Era of Livestock Farming blends smart technology with tradition to boost efficiency, sustainability, and welfare.
                </Text>


                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.button}
                  onPress={() => {
                    // <-- 3. Route conditionally based on auth state
                    if (isLoggedIn) {
                      route.push('/dashboard');
                    } else {
                      route.push('/login');
                    }
                  }}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="grid" size={24} color="#3e4a3d" />
                  </View>

                  <Text style={styles.buttonText}>Get Started</Text>

                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>

            </ScrollView>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a3b18a',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  tagContainer: {
    flex: 1,
    position: 'relative',
    minHeight: 350,
  },
  glassTag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  tag1: {
    top: '15%',
    left: 24,
  },
  tag2: {
    top: '38%',
    right: 24,
  },
  tag3: {
    top: '55%',
    left: 40,
  },
  tagText: {
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  bottomSection: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    paddingTop: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    fontSize: 16,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 100,
    padding: 8,
    paddingRight: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  iconCircle: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

export default LivestockOnboarding;