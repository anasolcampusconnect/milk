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
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import BottomTab from '../components/BottomTab';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: IoniconsName;
  badge?: string;
  rating: number;
  reviews: number;
}

// Mock initial wishlist data
const initialWishlist: Product[] = [
  { id: 1, name: 'Fresh Cow Milk', description: 'Pure & fresh cow milk', price: 60, unit: 'Liter', image: 'water', badge: 'Popular', rating: 4.8, reviews: 234 },
  { id: 4, name: 'Fresh Paneer', description: 'Soft & fresh cottage cheese', price: 120, unit: '500gm', image: 'restaurant', badge: 'Fresh', rating: 4.8, reviews: 321 },
  { id: 5, name: 'Pure Ghee', description: 'Traditional bilona ghee', price: 350, unit: '1Ltr', image: 'flame', badge: 'Pure', rating: 4.9, reviews: 567 },
];

const WishlistPage = () => {
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<Product[]>(initialWishlist);
  const [cartCount, setCartCount] = useState(2); // Mock cart count

  const removeFromWishlist = (id: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const moveToCart = (item: Product) => {
    // In a real app, you would dispatch this to your global state/context
    setCartCount(prev => prev + 1);
    removeFromWishlist(item.id);
    
    if (isWeb) {
      window.alert(`${item.name} moved to cart!`);
    }
  };

  const renderWishlistCard = ({ item }: { item: Product }) => (
    <View style={[styles.pCard, isWeb && styles.webPCard]}>
      {/* Remove Button (Heart Break) */}
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => removeFromWishlist(item.id)}
        activeOpacity={0.7}
      >
        <Ionicons name="heart-dislike" size={20} color="#E91E63" />
      </TouchableOpacity>

      <LinearGradient
        colors={['#F5F7FF', '#EDF2FF']}
        style={styles.imgBox}
      >
        <View style={styles.imageContainer}>
          <Ionicons name={item.image || "water"} size={40} color="#667eea" />
        </View>
        {item.badge && (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.badge}
          >
            <Text style={styles.badgeText}>{item.badge}</Text>
          </LinearGradient>
        )}
      </LinearGradient>
      
      <View style={styles.pInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.pName} numberOfLines={1}>{item.name}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={12} color="#FFB300" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewText}>({item.reviews})</Text>
        </View>
        
        <Text style={styles.pDesc} numberOfLines={1}>{item.description}</Text>
        
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.pPrice}>₹{item.price}</Text>
            <Text style={styles.pUnit}>/{item.unit}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => moveToCart(item)} 
            style={styles.addBtn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.addBtnGradient}
            >
              <Ionicons name="cart" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Static Header */}
      <View style={styles.header}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={styles.headerGradient}>
          <View style={[styles.headerContent, isWeb && styles.webWidthLimit]}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>My Wishlist</Text>
            
            <TouchableOpacity 
              style={styles.iconCircle} 
              activeOpacity={0.7}
              onPress={() => router.push('/cart')}
            >
              <Ionicons name="cart-outline" size={22} color="#667eea" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, isWeb && styles.webWidthLimit]}>
          
          {wishlistItems.length > 0 ? (
            <View style={styles.itemsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Saved Items ({wishlistItems.length})</Text>
                <TouchableOpacity onPress={() => setWishlistItems([])}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              </View>

              {/* Wishlist Grid */}
              <FlatList
                data={wishlistItems}
                renderItem={renderWishlistCard} 
                keyExtractor={(item) => item.id.toString()}
                numColumns={isWeb ? 4 : 2}
                key={isWeb ? 'grid-4' : 'grid-2'}
                columnWrapperStyle={styles.columnWrapper}
                scrollEnabled={false}
                contentContainerStyle={styles.listPadding}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['#F5F7FF', '#EBF0FF']}
                style={styles.emptyStateIcon}
              >
                <Ionicons name="heart-outline" size={60} color="#667eea" />
              </LinearGradient>
              <Text style={styles.emptyStateTitle}>Your wishlist is empty</Text>
              <Text style={styles.emptyStateDesc}>
                Save your favorite dairy products here to easily find them later.
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
                  <Ionicons name="grid-outline" size={20} color="#FFF" />
                  <Text style={styles.shopNowBtnText}>Browse Products</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Bottom spacing to prevent BottomTab overlap */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Show BottomTab if on mobile */}
      {!isWeb && <BottomTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  webWidthLimit: {
    maxWidth: 1200,
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
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 15,
  },
  itemsSection: {
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearAllText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '600',
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  columnWrapper: {
    justifyContent: isWeb ? 'flex-start' : 'space-between',
    gap: isWeb ? '2.66%' : 0,
  },
  pCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    width: (width / 2) - 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  webPCard: {
    width: '23%',
    marginBottom: 20,
  },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imgBox: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3FF',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pInfo: {
    padding: 12,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFB300',
  },
  reviewText: {
    fontSize: 11,
    color: '#999',
  },
  pDesc: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    lineHeight: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  pPrice: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 18,
  },
  pUnit: {
    fontSize: 10,
    color: '#999',
    fontWeight: 'normal',
  },
  addBtn: {
    width: 40,
    height: 36,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
  },
  emptyStateDesc: {
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
});

export default WishlistPage;