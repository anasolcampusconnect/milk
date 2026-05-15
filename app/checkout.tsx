import React, { useState, ComponentProps } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const CheckoutPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State for selections
  const [selectedDate, setSelectedDate] = useState('tomorrow');
  const [selectedSlot, setSelectedSlot] = useState('morning');
  const [selectedPayment, setSelectedPayment] = useState('upi');

  // Mock Data
  const grandTotal = 395; // Inherited from cart

  const handlePlaceOrder = () => {
    if (isWeb) {
      window.alert('Order Placed Successfully! Your fresh dairy products are on the way.');
      router.push('/dashboard');
    } else {
      Alert.alert(
        "Order Confirmed!",
        "Your fresh dairy products are on the way.",
        [{ text: "Back to Home", onPress: () => router.push('/dashboard') }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />


      <View style={styles.header}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={[styles.headerGradient, { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) }]}>
          <View style={[styles.headerContent, isWeb && styles.webWidthLimit]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={{ width: 40 }} /> 
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, isWeb && styles.webWidthLimit]}>


          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.addressCard}>
              <View style={styles.addressIconContainer}>
                <Ionicons name="home" size={20} color="#667eea" />
              </View>
              <View style={styles.addressDetails}>
                <Text style={styles.addressName}>Home</Text>
                <Text style={styles.addressText}>Flat 402, Block B, Green Valley Apartments, Madhapur</Text>
                <Text style={styles.addressPhone}>+91 98765 43210</Text>
              </View>
            </View>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule Delivery</Text>


            <Text style={styles.subLabel}>Select Day</Text>
            <View style={styles.rowGrid}>
              {['today', 'tomorrow'].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[styles.selectCard, selectedDate === date && styles.selectCardActive]}
                  onPress={() => setSelectedDate(date)}
                  activeOpacity={0.7}
                >
                  {selectedDate === date && (
                    <View style={styles.activeCheck}>
                      <Ionicons name="checkmark-circle" size={16} color="#667eea" />
                    </View>
                  )}
                  <Text style={[styles.selectCardTitle, selectedDate === date && styles.activeText]}>
                    {date === 'today' ? 'Today' : 'Tomorrow'}
                  </Text>
                  <Text style={styles.selectCardSub}>
                    {date === 'today' ? '14 May' : '15 May'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>


            <Text style={styles.subLabel}>Select Time Slot</Text>
            <View style={styles.rowGrid}>
              {[
                { id: 'morning', label: 'Morning', time: '6:00 AM - 8:00 AM', icon: 'partly-sunny-outline' },
                { id: 'evening', label: 'Evening', time: '5:00 PM - 7:00 PM', icon: 'moon-outline' }
              ].map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[styles.selectCard, selectedSlot === slot.id && styles.selectCardActive]}
                  onPress={() => setSelectedSlot(slot.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={slot.icon as IoniconsName}
                    size={24}
                    color={selectedSlot === slot.id ? '#667eea' : '#999'}
                    style={styles.slotIcon}
                  />
                  <Text style={[styles.selectCardTitle, selectedSlot === slot.id && styles.activeText]}>
                    {slot.label}
                  </Text>
                  <Text style={styles.selectCardSub}>{slot.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentCard}>

              {[
                { id: 'upi', name: 'UPI (Google Pay, PhonePe)', icon: 'phone-portrait-outline' },
                { id: 'card', name: 'Credit / Debit Card', icon: 'card-outline' },
                { id: 'cod', name: 'Cash on Delivery', icon: 'cash-outline' },
              ].map((method, index) => (
                <View key={method.id}>
                  <TouchableOpacity
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment(method.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.paymentIconBox}>
                      <Ionicons name={method.icon as IoniconsName} size={20} color="#667eea" />
                    </View>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    <Ionicons
                      name={selectedPayment === method.id ? "radio-button-on" : "radio-button-off"}
                      size={24}
                      color={selectedPayment === method.id ? "#667eea" : "#CCC"}
                    />
                  </TouchableOpacity>
                  {index < 2 ? <View style={styles.divider} /> : null}
                </View>
              ))}

            </View>
          </View>

          <View style={{ height: 85 + insets.bottom }} />
        </View>
      </ScrollView>


      <View style={[styles.bottomBar, isWeb && styles.webBottomBar, { paddingBottom: Math.max(insets.bottom, 15) }]}>
        <View style={[styles.bottomContent, isWeb && styles.webWidthLimit]}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{grandTotal}</Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderBtn}
            activeOpacity={0.8}
            onPress={handlePlaceOrder}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.placeOrderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.placeOrderText}>Place Order</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  webWidthLimit: {
    maxWidth: 1100, // Matching other pages for clean side margins
    width: '100%',
    alignSelf: 'center',
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
  },
  header: {
    zIndex: 100,
    backgroundColor: '#FFF',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isWeb ? 'pointer' : 'auto',
  },
  scrollContent: {
    paddingTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  changeText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressDetails: {
    flex: 1,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 6,
  },
  addressPhone: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  rowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#EBF0FF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    position: 'relative',
    cursor: isWeb ? 'pointer' : 'auto',
  },
  selectCardActive: {
    borderColor: '#667eea',
    backgroundColor: '#F5F7FF',
  },
  activeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  slotIcon: {
    marginBottom: 8,
  },
  selectCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  activeText: {
    color: '#667eea',
  },
  selectCardSub: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  paymentCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  paymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBF0FF',
    marginLeft: 70, // Align with text
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EBF0FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 20,
  },
  webBottomBar: {
    position: 'relative',
    borderTopWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
    paddingBottom: 20,
  },
  bottomContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeOrderBtn: {
    width: 180,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  placeOrderGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutPage;