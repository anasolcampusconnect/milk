import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import BottomTab from '../components/BottomTab';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ordersData = [
  {
    id: 'ORD-8291',
    date: '15 May 2026, 06:30 AM',
    status: 'Delivered',
    total: 120,
    items: [
      { id: 1, name: 'Fresh Cow Milk', quantity: 2, price: 60, image: require('../assets/images/cow_milk.png') }
    ],
    paymentMethod: 'UPI',
    deliveredAt: '15 May 2026, 07:15 AM'
  },
  {
    id: 'ORD-7542',
    date: '14 May 2026, 06:15 AM',
    status: 'Processing',
    total: 245,
    items: [
      { id: 4, name: 'Fresh Paneer', quantity: 1, price: 120, image: require('../assets/images/paneer.png') },
      { id: 2, name: 'Buffalo Milk', quantity: 1, price: 75, image: require('../assets/images/buffalo_milk.png') },
      { id: 1, name: 'Fresh Cow Milk', quantity: 1, price: 50, image: require('../assets/images/cow_milk.png') }
    ],
    paymentMethod: 'Cash on Delivery',
    note: 'Out for delivery'
  },
  {
    id: 'ORD-6210',
    date: '12 May 2026, 05:45 PM',
    status: 'Cancelled',
    total: 350,
    items: [
      { id: 5, name: 'Pure Ghee', quantity: 1, price: 350, image: require('../assets/images/ghee.png') }
    ],
    paymentMethod: 'Credit Card',
    cancelReason: 'Address change'
  },
  {
    id: 'ORD-5843',
    date: '10 May 2026, 07:00 AM',
    status: 'Delivered',
    total: 180,
    items: [
      { id: 1, name: 'Fresh Cow Milk', quantity: 3, price: 60, image: require('../assets/images/cow_milk.png') }
    ],
    paymentMethod: 'UPI',
    deliveredAt: '10 May 2026, 07:45 AM'
  },
];

const OrderHistoryPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');

  const filteredOrders = activeTab === 'All' 
    ? ordersData 
    : ordersData.filter(order => order.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#48bb78';
      case 'Processing': return '#667eea';
      case 'Cancelled': return '#f56565';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle';
      case 'Processing': return 'time';
      case 'Cancelled': return 'close-circle';
      default: return 'help-circle';
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
            <Text style={styles.headerTitle}>Order History</Text>
            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="search-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isWeb && styles.webWidthLimit]}
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="cart" size={24} color="#FFF" opacity={0.6} />
              <Text style={styles.summaryLabel}>Total Orders</Text>
            </View>
            <Text style={styles.summaryValue}>{ordersData.length}</Text>
            <View style={styles.summaryTrend}>
              <Ionicons name="trending-up" size={14} color="#48bb78" />
              <Text style={styles.trendText}>+2 this month</Text>
            </View>
          </LinearGradient>
          <View style={styles.summarySideCards}>
            <View style={styles.summaryCardSmall}>
              <Text style={[styles.summaryLabel, { color: '#666' }]}>Total Spent</Text>
              <Text style={[styles.summaryValue, { color: '#333', fontSize: 20 }]}>₹895.00</Text>
            </View>
            <View style={[styles.summaryCardSmall, { backgroundColor: '#F0FFF4' }]}>
              <Text style={[styles.summaryLabel, { color: '#2F855A' }]}>Total Saved</Text>
              <Text style={[styles.summaryValue, { color: '#48bb78', fontSize: 20 }]}>₹145.00</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
          {['All', 'Processing', 'Delivered', 'Cancelled'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order List */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderCard}
              activeOpacity={0.9}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                  <Ionicons name={getStatusIcon(order.status) as any} size={14} color={getStatusColor(order.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.orderBody}>
                <View style={styles.itemsPreview}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <View key={item.id} style={[styles.itemThumb, { marginLeft: idx > 0 ? -15 : 0, zIndex: 10 - idx }]}>
                      <Image source={item.image} style={styles.thumbImage} />
                    </View>
                  ))}
                  {order.items.length > 3 && (
                    <View style={styles.moreItems}>
                      <Text style={styles.moreText}>+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.orderSummary}>
                  <Text style={styles.itemNames} numberOfLines={1}>
                    {order.items.map(i => i.name).join(', ')}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.totalAmount}>₹{order.total.toFixed(2)}</Text>
                    <Text style={styles.itemsCount}>{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</Text>
                  </View>
                </View>
              </View>

              {order.status === 'Processing' && (
                <View style={styles.trackingContainer}>
                  <View style={styles.trackingSteps}>
                    <View style={[styles.trackDot, { backgroundColor: '#667eea' }]} />
                    <View style={[styles.trackLine, { backgroundColor: '#667eea' }]} />
                    <View style={[styles.trackDot, { backgroundColor: '#667eea' }]} />
                    <View style={[styles.trackLine, { backgroundColor: '#E5E7EB' }]} />
                    <View style={[styles.trackDot, { backgroundColor: '#E5E7EB' }]} />
                  </View>
                  <View style={styles.trackingLabels}>
                    <Text style={styles.activeTrackText}>Confirmed</Text>
                    <Text style={styles.activeTrackText}>On the Way</Text>
                    <Text style={styles.inactiveTrackText}>Delivered</Text>
                  </View>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.orderFooter}>
                <View style={styles.paymentInfo}>
                  <Ionicons name="card-outline" size={16} color="#666" />
                  <Text style={styles.paymentText}>{order.paymentMethod}</Text>
                </View>
                <TouchableOpacity style={styles.detailsBtn}>
                  <Text style={styles.detailsBtnText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#667eea" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#E5E7EB" />
            <Text style={styles.emptyTitle}>No Orders Found</Text>
            <Text style={styles.emptySubtitle}>You haven't placed any orders in this category yet.</Text>
            <TouchableOpacity 
              style={styles.shopBtn}
              onPress={() => router.push('/products')}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}

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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  summaryContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  summaryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
  summarySideCards: {
    flex: 3,
    gap: 10,
  },
  summaryCard: {
    flex: 2,
    padding: 20,
    borderRadius: 25,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
    justifyContent: 'center',
  },
  summaryCardSmall: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 15,
    gap: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 15,
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  itemsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  moreItems: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10,
    borderWidth: 2,
    borderColor: '#FFF',
    zIndex: 0,
  },
  moreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  orderSummary: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  trackingContainer: {
    marginTop: 20,
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 15,
  },
  trackingSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  trackDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  trackLine: {
    flex: 1,
    height: 2,
  },
  trackingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  activeTrackText: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: 'bold',
  },
  inactiveTrackText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  shopBtn: {
    marginTop: 30,
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 15,
  },
  shopBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderHistoryPage;
