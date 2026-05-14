import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const ProductsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'all');
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
  }, [params.category]);

  const categories = [
    { id: 'all', name: 'All Products', icon: 'grid-outline' as const, color: '#667eea' },
    { id: 'milk', name: 'Fresh Milk', icon: 'water-outline' as const, color: '#667eea' },
    { id: 'curd', name: 'Curd', icon: 'nutrition-outline' as const, color: '#667eea' },
    { id: 'paneer', name: 'Paneer', icon: 'restaurant-outline' as const, color: '#667eea' },
    { id: 'ghee', name: 'Ghee', icon: 'flame-outline' as const, color: '#667eea' },
    { id: 'butter', name: 'Butter', icon: 'cube-outline' as const, color: '#667eea' },
  ];

  const products = [
    { id: 1, name: 'Fresh Cow Milk', description: 'Pure & fresh cow milk, rich in calcium', price: 60, unit: 'Liter', category: 'milk', badge: 'Popular', rating: 4.8, reviews: 234 },
    { id: 2, name: 'Buffalo Milk', description: 'Creamy & thick buffalo milk', price: 75, unit: 'Liter', category: 'milk', badge: 'Best Seller', rating: 4.7, reviews: 189 },
    { id: 3, name: 'Organic Curd', description: 'Homestyle probiotic curd', price: 45, unit: '500gm', category: 'curd', badge: 'Organic', rating: 4.9, reviews: 456 },
    { id: 4, name: 'Fresh Paneer', description: 'Soft & fresh cottage cheese', price: 120, unit: '500gm', category: 'paneer', badge: 'Fresh', rating: 4.8, reviews: 321 },
    { id: 5, name: 'Pure Ghee', description: 'Traditional bilona ghee', price: 350, unit: '1Ltr', category: 'ghee', badge: 'Pure', rating: 4.9, reviews: 567 },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (id: number) => {
    setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const renderProductCard = ({ item }: { item: any }) => (
    <View style={[styles.pCard, isWeb && styles.webPCard]}>
      <LinearGradient
        colors={['#F5F7FF', '#EDF2FF']}
        style={styles.imgBox}
      >
        <View style={styles.imageContainer}>
          <Ionicons name="water" size={50} color="#667eea" />
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
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFB300" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.pDesc} numberOfLines={1}>{item.description}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <Ionicons name="people-outline" size={10} color="#999" />
          <Text style={styles.reviewText}>{item.reviews} reviews</Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.pPrice}>₹{item.price}</Text>
            <Text style={styles.pUnit}>/{item.unit}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => addToCart(item.id)} 
            style={styles.addBtn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.addBtnGradient}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={styles.headerGradient}>
          <View style={[styles.headerContent, isWeb && styles.webWidthLimit]}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Our Products</Text>
            <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
              <Ionicons name="cart-outline" size={22} color="#667eea" />
              {Object.keys(cartItems).length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{Object.keys(cartItems).length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Header */}
      <View style={styles.mainHeader}>
        <LinearGradient colors={['#FFF', '#F8F9FA']} style={styles.headerGradient}>
          <View style={[styles.headerContent, isWeb && styles.webWidthLimit]}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#667eea" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Our Products</Text>
            <TouchableOpacity style={styles.iconCircle} activeOpacity={0.7}>
              <Ionicons name="cart-outline" size={22} color="#667eea" />
              {Object.keys(cartItems).length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{Object.keys(cartItems).length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={isWeb && styles.webWidthLimit}>
          {/* Categories Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.catScroll}
            contentContainerStyle={styles.catScrollContent}
          >
            {categories.map(c => (
              <TouchableOpacity 
                key={c.id} 
                style={[
                  styles.catCard, 
                  selectedCategory === c.id && styles.activeCatCard
                ]} 
                onPress={() => setSelectedCategory(c.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={selectedCategory === c.id ? ['#667eea', '#764ba2'] : ['#F5F5F5', '#FAFAFA']}
                  style={styles.catIcon}
                >
                  <Ionicons 
                    name={c.icon} 
                    size={22} 
                    color={selectedCategory === c.id ? '#FFF' : '#667eea'} 
                  />
                </LinearGradient>
                <Text style={[
                  styles.catName, 
                  selectedCategory === c.id && styles.activeCatName
                ]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Search Sub-bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#667eea" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search in this category..." 
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>

          {/* Results Count */}
          <View style={styles.resultCount}>
            <Text style={styles.resultText}>
              {filteredProducts.length} products found
            </Text>
          </View>

          {/* Product Grid */}
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={isWeb ? 4 : 2}
            key={isWeb ? 'grid-4' : 'grid-2'}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            contentContainerStyle={styles.listPadding}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  webWidthLimit: { 
    maxWidth: 1200, 
    width: '100%', 
    alignSelf: 'center' 
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  mainHeader: {
    zIndex: 10,
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
    paddingHorizontal: 20 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  iconCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: 'rgba(102, 126, 234, 0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
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
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
  },
  catScroll: { 
    paddingVertical: 20,
  },
  catScrollContent: {
    paddingHorizontal: 20,
  },
  catCard: { 
    alignItems: 'center', 
    marginRight: 24,
  },
  catIcon: { 
    width: 55, 
    height: 55, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  catName: { 
    fontSize: 12, 
    color: '#777', 
    fontWeight: '500' 
  },
  activeCatCard: { 
    transform: [{ scale: 1.02 }] 
  },
  activeCatName: { 
    color: '#667eea', 
    fontWeight: 'bold' 
  },
  searchBar: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    marginHorizontal: 20, 
    paddingHorizontal: 15, 
    paddingVertical: 4, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#EBF0FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 14, 
    color: '#333',
    paddingVertical: 12,
  },
  filterBtn: {
    padding: 8,
  },
  resultCount: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  listPadding: { 
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  columnWrapper: { 
    justifyContent: 'space-between' 
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
  },
  webPCard: { 
    width: '23%', 
    marginBottom: 20 
  },
  imgBox: { 
    height: 140, 
    alignItems: 'center', 
    justifyContent: 'center', 
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F3FF',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    fontWeight: 'bold' 
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
    gap: 2,
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFB300',
  },
  pDesc: { 
    fontSize: 11, 
    color: '#999', 
    marginTop: 2,
    lineHeight: 14,
  },
  reviewText: {
    fontSize: 9,
    color: '#999',
    marginLeft: 4,
  },
  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8,
  },
  pPrice: { 
    color: '#667eea', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  pUnit: { 
    fontSize: 10, 
    color: '#999', 
    fontWeight: 'normal' 
  },
  addBtn: { 
    width: 36, 
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
});

export default ProductsPage;