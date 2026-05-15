import BottomTab from "@/components/BottomTab";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const ProductsPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();

  const [selectedCategory, setSelectedCategory] = useState(
    params.category || "all",
  );
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<Record<number, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (params.category) setSelectedCategory(params.category);
  }, [params.category]);

  const categories = [
    {
      id: "all",
      name: "All Products",
      icon: "grid-outline" as const,
      color: "#4CAF50",
    },
    {
      id: "milk",
      name: "Fresh Milk",
      icon: "water-outline" as const,
      color: "#4CAF50",
    },
    {
      id: "curd",
      name: "Curd",
      icon: "nutrition-outline" as const,
      color: "#81C784",
    },
    {
      id: "paneer",
      name: "Paneer",
      icon: "restaurant-outline" as const,
      color: "#C8E6C9",
    },
    {
      id: "ghee",
      name: "Ghee",
      icon: "flame-outline" as const,
      color: "#E1BEE7",
    },
    {
      id: "butter",
      name: "Butter",
      icon: "cube-outline" as const,
      color: "#9C27B0",
    },
  ];

  const products = [
    {
      id: 1,
      name: "Fresh Cow Milk",
      description: "Pure and fresh cow milk, rich in calcium",
      price: 60,
      unit: "Liter",
      image: require("../assets/images/cow_milk.png"),
      category: "milk",
      badge: "Popular",
      rating: 4.8,
      reviews: 234,
    },
    {
      id: 2,
      name: "Buffalo Milk",
      description: "Creamy and thick buffalo milk",
      price: 75,
      unit: "Liter",
      image: require("../assets/images/buffalo_milk.png"),
      category: "milk",
      badge: "Best Seller",
      rating: 4.7,
      reviews: 189,
    },
    {
      id: 3,
      name: "Organic Curd",
      description: "Homestyle probiotic curd",
      price: 45,
      unit: "500gm",
      image: require("../assets/images/curd.png"),
      category: "curd",
      badge: "Organic",
      rating: 4.9,
      reviews: 456,
    },
    {
      id: 4,
      name: "Fresh Paneer",
      description: "Soft and fresh cottage cheese",
      price: 120,
      unit: "500gm",
      image: require("../assets/images/paneer.png"),
      category: "paneer",
      badge: "Fresh",
      rating: 4.8,
      reviews: 321,
    },
    {
      id: 5,
      name: "Pure Ghee",
      description: "Traditional bilona ghee",
      price: 350,
      unit: "1Ltr",
      image: require("../assets/images/ghee.png"),
      category: "ghee",
      badge: "Pure",
      rating: 4.9,
      reviews: 567,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: any) => {
    setCartItems((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));

    if (isWeb) {
      window.alert(`Added to Cart: ${item.name} has been added to your cart.`);
    } else {
      Alert.alert(
        "Added to Cart",
        `${item.name} has been added to your cart.`,
        [{ text: "OK", style: "default" }],
      );
    }
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const isWishlisted = !prev[id];
      const msg = isWishlisted ? "Added to Wishlist" : "Removed from Wishlist";
      if (isWeb) {
        window.alert(msg);
      } else {
        Alert.alert("Wishlist", msg);
      }
      return { ...prev, [id]: isWishlisted };
    });
  };

  const renderProductCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.pCard, isWeb && styles.webPCard]}
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: "/product-details", params: { id: item.id } })
      }
    >
      <View style={styles.imgBox}>
        <Image
          source={item.image}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
        {item.badge ? (
          <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </LinearGradient>
        ) : null}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={(e) => {
            e.stopPropagation();
            toggleWishlist(item.id);
          }}
        >
          <Ionicons
            name={wishlist[item.id] ? "heart" : "heart-outline"}
            size={20}
            color={wishlist[item.id] ? "#e53e3e" : "#667eea"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.pInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.pName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#FFB300" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.pDesc} numberOfLines={1}>
          {item.description}
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          <Ionicons name="people-outline" size={10} color="#999" />
          <Text style={styles.reviewText}>{item.reviews} reviews</Text>
        </View>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.pPrice}>₹{item.price}</Text>
            <Text style={styles.pUnit}>/{item.unit}</Text>
          </View>
          <TouchableOpacity
            onPress={() => addToCart(item)} // Passed the full item to the function
            style={styles.addBtn}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.addBtnGradient}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <Animated.View
        style={[styles.header, { opacity: headerOpacity, zIndex: 1000 }]}
      >
        <LinearGradient
          colors={["#FFF", "#F8F9FA"]}
          style={[
            styles.headerGradient,
            { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) },
          ]}
        >
          <View style={[styles.headerContent, isWeb && styles.webHeaderLimit]}>
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
              {Object.keys(cartItems).length > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {Object.keys(cartItems).length}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      <View style={styles.mainHeader}>
        <LinearGradient
          colors={["#FFF", "#F8F9FA"]}
          style={[
            styles.headerGradient,
            { paddingTop: isWeb ? 20 : Math.max(insets.top, 20) },
          ]}
        >
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
              {Object.keys(cartItems).length > 0 ? (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {Object.keys(cartItems).length}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#667eea"]}
            tintColor="#667eea"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View style={isWeb && styles.webWidthLimit}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
            contentContainerStyle={styles.catScrollContent}
          >
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.catCard,
                  selectedCategory === c.id && styles.activeCatCard,
                ]}
                onPress={() => setSelectedCategory(c.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    selectedCategory === c.id
                      ? ["#667eea", "#764ba2"]
                      : ["#F5F5F5", "#FAFAFA"]
                  }
                  style={styles.catIcon}
                >
                  <Ionicons
                    name={c.icon}
                    size={22}
                    color={selectedCategory === c.id ? "#FFF" : "#667eea"}
                  />
                </LinearGradient>
                <Text
                  style={[
                    styles.catName,
                    selectedCategory === c.id && styles.activeCatName,
                  ]}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#667eea" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search in this category..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons name="options-outline" size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
          <View style={styles.resultCount}>
            <Text style={styles.resultText}>
              {filteredProducts.length} products found
            </Text>
          </View>
          <FlatList
            data={filteredProducts}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.id.toString()}
            numColumns={isWeb ? 4 : 2}
            key={isWeb ? "grid-4" : "grid-2"}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            contentContainerStyle={[
              styles.listPadding,
              { paddingBottom: 85 + insets.bottom },
            ]}
          />
        </View>
      </Animated.ScrollView>
      <BottomTab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  webWidthLimit: {
    maxWidth: 1100, // Matching dashboard for clean side margins
    width: "100%",
    alignSelf: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  mainHeader: {
    zIndex: 10,
    backgroundColor: "#FFF",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EBF0FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: isWeb ? 40 : 10,
  },
  webHeaderLimit: {
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    cursor: isWeb ? "pointer" : "auto",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 0,
    paddingTop: Platform.OS === "ios" ? 10 : 5,
  },
  catScroll: {
    paddingVertical: 20,
  },
  catScrollContent: {
    paddingHorizontal: 10,
  },
  catCard: {
    alignItems: "center",
    marginRight: 24,
    cursor: isWeb ? "pointer" : "auto",
  },
  catIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  catName: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
  },
  activeCatCard: {
    transform: [{ scale: 1.02 }],
  },
  activeCatName: {
    color: "#667eea",
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
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
    color: "#999",
    fontWeight: "500",
  },
  listPadding: {
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  columnWrapper: {
    justifyContent: isWeb ? "flex-start" : "space-between",
    gap: isWeb ? "2.66%" : 0,
  },
  pCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    marginBottom: 16,
    width: width / 2 - 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EBF0FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  webPCard: {
    width: "23%",
    marginBottom: 20,
    cursor: "pointer",
  },
  imgBox: {
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F3FF",
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  wishlistBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pInfo: {
    padding: 15,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "#FFF9C4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFB300",
  },
  pDesc: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
    lineHeight: 14,
  },
  reviewText: {
    fontSize: 9,
    color: "#999",
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  pPrice: {
    color: "#667eea",
    fontWeight: "bold",
    fontSize: 18,
  },
  pUnit: {
    fontSize: 10,
    color: "#999",
    fontWeight: "normal",
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnGradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductsPage;
