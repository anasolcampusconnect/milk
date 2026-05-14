import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Rotating animation for decorative elements
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('./dashboard');
    }, 1500);
  };

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  // Create web-specific styles
  const webInputStyle = Platform.OS === 'web' ? { outlineWidth: 0, outlineStyle: 'none' as const } : {};

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      
      {/* Animated Background Circles */}
      <Animated.View 
        style={[
          styles.circle1,
          { transform: [{ rotate: rotateInterpolate }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.circle2,
          { transform: [{ rotate: rotateInterpolate }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.circle3,
          { transform: [{ rotate: rotateInterpolate }] }
        ]} 
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Back Button */}
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <BlurView intensity={20} style={styles.backButtonBlur}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </BlurView>
            </TouchableOpacity>

            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {/* Logo and Title */}
              <View style={styles.header}>
                <LinearGradient
                  colors={['#FFF', '#FFF', 'rgba(255,255,255,0.9)']}
                  style={styles.logoContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="water" size={60} color="#667eea" />
                </LinearGradient>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
              </View>

              {/* Form Section with Animation */}
              <Animated.View 
                style={[
                  styles.formContainer,
                  { transform: [{ translateY: formSlideAnim }] }
                ]}
              >
                <BlurView intensity={80} tint="light" style={styles.formBlur}>
                  {/* Email Input */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="mail-outline" size={20} color="#667eea" />
                    </View>
                    <TextInput
                      style={[styles.input]}
                      placeholder="Email Address"
                      placeholderTextColor="rgba(102, 126, 234, 0.5)"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                    {email !== '' && (
                      <TouchableOpacity onPress={() => setEmail('')} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color="#667eea" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color="#667eea" />
                    </View>
                    <TextInput
                      style={[styles.input]}
                      placeholder="Password"
                      placeholderTextColor="rgba(102, 126, 234, 0.5)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)} 
                      style={styles.eyeButton}
                    >
                      <Ionicons 
                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                        size={20} 
                        color="#667eea" 
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
                    <TouchableOpacity 
                      style={styles.loginButton}
                      activeOpacity={0.8}
                      onPressIn={handleButtonPressIn}
                      onPressOut={handleButtonPressOut}
                      onPress={handleLogin}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.loginButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <>
                            <Text style={styles.loginButtonText}>Sign In</Text>
                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or continue with</Text>
                    <View style={styles.divider} />
                  </View>

                  {/* Social Login */}
                  <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                      <LinearGradient
                        colors={['#FFF', '#F8F9FA']}
                        style={styles.socialButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="logo-google" size={22} color="#DB4437" />
                        <Text style={styles.socialButtonText}>Google</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                      <LinearGradient
                        colors={['#FFF', '#F8F9FA']}
                        style={styles.socialButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="logo-facebook" size={22} color="#4267B2" />
                        <Text style={styles.socialButtonText}>Facebook</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                      <LinearGradient
                        colors={['#FFF', '#F8F9FA']}
                        style={styles.socialButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="logo-apple" size={22} color="#000" />
                        <Text style={styles.socialButtonText}>Apple</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </Animated.View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity >
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'web' ? 20 : 40,
  },
  backButton: {
    marginTop: Platform.OS === 'web' ? 10 : 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 20 : 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 40 : 34,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  formContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 30,
  },
  formBlur: {
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    overflow: 'hidden',
  },
  inputIconContainer: {
    width: 50,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    paddingRight: 12,
  },
  clearButton: {
    padding: 12,
  },
  eyeButton: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  dividerText: {
    marginHorizontal: 16,
    color: 'rgba(102, 126, 234, 0.6)',
    fontSize: 12,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
  socialButtonGradient: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: Platform.OS === 'web' ? 20 : 10,
  },
  footerText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  signUpText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Animated Circles
  circle1: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  circle3: {
    position: 'absolute',
    top: '40%',
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

export default LoginPage;