import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// Simulated database
const allProducts = [
  { id: 1, name: 'Fresh Cow Milk', description: 'Pure & fresh cow milk, rich in calcium. Sourced from local farms ensuring the highest quality and freshness. Perfect for your daily nutritional needs.', price: 60, unit: 'Liter', originalPrice: 70, image: require('../assets/images/cow_milk.png'), category: 'milk', badge: 'Popular', rating: 4.8, reviews: 234 },
  { id: 2, name: 'Buffalo Milk', description: 'Creamy & thick buffalo milk. Ideal for making thick curds, ghee, and sweets. Rich in protein and minerals.', price: 75, unit: 'Liter', originalPrice: 85, image: require('../assets/images/buffalo_milk.png'), category: 'milk', badge: 'Best Seller', rating: 4.7, reviews: 189 },
  { id: 3, name: 'Organic Curd', description: 'Homestyle probiotic curd, set naturally without any artificial thickeners. Great for digestion and a healthy gut.', price: 45, unit: '500gm', originalPrice: 55, image: require('../assets/images/curd.png'), category: 'curd', badge: 'Organic', rating: 4.9, reviews: 456 },
  { id: 4, name: 'Fresh Paneer', description: 'Soft & fresh cottage cheese made from pure milk. Rich in protein, perfect for curries and snacks.', price: 120, unit: '500gm', originalPrice: 140, image: require('../assets/images/paneer.png'), category: 'paneer', badge: 'Fresh', rating: 4.8, reviews: 321 },
  { id: 5, name: 'Pure Ghee', description: 'Traditional bilona ghee made using the ancient Vedic process. Enhances the flavor of your meals and provides healthy fats.', price: 350, unit: '1Ltr', originalPrice: 400, image: require('../assets/images/ghee.png'), category: 'ghee', badge: 'Pure', rating: 4.9, reviews: 567 },
  { id: 6, name: 'Salted Butter', description: 'Creamy & smooth butter, perfectly salted for your morning toasts and baking needs.', price: 55, unit: '200gm', originalPrice: 65, image: require('../assets/images/butter.png'), category: 'butter', badge: 'New', rating: 4.6, reviews: 178 },
  { id: 7, name: 'Flavored Milk - Chocolate', description: 'Healthy chocolate milk for kids, packed with essential nutrients and a delicious taste they will love.', price: 40, unit: '200ml', originalPrice: 50, image: require('../assets/images/chocolate_milk.png'), category: 'milk', badge: 'Kids Special', rating: 4.7, reviews: 234 },
  { id: 8, name: 'Low Fat Milk', description: 'Skimmed milk for a healthy lifestyle. All the goodness of milk with zero fat.', price: 55, unit: 'Liter', originalPrice: 65, image: require('../assets/images/low_fat_milk.png'), category: 'milk', badge: 'Health', rating: 4.5, reviews: 145 },
];

const ProductDetailsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [product, setProduct] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  useEffect(() => {
    if (params.id) {
      const found = allProducts.find(p => p.id.toString() === params.id);
      if (found) setProduct(found);
    }
  }, [params.id]);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    const msg = !isWishlisted ? "Added to Wishlist" : "Removed from Wishlist";
    if (isWeb) {
      window.alert(msg);
    } else {
      Alert.alert("Wishlist", msg);
    }
  };

  const addToCart = () => {
    const msg = `Added ${quantity} x ${product?.name} to Cart!`;
    if (isWeb) {
      window.alert(msg);
    } else {
      Alert.alert("Success", msg);
    }
  };

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isWeb ? styles.webScrollContent : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
      >
        <View style={isWeb ? styles.webContainer : styles.mobileContainer}>


          <View style={[styles.imageSection, isWeb && styles.webImageSection]}>
            <Image source={product.image} style={styles.productImage} />


            <View style={[styles.topBar, isWeb && styles.webTopBar]}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleWishlist} style={styles.iconButton}>
                <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={24} color={isWishlisted ? "#e53e3e" : "#333"} />
              </TouchableOpacity>
            </View>


            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.05)', '#F8F9FA']}
              style={styles.imageGradient}
            />
          </View>


          <View style={[styles.detailsSection, isWeb && styles.webDetailsSection]}>
            {product.badge ? (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{product.badge}</Text>
              </View>
            ) : null}

            <View style={styles.titleRow}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.ratingBox}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            </View>

            <Text style={styles.reviewsText}>{product.reviews} customer reviews</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{product.price}</Text>
              {product.originalPrice ? (
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
              ) : null}
              <Text style={styles.unitText}>/ {product.unit}</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>


            <View style={styles.highlightsContainer}>
              <View style={styles.highlightItem}>
                <Ionicons name="leaf-outline" size={24} color="#48bb78" />
                <Text style={styles.highlightText}>100% Pure</Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="time-outline" size={24} color="#667eea" />
                <Text style={styles.highlightText}>Fresh Daily</Text>
              </View>
              <View style={styles.highlightItem}>
                <Ionicons name="shield-checkmark-outline" size={24} color="#ed8936" />
                <Text style={styles.highlightText}>FSSAI Certified</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>


      <View style={[styles.bottomBar, isWeb && styles.webBottomBar]}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={addToCart} activeOpacity={0.8}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.addToCartGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="cart-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.addToCartText}>Add to Cart • ₹{product.price * quantity}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webScrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
    alignItems: 'center',
  },
  mobileContainer: {
    flex: 1,
  },
  webContainer: {
    width: '100%',
    maxWidth: 1000,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  imageSection: {
    width: '100%',
    height: height * 0.45,
    position: 'relative',
  },
  webImageSection: {
    width: '50%',
    height: 600,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  webTopBar: {
    top: 20,
    left: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsSection: {
    padding: 24,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    minHeight: height * 0.5,
  },
  webDetailsSection: {
    width: '50%',
    marginTop: 0,
    borderTopLeftRadius: 0,
    padding: 40,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  badgeContainer: {
    backgroundColor: 'rgba(102,126,234,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 4,
  },
  ratingText: {
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
    gap: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  unitText: {
    fontSize: 16,
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  highlightItem: {
    alignItems: 'center',
    flex: 1,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'center',
    gap: 16,
  },
  webBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: 1000,
    alignSelf: 'center',
    borderRadius: 20,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    padding: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginHorizontal: 16,
  },
  addToCartBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProductDetailsPage;
