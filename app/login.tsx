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
  ActivityIndicator,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

type AuthView = 'login' | 'register' | 'forgot';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const switchView = (newView: AuthView) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setView(newView);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const showAlert = (title: string, message: string) => {
    if (isWeb) {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleAuthAction = async () => {
    if (view === 'login') {
      if (!email || !password) {
        showAlert("Error", "Please fill in all fields");
        return;
      }

      // Hardcoded Credential Check
      if (email.toLowerCase() === 'user@test.com' && password === '123456') {
        setLoading(true);
        try {
          await login(email, password);
          router.replace('/dashboard');
        } catch (error) {
          showAlert("Login Failed", "An error occurred during login.");
        } finally {
          setLoading(false);
        }
      } else {
        showAlert("Invalid Credentials", "Please use:\nEmail: user@test.com\nPassword: 123456");
      }

    } else if (view === 'register') {
      if (!name || !email || !password) {
        showAlert("Error", "Please fill in all fields to register");
        return;
      }

      setLoading(true);
      try {
        // Automatically log them in after "registering"
        await login(email, password);
        router.replace('/dashboard');
      } catch (error) {
        showAlert("Registration Failed", "Something went wrong.");
      } finally {
        setLoading(false);
      }
    } else {
      // Handle forgot password logic here
      showAlert("Reset Link Sent", "Check your email for instructions.");
      switchView('login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#F5F3FF', '#EDE9FE', '#DDD6FE']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[
              styles.cardWrapper,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              <View style={styles.loginCard}>

                <View style={styles.imageHeader}>
                  <Image
                    source={require('../assets/images/hero.png')}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,1)']}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.brandBadge}>
                    <Ionicons name="leaf" size={16} color="#7B61FF" />
                    <Text style={styles.brandBadgeText}>MilkConnect</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  {view === 'login' ? (
                    <>
                      <View style={styles.headerText}>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                      </View>

                      <View style={styles.inputsGroup}>
                        <View style={styles.inputContainer}>
                          <Ionicons name="mail-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Email (user@test.com)"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                          />
                        </View>
                        <View style={styles.inputContainer}>
                          <Ionicons name="lock-closed-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Password (123456)"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                          />
                          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.linkBtn} onPress={() => switchView('forgot')}>
                          <Text style={styles.linkBtnText}>Forgot password?</Text>
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity style={styles.mainBtn} onPress={handleAuthAction} disabled={loading}>
                        <LinearGradient colors={['#7B61FF', '#6366F1']} style={styles.btnGradient}>
                          {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.btnText}>Sign In</Text>}
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>or use</Text>
                        <View style={styles.line} />
                      </View>

                      <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-google" size={18} color="#333" /><Text style={styles.socialText}>Google</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.socialBtn}><Ionicons name="logo-apple" size={18} color="#333" /><Text style={styles.socialText}>Apple</Text></TouchableOpacity>
                      </View>

                      <View style={styles.footer}>
                        <Text style={styles.footerText}>New here? </Text>
                        <TouchableOpacity onPress={() => switchView('register')}>
                          <Text style={styles.footerLink}>Register Account</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : null}

                  {view === 'register' ? (
                    <>
                      <View style={styles.headerText}>
                        <Text style={styles.title}>Join MilkConnect</Text>
                        <Text style={styles.subtitle}>Create your cattle management portal</Text>
                      </View>

                      <View style={styles.inputsGroup}>
                        <View style={styles.inputContainer}>
                          <Ionicons name="person-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                          />
                        </View>
                        <View style={styles.inputContainer}>
                          <Ionicons name="mail-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                          />
                        </View>
                        <View style={styles.inputContainer}>
                          <Ionicons name="lock-closed-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Create Password"
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                          />
                          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.mainBtn} onPress={handleAuthAction} disabled={loading}>
                        <LinearGradient colors={['#7B61FF', '#6366F1']} style={styles.btnGradient}>
                          {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.btnText}>Create Account</Text>}
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => switchView('login')}>
                          <Text style={styles.footerLink}>Sign In</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : null}

                  {view === 'forgot' ? (
                    <>
                      <View style={styles.headerText}>
                        <Text style={styles.title}>Reset Password</Text>
                        <Text style={styles.subtitle}>Enter email to receive recovery instructions</Text>
                      </View>

                      <View style={styles.inputsGroup}>
                        <View style={styles.inputContainer}>
                          <Ionicons name="mail-outline" size={20} color="#7B61FF" style={styles.icon} />
                          <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                          />
                        </View>
                      </View>

                      <TouchableOpacity style={styles.mainBtn} onPress={handleAuthAction} disabled={loading}>
                        <LinearGradient colors={['#7B61FF', '#6366F1']} style={styles.btnGradient}>
                          {loading ? <ActivityIndicator color="#FFF" size="small" /> : <Text style={styles.btnText}>Send Reset Link</Text>}
                        </LinearGradient>
                      </TouchableOpacity>

                      <View style={styles.footer}>
                        <TouchableOpacity onPress={() => switchView('login')} style={styles.backRow}>
                          <Ionicons name="arrow-back" size={16} color="#7B61FF" />
                          <Text style={styles.footerLink}> Back to Login</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : null}
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  cardWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  loginCard: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#FFF',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  imageHeader: {
    height: Platform.OS === 'web' ? Math.min(height * 0.2, 140) : 160,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
  },
  brandBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  brandBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    marginLeft: 6,
  },
  cardBody: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerText: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputsGroup: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 52,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  linkBtn: {
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  linkBtnText: {
    color: '#7B61FF',
    fontSize: 12,
    fontWeight: '700',
  },
  mainBtn: {
    height: 52,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  btnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    gap: 6,
  },
  socialText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  footerText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  footerLink: {
    color: '#7B61FF',
    fontWeight: '800',
    fontSize: 13,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default LoginPage;