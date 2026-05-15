import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  Image,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomTab from '../components/BottomTab';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Mock initial cart data for demonstration
const initialCartItems = [
  { id: 1, name: 'Fresh Cow Milk', description: 'Pure & fresh cow milk', price: 60, unit: 'Liter', quantity: 2, image: require('../assets/images/cow_milk.png'), badge: 'Popular' },
  { id: 3, name: 'Organic Curd', description: 'Homestyle probiotic curd', price: 45, unit: '500gm', quantity: 1, image: require('../assets/images/curd.png'), badge: 'Organic' },
  { id: 4, name: 'Fresh Paneer', description: 'Soft & fresh cottage cheese', price: 120, unit: '500gm', quantity: 1, image: require('../assets/images/paneer.png'), badge: 'Fresh' },
];

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  // Cart Logic
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const itemTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal > 200 || itemTotal === 0 ? 0 : 30;
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + taxes;
  const savings = cartItems.reduce((sum, item) => sum + (item.price * 0.1 * item.quantity), 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />


      <View style={styles.header}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={[styles.headerGradient, { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) }]}>
          <View style={[styles.headerContent, isWeb && styles.webHeaderLimit]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
            <TouchableOpacity
              style={styles.iconCircle}
              activeOpacity={0.7}
              onPress={() => cartItems.length > 0 && setCartItems([])}
            >
              <Ionicons name="trash-outline" size={22} color={cartItems.length > 0 ? "#E91E63" : "#CCC"} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        <View style={[styles.contentWrapper, isWeb && styles.webWidthLimit]}>


          {cartItems.length > 0 ? (
            <>

              {savings > 0 ? (
                <LinearGradient
                  colors={['#F5F7FF', '#EDF2FF']}
                  style={styles.savingsBanner}
                >
                  <Ionicons name="wallet-outline" size={20} color="#667eea" />
                  <Text style={styles.savingsText}>
                    You're saving ₹{Math.round(savings)} on this order!
                  </Text>
                </LinearGradient>
              ) : null}

              <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>Your Items ({cartItems.length})</Text>
                {cartItems.map((item, index) => (
                  <Animated.View
                    key={item.id}
                    style={[styles.cartItemCard]}
                  >

                    <View style={styles.itemImageContainer}>
                      <Image source={item.image} style={{ width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 16 }} />
                    </View>


                    <View style={styles.itemDetails}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                        {item.badge ? (
                          <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.itemBadge}
                          >
                            <Text style={styles.itemBadgeText}>{item.badge}</Text>
                          </LinearGradient>
                        ) : null}
                      </View>
                      <Text style={styles.itemUnit}>{item.unit}</Text>
                      <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                    </View>


                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        style={styles.removeBtn}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={18} color="#E91E63" />
                      </TouchableOpacity>

                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, -1)}
                          style={styles.qtyBtn}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="remove" size={14} color="#667eea" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => updateQuantity(item.id, 1)}
                          style={styles.qtyBtn}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="add" size={14} color="#667eea" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>


              <View style={styles.billSection}>
                <Text style={styles.sectionTitle}>Bill Summary</Text>

                <View style={styles.billCard}>
                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Item Total</Text>
                    <Text style={styles.billValue}>₹{itemTotal}</Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    {deliveryFee !== 0 ? (
                      <Text style={styles.billValue}>₹{deliveryFee}</Text>
                    ) : (
                      <Text style={[styles.billValue, { color: '#4CAF50' }]}>FREE</Text>
                    )}
                  </View>

                  {deliveryFee !== 0 ? (
                    <View style={styles.offerNoteContainer}>
                      <Ionicons name="information-circle-outline" size={12} color="#667eea" />
                      <Text style={styles.offerNote}>
                        Add ₹{201 - itemTotal} more for FREE delivery
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Taxes and Charges (5%)</Text>
                    <Text style={styles.billValue}>₹{taxes}</Text>
                  </View>

                  {savings > 0 ? (
                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>Total Savings</Text>
                      <Text style={styles.savingsValue}>-₹{Math.round(savings)}</Text>
                    </View>
                  ) : null}

                  <View style={styles.divider} />

                  <View style={styles.billRowTotal}>
                    <Text style={styles.billTotalLabel}>To Pay</Text>
                    <Text style={styles.billTotalValue}>₹{grandTotal}</Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyCart}>
              <LinearGradient
                colors={['#F5F7FF', '#EBF0FF']}
                style={styles.emptyCartIcon}
              >
                <Ionicons name="cart-outline" size={60} color="#667eea" />
              </LinearGradient>
              <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
              <Text style={styles.emptyCartDesc}>
                Looks like you haven't added any dairy products to your cart yet.
              </Text>
              <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={() => router.push('/products')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.shopNowBtnGradient}
                >
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                  <Text style={styles.shopNowBtnText}>Start Shopping</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}


          <View style={{ height: 85 + insets.bottom }} />
        </View>
      </ScrollView>


      {cartItems.length > 0 ? (
        <View
          style={[
            styles.checkoutBar,
            { paddingBottom: Math.max(insets.bottom, 15) },
          ]}
        >
          <View style={[styles.checkoutContent, isWeb && styles.webWidthLimit]}>
            <View style={styles.checkoutInfo}>
              <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
              <Text style={styles.checkoutTotalValue}>₹{grandTotal}</Text>
              <View style={styles.checkoutDetailRow}>
                <Ionicons name="receipt-outline" size={12} color="#667eea" />
                <Text style={styles.checkoutItemsCount}>
                  {cartItems.length} items • ₹{deliveryFee} delivery
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.8}
            onPress={() => router.push('/checkout')}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.checkoutBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.checkoutBtnText}>Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}


      {!isWeb && cartItems.length === 0 ? <BottomTab /> : null}
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
    paddingHorizontal: isWeb ? 40 : 20,
  },
  webHeaderLimit: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#667eea',
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
    paddingTop: 15,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
  },
  itemsSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  itemBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  itemUnit: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  removeBtn: {
    padding: 6,
    marginBottom: 8,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#FFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyCartIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  emptyCartDesc: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 280,
    lineHeight: 20,
  },
  shopNowBtn: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  shopNowBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 14,
    gap: 10,
  },
  shopNowBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  billSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  billCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billLabel: {
    fontSize: 14,
    color: '#666',
  },
  billValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  freeText: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  savingsValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  offerNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    marginTop: -8,
  },
  offerNote: {
    fontSize: 11,
    color: '#667eea',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBF0FF',
    marginVertical: 12,
  },
  billRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  billTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  billTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  checkoutBar: {
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
  checkoutContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  checkoutInfo: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  checkoutTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  checkoutDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  checkoutItemsCount: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '500',
  },
  checkoutBtn: {
    width: 160,
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
  checkoutBtnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartPage;