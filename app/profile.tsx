import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTab from "../components/BottomTab";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

// Enhanced Mock User Data
const userData = {
  name: "Ramesh Kumar",
  email: "ramesh.kumar@example.com",
  phone: "+91 98765 43210",
  totalOrders: 142,
  totalMilkPurchased: "245 L",
  memberSince: "Jan 2023",
  loyaltyPoints: 1250,
  nextReward: 250,
  defaultAddress:
    "Flat 402, Block B, Green Valley Apartments, Madhapur, Hyderabad, 500081",
  alternateAddresses: [
    "123, Gachibowli, Hyderabad, 500032",
    "456, Financial District, Hyderabad, 500084",
  ],
  paymentMethods: [
    { type: "VISA", last4: "4242", expiry: "12/25" },
    { type: "UPI", id: "ramesh@okhdfcbank" },
  ],
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: "English",
  },
};

// Enhanced Graph Data
const weeklyData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{ data: [1.5, 2, 1.5, 2.5, 2, 3, 2.5] }],
};

const monthlyData = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [{ data: [12, 14, 10, 16] }],
};

const yearlyData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [{ data: [45, 48, 52, 50, 55, 58, 60, 62, 58, 55, 52, 48] }],
};

const achievements = [
  {
    title: "Early Bird",
    description: "100+ morning deliveries",
    progress: 0.85,
    icon: "sunny",
    color: "#FF9800",
  },
  {
    title: "Loyal Customer",
    description: "2+ years active",
    progress: 1,
    icon: "trophy",
    color: "#FFD700",
  },
  {
    title: "Health Enthusiast",
    description: "500L milk purchased",
    progress: 0.49,
    icon: "fitness",
    color: "#4CAF50",
  },
  {
    title: "Referral Star",
    description: "10+ friends referred",
    progress: 0.6,
    icon: "people",
    color: "#9C27B0",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "Order Placed",
    amount: "2L Milk",
    date: "Today",
    time: "10:30 AM",
    status: "delivered",
  },
  {
    id: 2,
    action: "Subscription Renewed",
    amount: "Weekly Plan",
    date: "Yesterday",
    time: "3:15 PM",
    status: "active",
  },
  {
    id: 3,
    action: "Payment Received",
    amount: "₹450",
    date: "Jan 28, 2024",
    time: "9:00 AM",
    status: "completed",
  },
  {
    id: 4,
    action: "Referral Bonus",
    amount: "₹100",
    date: "Jan 25, 2024",
    time: "2:00 PM",
    status: "credited",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();

  const [graphPeriod, setGraphPeriod] = useState<"week" | "month" | "year">(
    "week",
  );
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    userData.preferences.notifications,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "activity" | "achievements"
  >("overview");
  const fadeAnim = useState(new Animated.Value(0))[0];

  const getChartWidth = () => {
    if (isWeb) return Math.min(width - 40, 760);
    return width - 40;
  };

  const getChartData = () => {
    switch (graphPeriod) {
      case "week":
        return weeklyData;
      case "month":
        return monthlyData;
      case "year":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFF",
    backgroundGradientTo: "#FFF",
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#764ba2",
    },
    propsForBackgroundLines: {
      strokeDasharray: "5,5",
      stroke: "#E0E0E0",
    },
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Refreshed", "Your profile has been updated");
    }, 1500);
  }, []);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const addNewAddress = () => {
    if (newAddress.trim()) {
      Alert.alert("Success", "New address added successfully");
      setShowAddressModal(false);
      setNewAddress("");
    }
  };

  const renderStars = (points: number) => {
    const stars = Math.floor(points / 250);
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < stars ? "star" : "star-outline"}
            size={16}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View style={styles.header}>
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
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity
              onPress={logout}
              style={styles.iconCircle}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#E91E63" />
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
            colors={["#667eea"]}
          />
        }
      >
        <Animated.View
          style={[
            styles.contentWrapper,
            isWeb && styles.webWidthLimit,
            { opacity: fadeAnim },
          ]}
        >
          {/* Enhanced Profile Header with Stats */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>{userData.name.charAt(0)}</Text>
              </LinearGradient>
              <TouchableOpacity style={styles.editAvatarBtn}>
                <Ionicons name="camera" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <View style={styles.phoneBadge}>
              <Ionicons name="call" size={12} color="#667eea" />
              <Text style={styles.phoneText}>{userData.phone}</Text>
            </View>
            <View style={styles.memberBadge}>
              <Ionicons name="calendar" size={12} color="#999" />
              <Text style={styles.memberText}>
                Member since {userData.memberSince}
              </Text>
            </View>
          </View>

          {/* Enhanced Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statCard}>
              <LinearGradient
                colors={[
                  "rgba(102, 126, 234, 0.1)",
                  "rgba(102, 126, 234, 0.05)",
                ]}
                style={styles.statGradient}
              >
                <View style={styles.statIconBox}>
                  <Ionicons name="receipt" size={24} color="#667eea" />
                </View>
                <Text style={styles.statValue}>{userData.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard}>
              <LinearGradient
                colors={["rgba(76, 175, 80, 0.1)", "rgba(76, 175, 80, 0.05)"]}
                style={styles.statGradient}
              >
                <View style={styles.statIconBox}>
                  <Ionicons name="water" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.statValue}>
                  {userData.totalMilkPurchased}
                </Text>
                <Text style={styles.statLabel}>Milk Purchased</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => setShowRewardsModal(true)}
            >
              <LinearGradient
                colors={["rgba(255, 152, 0, 0.1)", "rgba(255, 152, 0, 0.05)"]}
                style={styles.statGradient}
              >
                <View style={styles.statIconBox}>
                  <Ionicons name="diamond" size={24} color="#FF9800" />
                </View>
                <Text style={styles.statValue}>{userData.loyaltyPoints}</Text>
                <Text style={styles.statLabel}>Loyalty Points</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Loyalty Progress Bar */}
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyHeader}>
              <Text style={styles.loyaltyTitle}>Next Reward</Text>
              <Text style={styles.loyaltyPointsNeeded}>
                {userData.nextReward} points needed
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(userData.loyaltyPoints % 500) / 5}%` },
                ]}
              />
            </View>
            {renderStars(userData.loyaltyPoints)}
          </View>

          {/* Tabs for Overview/Activity/Achievements */}
          <View style={styles.tabsContainer}>
            {["overview", "activity", "achievements"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab as any)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <>
              {/* Enhanced Graph Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Consumption Analytics</Text>
                  <View style={styles.toggleContainer}>
                    <TouchableOpacity
                      style={[
                        styles.toggleBtn,
                        graphPeriod === "week" && styles.toggleBtnActive,
                      ]}
                      onPress={() => setGraphPeriod("week")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          graphPeriod === "week" && styles.toggleTextActive,
                        ]}
                      >
                        Week
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleBtn,
                        graphPeriod === "month" && styles.toggleBtnActive,
                      ]}
                      onPress={() => setGraphPeriod("month")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          graphPeriod === "month" && styles.toggleTextActive,
                        ]}
                      >
                        Month
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.toggleBtn,
                        graphPeriod === "year" && styles.toggleBtnActive,
                      ]}
                      onPress={() => setGraphPeriod("year")}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          graphPeriod === "year" && styles.toggleTextActive,
                        ]}
                      >
                        Year
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.chartCard}>
                  <Text style={styles.chartYAxisLabel}>Liters (L)</Text>
                  <LineChart
                    data={getChartData()}
                    width={getChartWidth()}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chartStyle}
                    withInnerLines={false}
                    withOuterLines={true}
                    withVerticalLines={false}
                    formatYLabel={(label) => `${label}L`}
                  />
                </View>
              </View>

              {/* Enhanced Address Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Saved Addresses</Text>
                  <TouchableOpacity onPress={() => router.push('/address')}>
                    <Text style={styles.editLink}>Manage All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.addressCard}>
                  <View style={styles.addressIconContainer}>
                    <Ionicons name="home" size={24} color="#667eea" />
                  </View>
                  <View style={styles.addressInfo}>
                    <View style={styles.addressHeader}>
                      <Text style={styles.addressType}>Home (Default)</Text>
                      <TouchableOpacity onPress={() => router.push('/address')}>
                        <Text style={styles.changeLink}>Change</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.addressText}>
                      {userData.defaultAddress}
                    </Text>
                  </View>
                </View>

                {userData.alternateAddresses.map((address, index) => (
                  <View
                    key={index}
                    style={[styles.addressCard, styles.alternateAddress]}
                  >
                    <View
                      style={[
                        styles.addressIconContainer,
                        { backgroundColor: "rgba(156, 39, 176, 0.1)" },
                      ]}
                    >
                      <Ionicons name="location" size={24} color="#9C27B0" />
                    </View>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressType}>
                        Alternate Address {index + 1}
                      </Text>
                      <Text style={styles.addressText}>{address}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Activity Tab */}
          {selectedTab === "activity" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityIcon}>
                    <LinearGradient
                      colors={["#667eea", "#764ba2"]}
                      style={styles.activityGradient}
                    >
                      <Ionicons
                        name={
                          activity.action.includes("Order")
                            ? "cart"
                            : activity.action.includes("Subscription")
                              ? "repeat"
                              : activity.action.includes("Payment")
                                ? "card"
                                : "gift"
                        }
                        size={20}
                        color="#FFF"
                      />
                    </LinearGradient>
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activityAmount}>{activity.amount}</Text>
                    <Text style={styles.activityDate}>
                      {activity.date} at {activity.time}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.activityStatus,
                      {
                        backgroundColor:
                          activity.status === "delivered"
                            ? "rgba(76, 175, 80, 0.1)"
                            : activity.status === "active"
                              ? "rgba(33, 150, 243, 0.1)"
                              : "rgba(255, 152, 0, 0.1)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            activity.status === "delivered"
                              ? "#4CAF50"
                              : activity.status === "active"
                                ? "#2196F3"
                                : "#FF9800",
                        },
                      ]}
                    >
                      {activity.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Achievements Tab */}
          {selectedTab === "achievements" && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Achievements</Text>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View
                    style={[
                      styles.achievementIcon,
                      { backgroundColor: `${achievement.color}20` },
                    ]}
                  >
                    <Ionicons
                      name={achievement.icon as any}
                      size={28}
                      color={achievement.color}
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDesc}>
                      {achievement.description}
                    </Text>
                    <View style={styles.achievementProgress}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${achievement.progress * 100}%`,
                            backgroundColor: achievement.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(achievement.progress * 100)}% Complete
                    </Text>
                  </View>
                  {achievement.progress === 1 && (
                    <View style={styles.completedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#4CAF50"
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Settings Section */}
          <View style={[styles.section, { marginBottom: 40 }]}>
            <Text style={styles.sectionTitle}>Settings & Preferences</Text>
            <View style={styles.linksCard}>
              <TouchableOpacity style={styles.linkItem}>
                <View
                  style={[
                    styles.linkIconBox,
                    { backgroundColor: "rgba(233, 30, 99, 0.1)" },
                  ]}
                >
                  <Ionicons name="heart" size={20} color="#E91E63" />
                </View>
                <Text style={styles.linkText}>My Wishlist</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.linkItem}>
                <View
                  style={[
                    styles.linkIconBox,
                    { backgroundColor: "rgba(255, 152, 0, 0.1)" },
                  ]}
                >
                  <Ionicons name="card" size={20} color="#FF9800" />
                </View>
                <Text style={styles.linkText}>Payment Methods</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>

              <View style={styles.divider} />

              <View style={styles.linkItem}>
                <View
                  style={[
                    styles.linkIconBox,
                    { backgroundColor: "rgba(76, 175, 80, 0.1)" },
                  ]}
                >
                  <Ionicons name="notifications" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.linkText}>Push Notifications</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E0E0E0", true: "#667eea" }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={styles.divider} />

              <TouchableOpacity style={styles.linkItem}>
                <View
                  style={[
                    styles.linkIconBox,
                    { backgroundColor: "rgba(156, 39, 176, 0.1)" },
                  ]}
                >
                  <Ionicons name="help-buoy" size={20} color="#9C27B0" />
                </View>
                <Text style={styles.linkText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 85 + insets.bottom }} />
        </Animated.View>
      </ScrollView>

      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your address"
              value={newAddress}
              onChangeText={setNewAddress}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={addNewAddress}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rewards Modal */}
      <Modal
        visible={showRewardsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRewardsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎁 Loyalty Rewards</Text>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardText}>250 points - ₹50 off</Text>
              <TouchableOpacity style={styles.redeemBtn}>
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardText}>500 points - Free 1L Milk</Text>
              <TouchableOpacity style={styles.redeemBtn}>
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardText}>1000 points - ₹150 off</Text>
              <TouchableOpacity style={styles.redeemBtn}>
                <Text style={styles.redeemText}>Redeem</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setShowRewardsModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {!isWeb && <BottomTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  webWidthLimit: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
  },
  header: {
    zIndex: 100,
    backgroundColor: "#FFF",
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
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
    paddingHorizontal: 20,
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
  },
  scrollContent: {
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFF",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F8F9FA",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  phoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EBF0FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },
  phoneText: {
    fontSize: 12,
    color: "#667eea",
    fontWeight: "600",
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  memberText: {
    fontSize: 11,
    color: "#999",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statGradient: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  loyaltyCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loyaltyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  loyaltyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  loyaltyPointsNeeded: {
    fontSize: 12,
    color: "#999",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF9800",
    borderRadius: 3,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#667eea",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#FFF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editLink: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  changeLink: {
    color: "#667eea",
    fontSize: 12,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#EBF0FF",
    borderRadius: 20,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  toggleBtnActive: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  toggleTextActive: {
    color: "#667eea",
    fontWeight: "bold",
  },
  chartCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  chartYAxisLabel: {
    position: "absolute",
    left: 10,
    top: 10,
    fontSize: 10,
    color: "#999",
    fontWeight: "bold",
    zIndex: 10,
  },
  chartStyle: {
    marginLeft: -10,
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EBF0FF",
    marginBottom: 12,
  },
  alternateAddress: {
    backgroundColor: "#F8F9FA",
  },
  addressIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  addressType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  addressText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  linksCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "#EBF0FF",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  linkIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBF0FF",
    marginHorizontal: 12,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  activityIcon: {
    marginRight: 12,
  },
  activityGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  activityAmount: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  activityDate: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  activityStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  achievementCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  achievementIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  achievementDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  achievementProgress: {
    height: 4,
    backgroundColor: "#F0F0F0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressText: {
    fontSize: 10,
    color: "#999",
  },
  completedBadge: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  modalCancelText: {
    color: "#666",
    fontWeight: "500",
  },
  modalSave: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#667eea",
    alignItems: "center",
  },
  modalSaveText: {
    color: "#FFF",
    fontWeight: "500",
  },
  rewardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  rewardText: {
    fontSize: 14,
    color: "#333",
  },
  redeemBtn: {
    backgroundColor: "#667eea",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  redeemText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  closeModalBtn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  closeModalText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
});