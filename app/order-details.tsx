import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomTab from '../components/BottomTab';

const { height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  // Mock data for the specific order (usually fetched by ID)
  const order = {
    id: params.id || 'ORD-8291',
    date: '15 May 2026, 06:30 AM',
    status: 'Delivered',
    deliveredAt: '15 May 2026, 07:15 AM',
    items: [
      { id: 1, name: 'Fresh Cow Milk', quantity: 2, price: 60, image: require('../assets/images/cow_milk.png') },
      { id: 4, name: 'Fresh Paneer', quantity: 1, price: 120, image: require('../assets/images/paneer.png') }
    ],
    deliveryAddress: {
      name: 'John Doe',
      house: 'Apartment 4B, Skyview Towers',
      area: 'Hitech City, Hyderabad',
      pincode: '500081',
      phone: '+91 98765 43210'
    },
    payment: {
      method: 'UPI (PhonePe)',
      subtotal: 240.00,
      deliveryFee: 20.00,
      tax: 12.00,
      discount: 30.00,
      total: 242.00
    },
    tracking: [
      { status: 'Order Placed', time: '06:30 AM', done: true },
      { status: 'Order Confirmed', time: '06:35 AM', done: true },
      { status: 'Out for Delivery', time: '07:00 AM', done: true },
      { status: 'Delivered', time: '07:15 AM', done: true }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#48bb78';
      case 'Processing': return '#667eea';
      case 'Cancelled': return '#f56565';
      default: return '#999';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={[styles.headerGradient, { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) }]}>
          <View style={[styles.headerContent, isWeb && styles.webHeaderLimit]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Order Details</Text>
              <Text style={styles.orderIdText}>{order.id}</Text>
            </View>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="help-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isWeb && styles.webWidthLimit]}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(order.status) + '10' }]}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(order.status) }]} />
          <View>
            <Text style={[styles.statusTitle, { color: getStatusColor(order.status) }]}>Order {order.status}</Text>
            <Text style={styles.statusSubtitle}>{order.deliveredAt ? `On ${order.deliveredAt}` : 'In progress'}</Text>
          </View>
        </View>

        {/* Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Tracking</Text>
          <View style={styles.trackingContainer}>
            {order.tracking.map((step, index) => (
              <View key={index} style={styles.trackingStep}>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepDot, step.done && { backgroundColor: '#667eea' }]} />
                  {index < order.tracking.length - 1 && (
                    <View style={[styles.stepLine, order.tracking[index + 1].done && { backgroundColor: '#667eea' }]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitleText, step.done && styles.activeStepText]}>{step.status}</Text>
                  <Text style={styles.stepTimeText}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Ionicons name="location" size={20} color="#667eea" />
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressName}>{order.deliveryAddress.name}</Text>
            <Text style={styles.addressText}>{order.deliveryAddress.house}</Text>
            <Text style={styles.addressText}>{order.deliveryAddress.area}</Text>
            <Text style={styles.addressText}>{order.deliveryAddress.pincode}</Text>
            <Text style={styles.phoneText}>Phone: {order.deliveryAddress.phone}</Text>
          </View>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <View style={styles.itemsCard}>
            {order.items.map((item, index) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <Image source={item.image} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQty}>{item.quantity} x ₹{item.price}</Text>
                  </View>
                  <Text style={styles.itemTotal}>₹{item.quantity * item.price}</Text>
                </View>
                {index < order.items.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subtotal</Text>
              <Text style={styles.paymentValue}>₹{order.payment.subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Delivery Fee</Text>
              <Text style={styles.paymentValue}>₹{order.payment.deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tax</Text>
              <Text style={styles.paymentValue}>₹{order.payment.tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.paymentRow, { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 15, marginTop: 5 }]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{order.payment.total.toFixed(2)}</Text>
            </View>
            <View style={styles.paymentMethodRow}>
              <Ionicons name="card-outline" size={20} color="#666" />
              <Text style={styles.methodText}>Paid via {order.payment.method}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.reorderBtn}>
            <Ionicons name="refresh-outline" size={20} color="#FFF" />
            <Text style={styles.reorderText}>Reorder Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.invoiceBtn}>
            <Ionicons name="download-outline" size={20} color="#667eea" />
            <Text style={styles.invoiceText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: isWeb ? 40 : 20,
  },
  webHeaderLimit: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  webWidthLimit: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderIdText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: isWeb ? 100 : 120,
    paddingHorizontal: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    gap: 15,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  trackingContainer: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  trackingStep: {
    flexDirection: 'row',
    height: 60,
  },
  stepIndicator: {
    alignItems: 'center',
    width: 20,
    marginRight: 15,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  stepContent: {
    flex: 1,
  },
  stepTitleText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  activeStepText: {
    color: '#333',
  },
  stepTimeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  addressCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  phoneText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginTop: 10,
  },
  itemsCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemQty: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },
  paymentCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#667eea',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  methodText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 15,
    marginTop: 10,
  },
  reorderBtn: {
    flexDirection: 'row',
    backgroundColor: '#667eea',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  reorderText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  invoiceBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    cursor: isWeb ? 'pointer' : 'auto',
  },
  invoiceText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderDetailsPage;
