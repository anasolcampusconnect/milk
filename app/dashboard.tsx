import React, { useEffect, useRef, useState, useCallback, ComponentProps } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TextInput,
  FlatList,
  Platform,
  Alert,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomTab from '../components/BottomTab';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
// Helper to detect web environment
const isWeb = Platform.OS === 'web';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

const HomePage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDropdown, setShowDropdown] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data fetch
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  // Header is always visible (persistent navbar)

  const categories: { id: string; name: string; icon: IoniconsName; color: string }[] = [
    { id: 'all', name: 'All', icon: 'grid-outline', color: '#667eea' },
    { id: 'milk', name: 'Fresh Milk', icon: 'water-outline', color: '#48bb78' },
    { id: 'curd', name: 'Curd', icon: 'nutrition-outline', color: '#ed8936' },
    { id: 'paneer', name: 'Paneer', icon: 'restaurant-outline', color: '#f56565' },
    { id: 'ghee', name: 'Ghee', icon: 'flame-outline', color: '#ecc94b' },
    { id: 'butter', name: 'Butter', icon: 'cube-outline', color: '#9f7aea' },
  ];

  const products = [
    { id: 1, name: 'Fresh Cow Milk', description: 'Pure & fresh cow milk, rich in calcium', price: 60, unit: 'Liter', originalPrice: 70, image: require('../assets/images/cow_milk.png'), category: 'milk', rating: 4.8, reviews: 234, badge: 'Popular', type: 'Cow Milk' },
    { id: 2, name: 'Buffalo Milk', description: 'Creamy & thick buffalo milk', price: 75, unit: 'Liter', originalPrice: 85, image: require('../assets/images/buffalo_milk.png'), category: 'milk', rating: 4.7, reviews: 189, badge: 'Best Seller', type: 'Buffalo Milk' },
    { id: 3, name: 'Organic Curd', description: 'Homestyle probiotic curd', price: 45, unit: '500gm', originalPrice: 55, image: require('../assets/images/curd.png'), category: 'curd', rating: 4.9, reviews: 456, badge: 'Organic', type: 'Curd' },
    { id: 4, name: 'Fresh Paneer', description: 'Soft & fresh cottage cheese', price: 120, unit: '500gm', originalPrice: 140, image: require('../assets/images/paneer.png'), category: 'paneer', rating: 4.8, reviews: 321, badge: 'Fresh', type: 'Paneer' },
    { id: 5, name: 'Pure Ghee', description: 'Traditional bilona ghee', price: 350, unit: '1Ltr', originalPrice: 400, image: require('../assets/images/ghee.png'), category: 'ghee', rating: 4.9, reviews: 567, badge: 'Pure', type: 'Ghee' },
    { id: 6, name: 'Salted Butter', description: 'Creamy & smooth butter', price: 55, unit: '200gm', originalPrice: 65, image: require('../assets/images/butter.png'), category: 'butter', rating: 4.6, reviews: 178, badge: 'New', type: 'Butter' },
    { id: 7, name: 'Flavored Milk - Chocolate', description: 'Healthy chocolate milk for kids', price: 40, unit: '200ml', originalPrice: 50, image: require('../assets/images/chocolate_milk.png'), category: 'milk', rating: 4.7, reviews: 234, badge: 'Kids Special', type: 'Flavored Milk' },
    { id: 8, name: 'Low Fat Milk', description: 'Skimmed milk for healthy lifestyle', price: 55, unit: 'Liter', originalPrice: 65, image: require('../assets/images/low_fat_milk.png'), category: 'milk', rating: 4.5, reviews: 145, badge: 'Health', type: 'Low Fat' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const offers = [
    { id: 1, title: 'First Order', discount: '20% OFF', description: 'on your first purchase', code: 'WELCOME20', color: '#667eea', bgColor: 'rgba(102,126,234,0.1)' },
    { id: 2, title: 'Subscribe & Save', discount: '15% OFF', description: 'on weekly subscription', code: 'SUBSCRIBE15', color: '#48bb78', bgColor: 'rgba(72,187,120,0.1)' },
    { id: 3, title: 'Refer a Friend', discount: '₹100 OFF', description: 'on your next order', code: 'REFER100', color: '#ed8936', bgColor: 'rgba(237,137,54,0.1)' },
  ];

  const testimonials = [
    { id: 1, name: 'Ramesh Kumar', rating: 5, text: 'Best quality milk delivered fresh every morning. My family loves it!', location: 'Hyderabad', image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Sneha Reddy', rating: 5, text: 'Great service and on-time delivery. The paneer is so soft and fresh.', location: 'Bangalore', image: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Amit Sharma', rating: 4, text: 'Love the subscription feature. Never miss my daily milk delivery.', location: 'Delhi', image: 'https://via.placeholder.com/50' },
  ];

  const trustBadges: { id: number; name: string; icon: IoniconsName; color: string }[] = [
    { id: 1, name: 'FSSAI Certified', icon: 'shield-checkmark-outline', color: '#48bb78' },
    { id: 2, name: '100% Pure', icon: 'leaf-outline', color: '#48bb78' },
    { id: 3, name: '24hr Delivery', icon: 'time-outline', color: '#667eea' },
    { id: 4, name: 'Cash on Delivery', icon: 'cash-outline', color: '#ed8936' },
  ];

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.productCard, isWeb && styles.webProductCard]}
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/product-details', params: { id: item.id } })}
    >
      <View style={[styles.productImageContainer, isWeb && styles.webProductImageContainer]}>
        <Image source={item.image} style={styles.productImagePlaceholder} resizeMode="cover" />
        {item.badge ? (
          <View style={[styles.productBadge, { backgroundColor: '#667eea' }]}>
            <Text style={styles.productBadgeText}>{item.badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.productInfo}>
        <View style={styles.productHeaderRow}>
          <Text style={styles.productType}>{item.type}</Text>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        </View>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={isWeb ? 1 : 2}>{item.description}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#fbbf24" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceSubRow}>
            <Text style={styles.productPrice}>₹{item.price}</Text>
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          </View>
          <Text style={styles.unitText}>/{item.unit}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={[styles.headerGradient, { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) }]}>
          <View style={[styles.headerContent, isWeb && styles.webHeaderLimit]}>
            <View style={{ position: 'relative', zIndex: 100 }}>
              <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                <Ionicons name="menu-outline" size={28} color="#333" />
              </TouchableOpacity>

              {showDropdown ? (
                <View style={styles.dropdownMenu}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowDropdown(false); /* handle profile */ }}>
                    <Ionicons name="person-outline" size={20} color="#333" />
                    <Text style={styles.dropdownText}>My Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowDropdown(false); /* handle address */ }}>
                    <Ionicons name="location-outline" size={20} color="#333" />
                    <Text style={styles.dropdownText}>Delivery Address</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowDropdown(false); router.push('/order-history'); }}>
                    <Ionicons name="receipt-outline" size={20} color="#333" />
                    <Text style={styles.dropdownText}>Order History</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <Text style={styles.headerTitle}>DoodhWala</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={26} color="#E91E63" />
              </TouchableOpacity>
              
            </View>
          </View>
        </LinearGradient>

      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']} // Android
            tintColor="#667eea" // iOS
            progressViewOffset={80} // Offset because of custom header
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>

          <ImageBackground
            source={require('../assets/images/hero_bg_modern.png')}
            style={[styles.heroSection, isWeb && styles.webHero]}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={[styles.heroContent, isWeb && styles.webHeroContent, { zIndex: 1 }]}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={[styles.heroTitle, isWeb && styles.webHeroTitle]}>Fresh Milk Delivered</Text>
                <Text style={[styles.heroSubtitle, isWeb && styles.webHeroSubtitle]}>Directly from farm to your doorstep</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="time" size={isWeb ? 24 : 16} color="#FFF" />
                  <Text style={[styles.deliveryText, isWeb && { fontSize: 20 }]}>Morning 6-8 AM • Evening 5-7 PM</Text>
                </View>
                <TouchableOpacity style={[styles.orderButton, isWeb && styles.webOrderButton]}>
                  <Text style={[styles.orderButtonText, { color: '#333' }, isWeb && { fontSize: 18 }]}>Order Now</Text>
                  <Ionicons name="arrow-forward" size={isWeb ? 22 : 18} color="#333" />
                </TouchableOpacity>
              </View>

            </View>

            <View style={[styles.heroStats, isWeb && styles.webHeroStats, { zIndex: 1 }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, isWeb && { fontSize: 24 }]}>10K+</Text>
                <Text style={[styles.statLabel, isWeb && { fontSize: 14 }]}>Happy Families</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, isWeb && { fontSize: 24 }]}>5000L+</Text>
                <Text style={[styles.statLabel, isWeb && { fontSize: 14 }]}>Daily Delivery</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, isWeb && { fontSize: 24 }]}>4.9★</Text>
                <Text style={[styles.statLabel, isWeb && { fontSize: 14 }]}>Customer Rating</Text>
              </View>
            </View>
          </ImageBackground>


          <View style={[isWeb && styles.webWidthLimit, isWeb && { alignSelf: 'center', width: '100%' }]}>


            <View style={[styles.searchContainer, isWeb && styles.webSearchContainer]}>
              <Ionicons name="search-outline" size={isWeb ? 24 : 20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={[styles.searchInput, isWeb && { fontSize: 16 }]}
                placeholder="Search for milk, curd, paneer..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.filterButton}>
                <Ionicons name="options-outline" size={isWeb ? 24 : 20} color="#667eea" />
              </TouchableOpacity>
            </View>



          <View style={[styles.section, isWeb && styles.webWidthLimit]}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            {isWeb ? (
              <View style={styles.webCategoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.webCategoryCard}
                    onPress={() => {
                      router.push({
                        pathname: '/products',
                        params: { category: category.id }
                      });
                    }}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15`, width: 70, height: 70, borderRadius: 35 }]}>
                      <Ionicons name={category.icon} size={32} color={category.color} />
                    </View>
                    <Text style={[styles.categoryName, { fontSize: 14, fontWeight: '500' }]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    onPress={() => {
                      router.push({
                        pathname: '/products',
                        params: { category: category.id }
                      });
                    }}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                      <Ionicons name={category.icon} size={24} color={category.color} />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>


            <View style={[styles.offersSection, isWeb && styles.webWidthLimit]}>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              {isWeb ? (
                <View style={styles.webOffersGrid}>
                  {offers.map((offer) => (
                    <LinearGradient
                      key={offer.id}
                      colors={['#FFFFFF', '#F8F9FA']}
                      style={styles.webOfferCard}
                    >
                      <View style={styles.offerContent}>
                        <Text style={[styles.offerDiscount, { color: offer.color }]}>{offer.discount}</Text>
                        <Text style={[styles.offerTitle, { fontSize: 18 }]}>{offer.title}</Text>
                        <Text style={[styles.offerDescription, { fontSize: 14 }]}>{offer.description}</Text>
                        <View style={styles.offerCodeContainer}>
                          <Text style={styles.offerCode}>{offer.code}</Text>
                          <TouchableOpacity>
                            <Ionicons name="copy-outline" size={18} color={offer.color} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  ))}
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll}>
                  {offers.map((offer) => (
                    <LinearGradient
                      key={offer.id}
                      colors={['rgba(102,126,234,0.1)', 'rgba(118,75,162,0.05)']}
                      style={[styles.offerCard, isWeb && { width: 350 }]}
                    >
                      <View style={styles.offerContent}>
                        <Text style={[styles.offerDiscount, { color: offer.color }]}>{offer.discount}</Text>
                        <Text style={styles.offerTitle}>{offer.title}</Text>
                        <Text style={styles.offerDescription}>{offer.description}</Text>
                        <View style={styles.offerCodeContainer}>
                          <Text style={styles.offerCode}>{offer.code}</Text>
                          <TouchableOpacity>
                            <Ionicons name="copy-outline" size={18} color={offer.color} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  ))}
                </ScrollView>
              )}
            </View>


            <View style={styles.productsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Products</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={filteredProducts.slice(0, isWeb ? 8 : 4)}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                numColumns={isWeb ? 4 : 1}
                key={isWeb ? 'h-grid' : 'v-list'}
                columnWrapperStyle={isWeb ? { justifyContent: 'flex-start', gap: 20 } : null}
              />
            </View>


            <View style={[styles.howItWorksSection, isWeb && { borderRadius: 30 }]}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              <View style={styles.stepsContainer}>

                <View style={styles.step}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.stepIcon}>
                    <Ionicons name="cart-outline" size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.stepTitle}>1. Choose Product</Text>
                  <Text style={styles.stepDesc}>Select from variety of dairy products</Text>
                </View>
                <View style={styles.step}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.stepIcon}>
                    <Ionicons name="calendar-outline" size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.stepTitle}>2. Schedule Delivery</Text>
                  <Text style={styles.stepDesc}>Pick daily or subscription plan</Text>
                </View>
                <View style={styles.step}>
                  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.stepIcon}>
                    <Ionicons name="home-outline" size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={styles.stepTitle}>3. Get Delivered</Text>
                  <Text style={styles.stepDesc}>Fresh at your doorstep every morning</Text>
                </View>
              </View>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trustSection}>
              {trustBadges.map((badge) => (
                <View key={badge.id} style={[styles.trustCard, isWeb && { minWidth: 200 }]}>
                  <Ionicons name={badge.icon} size={32} color={badge.color} />
                  <Text style={styles.trustText}>{badge.name}</Text>
                </View>
              ))}
            </ScrollView>


            <View style={styles.testimonialsSection}>
              <Text style={styles.sectionTitle}>What Our Customers Say</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {testimonials.map((testimonial) => (
                  <View key={testimonial.id} style={[styles.testimonialCard, isWeb && { width: 400 }]}>
                    <View style={styles.testimonialHeader}>
                      <View style={styles.testimonialAvatar}>
                        <Ionicons name="person" size={24} color="#667eea" />
                      </View>
                      <View>
                        <Text style={styles.testimonialName}>{testimonial.name}</Text>
                        <View style={styles.testimonialRating}>
                          {[...Array(5)].map((_, i) => (
                            <Ionicons
                              key={i}
                              name={i < testimonial.rating ? "star" : "star-outline"}
                              size={14}
                              color="#fbbf24"
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <Text style={styles.testimonialText}>"{testimonial.text}"</Text>
                    <Text style={styles.testimonialLocation}>{testimonial.location}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>


            <LinearGradient
              colors={['#48bb78', '#38a169']}
              style={[styles.subscriptionBanner, isWeb && { borderRadius: 30 }]}
            >
              <View style={styles.subscriptionContent}>
                <Text style={styles.subscriptionTitle}>Subscribe and Save 15%</Text>
                <Text style={styles.subscriptionDesc}>Get daily milk delivery without any hassle</Text>
                <TouchableOpacity style={styles.subscriptionButton}>
                  <Text style={styles.subscriptionButtonText}>View Plans</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
              <Ionicons name="water" size={isWeb ? 150 : 80} color="rgba(255,255,255,0.2)" style={styles.subscriptionIcon} />
            </LinearGradient>
            <View style={{ height: 100 }} />
          </View>
        </View>
      </Animated.ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Web specific constraints
  webWidthLimit: {
    maxWidth: 1100, // Reduced to create more "clean" empty space on sides
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginTop: isWeb ? 60 : 30, // Adjust spacing for web vs mobile
    paddingHorizontal: isWeb ? 0 : 20
  },
  catScroll: {
    paddingBottom: 10,
    paddingHorizontal: isWeb ? 0 : 15 // Keeps consistent margins for web and mobile
  },
  webHero: {
    paddingVertical: 80,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  webHeroTitle: {
    fontSize: 56,
  },
  webProductCard: {
    flex: 1,
    flexDirection: 'column', // Cards look better vertically in a grid
    minWidth: 200,
    marginHorizontal: 0,
    padding: 0,
    overflow: 'hidden',
  },
  webProductImageContainer: {
    width: '100%',
    height: 220,
    marginRight: 0,
  },
  webHeroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  webHeroSubtitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 25,
  },
  webOrderButton: {
    paddingHorizontal: 40,
    paddingVertical: 18,
  },
  webSearchContainer: {
    width: 800,
    alignSelf: 'center',
    marginTop: -30,
    height: 70,
    borderRadius: 35,
    paddingHorizontal: 25,
  },
  webHeroStats: {
    width: '80%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 25,
    borderRadius: 25,
    marginTop: 20,
  },
  webCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    gap: 20,
  },
  webCategoryCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    width: '15%',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    cursor: 'pointer',
  },
  webOffersGrid: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  webOfferCard: {
    flex: 1,
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : (isWeb ? 20 : 40),
    paddingBottom: 10,
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
    maxWidth: 1100, // Reverted to match main content width for more distance
    alignSelf: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: isWeb ? 28 : 22,
    fontWeight: 'bold',
    color: '#667eea',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  logoutBtn: {
    padding: 4,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 35,
    left: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 8,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 100 : (isWeb ? 80 : 90),
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 15,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  deliveryText: {
    color: '#FFF',
    fontSize: 14,
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  orderButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -20,
    paddingHorizontal: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    padding: 10,
  },
  categoriesSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: isWeb ? 32 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: isWeb ? 0 : 20,
    marginBottom: isWeb ? 30 : 15,
  },
  categoriesScroll: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 80,
    cursor: isWeb ? 'pointer' : 'auto',
  },
  categoryCardActive: {
    backgroundColor: '#667eea15',
  },
  categoryIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  offersSection: {
    marginBottom: 20,
  },
  offersScroll: {
    paddingHorizontal: 15,
  },
  offerCard: {
    width: 220,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.2)',
  },
  offerContent: {
    gap: 8,
  },
  offerDiscount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  offerDescription: {
    fontSize: 12,
    color: '#666',
  },
  offerCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(102,126,234,0.1)',
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
  },
  offerCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
  },
  productsSection: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 15,
  },
  viewAllText: {
    color: '#667eea',
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    marginBottom: 15,
    padding: 12,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImageContainer: {
    position: 'relative',
    marginRight: isWeb ? 0 : 12,
  },
  productImagePlaceholder: {
    width: isWeb ? '100%' : 90,
    height: isWeb ? 150 : 90,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  productBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    flex: 1,
    padding: isWeb ? 15 : 0,
    marginLeft: isWeb ? 0 : 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  reviewText: {
    fontSize: 11,
    color: '#999',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productType: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  stockBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 8,
    color: '#166534',
    fontWeight: 'bold',
  },
  priceSubRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: 13,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: isWeb ? 'flex-end' : 'center',
    margin: isWeb ? 10 : 0,
  },
  howItWorksSection: {
    paddingVertical: 30,
    backgroundColor: '#FFF',
    marginVertical: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  stepDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  trustSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  trustCard: {
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 100,
  },
  trustText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  testimonialsSection: {
    marginBottom: 30,
  },
  testimonialCard: {
    width: 280,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  testimonialLocation: {
    fontSize: 12,
    color: '#999',
  },
  subscriptionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  subscriptionContent: {
    flex: 1,
    zIndex: 2,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 6,
  },
  subscriptionDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15,
  },
  subscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    gap: 8,
  },
  subscriptionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscriptionIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
});

export default HomePage;