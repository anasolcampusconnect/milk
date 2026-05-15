import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomTab from "../components/BottomTab";
import NativeMap from "../components/NativeMap";

const { width, height } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

interface Address {
  id: string;
  type: "home" | "work" | "other";
  label: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  phone?: string;
  landmark?: string;
}

interface FormData {
  type: "home" | "work" | "other";
  label: string;
  address: string;
  landmark: string;
  phone: string;
  isDefault: boolean;
}

interface LocationCoords {
  latitude: number;
  longitude: number;
}

const mockAddresses: Address[] = [
  {
    id: "1",
    type: "home",
    label: "Home",
    address:
      "Flat 402, Block B, Green Valley Apartments, Madhapur, Hyderabad, 500081",
    latitude: 17.4474,
    longitude: 78.3752,
    isDefault: true,
    phone: "+91 98765 43210",
    landmark: "Near McDonald's",
  },
  {
    id: "2",
    type: "work",
    label: "Office",
    address: "7th Floor, Tech Park, Gachibowli, Hyderabad, 500032",
    latitude: 17.4401,
    longitude: 78.3489,
    isDefault: false,
    phone: "+91 98765 43211",
    landmark: "Opposite to DLF",
  },
];

export default function AddressPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoords | null>(null);

  const [formData, setFormData] = useState<FormData>({
    type: "home",
    label: "",
    address: "",
    landmark: "",
    phone: "",
    isDefault: false,
  });

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        if (isWeb) {
          window.alert("Allow location access to use this feature");
        } else {
          Alert.alert(
            "Permission Denied",
            "Allow location access to use this feature",
          );
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addressObj = reverseGeocode[0];
        const formattedAddress = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.region || ""} ${addressObj.postalCode || ""}`;
        setFormData((prev) => ({
          ...prev,
          address: formattedAddress,
          label: addressObj.street || "My Location",
        }));
      }

      setShowMapModal(true);
    } catch (error) {
      if (!isWeb) Alert.alert("Error", "Failed to get current location");
      console.warn(error);
    } finally {
      setLocationLoading(false);
    }
  };

  const addAddress = async () => {
    if (!formData.address) {
      isWeb
        ? window.alert("Please enter address")
        : Alert.alert("Error", "Please enter address");
      return;
    }

    setLoading(true);
    try {
      const newAddress: Address = {
        id: Date.now().toString(),
        type: formData.type,
        label: formData.label || formData.type,
        address: formData.address,
        landmark: formData.landmark,
        phone: formData.phone,
        isDefault: formData.isDefault,
        latitude: selectedLocation?.latitude,
        longitude: selectedLocation?.longitude,
      };

      let updatedAddresses = [...addresses, newAddress];

      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === newAddress.id,
        }));
      }

      setAddresses(updatedAddresses);
      resetForm();
      setShowAddModal(false);
      if (!isWeb) Alert.alert("Success", "Address added successfully");
    } catch (error) {
      if (!isWeb) Alert.alert("Error", "Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const editAddress = async () => {
    if (!selectedAddress) return;

    setLoading(true);
    try {
      const updatedAddress: Address = {
        ...selectedAddress,
        type: formData.type,
        label: formData.label,
        address: formData.address,
        landmark: formData.landmark,
        phone: formData.phone,
        isDefault: formData.isDefault,
        latitude: selectedLocation?.latitude || selectedAddress.latitude,
        longitude: selectedLocation?.longitude || selectedAddress.longitude,
      };

      let updatedAddresses = addresses.map((addr) =>
        addr.id === selectedAddress.id ? updatedAddress : addr,
      );

      if (formData.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === updatedAddress.id,
        }));
      }

      setAddresses(updatedAddresses);
      setShowEditModal(false);
      if (!isWeb) Alert.alert("Success", "Address updated successfully");
    } catch (error) {
      if (!isWeb) Alert.alert("Error", "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = (id: string) => {
    if (isWeb) {
      if (window.confirm("Are you sure you want to delete this address?")) {
        const updatedAddresses = addresses.filter((addr) => addr.id !== id);
        setAddresses(updatedAddresses);
      }
    } else {
      Alert.alert(
        "Delete Address",
        "Are you sure you want to delete this address?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              const updatedAddresses = addresses.filter(
                (addr) => addr.id !== id,
              );
              setAddresses(updatedAddresses);
              Alert.alert("Success", "Address deleted successfully");
            },
          },
        ],
      );
    }
  };

  const setDefaultAddress = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    setAddresses(updatedAddresses);
    if (!isWeb) Alert.alert("Success", "Default address updated");
  };

  const resetForm = () => {
    setFormData({
      type: "home",
      label: "",
      address: "",
      landmark: "",
      phone: "",
      isDefault: false,
    });
    setSelectedLocation(null);
  };

  const openEditModal = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      type: address.type,
      label: address.label,
      address: address.address,
      landmark: address.landmark || "",
      phone: address.phone || "",
      isDefault: address.isDefault,
    });
    setSelectedLocation(
      address.latitude && address.longitude
        ? { latitude: address.latitude, longitude: address.longitude }
        : null,
    );
    setShowEditModal(true);
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const handleMarkerDragEnd = (event: any) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  };

  const getAddressIcon = (type: string): string => {
    switch (type) {
      case "home":
        return "home";
      case "work":
        return "briefcase";
      default:
        return "location";
    }
  };

  const getAddressColor = (type: string): string => {
    switch (type) {
      case "home":
        return "#667eea";
      case "work":
        return "#4CAF50";
      default:
        return "#FF9800";
    }
  };

  const confirmLocation = async () => {
    if (selectedLocation) {
      try {
        const reverseGeocode =
          await Location.reverseGeocodeAsync(selectedLocation);
        if (reverseGeocode.length > 0) {
          const addressObj = reverseGeocode[0];
          const formattedAddress = `${addressObj.street || ""}, ${addressObj.city || ""}, ${addressObj.region || ""} ${addressObj.postalCode || ""}`;
          setFormData((prev) => ({
            ...prev,
            address: formattedAddress,
          }));
        }
        setShowMapModal(false);
        if (!isWeb) Alert.alert("Success", "Location selected!");
      } catch (error) {
        if (!isWeb) Alert.alert("Error", "Failed to get address from location");
      }
    }
  };

  const renderAddressCard = ({ item }: { item: Address }) => (
    <View style={styles.addressCard}>
      <LinearGradient colors={["#FFF", "#F8F9FA"]} style={styles.cardGradient}>
        <View style={styles.cardHeader}>
          <View style={styles.addressTypeContainer}>
            <View
              style={[
                styles.addressIcon,
                { backgroundColor: `${getAddressColor(item.type)}20` },
              ]}
            >
              <Ionicons
                name={getAddressIcon(item.type) as any}
                size={20}
                color={getAddressColor(item.type)}
              />
            </View>
            <View>
              <View style={styles.typeRow}>
                <Text style={styles.addressLabel}>{item.label}</Text>
                {item.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressType}>
                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => openEditModal(item)}
            >
              <Ionicons name="create-outline" size={20} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => deleteAddress(item.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF5252" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressDetails}>
          <Ionicons name="location-outline" size={16} color="#999" />
          <Text style={styles.addressText}>{item.address}</Text>
        </View>

        {item.landmark && (
          <View style={styles.addressDetails}>
            <Ionicons name="flag-outline" size={16} color="#999" />
            <Text style={styles.addressText}>Landmark: {item.landmark}</Text>
          </View>
        )}

        {item.phone && (
          <View style={styles.addressDetails}>
            <Ionicons name="call-outline" size={16} color="#999" />
            <Text style={styles.addressText}>{item.phone}</Text>
          </View>
        )}

        {!item.isDefault && (
          <TouchableOpacity
            style={styles.setDefaultBtn}
            onPress={() => setDefaultAddress(item.id)}
          >
            <Text style={styles.setDefaultText}>Set as Default</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );

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
            <Text style={styles.headerTitle}>My Addresses</Text>
            {/* Replaced Add icon with a spacer so the title stays perfectly centered */}
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={styles.currentLocationBtn}
        onPress={getCurrentLocation}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.currentLocationGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Ionicons name="navigate" size={20} color="#FFF" />
          <Text style={styles.currentLocationText}>Use Current Location</Text>
        </LinearGradient>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.contentWrapper, isWeb && styles.webWidthLimit]}>
          {addresses.length > 0 ? (
            <>
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
                <TouchableOpacity
                  onPress={() => setShowAddModal(true)}
                  style={styles.addInlineBtn}
                >
                  <Ionicons name="add" size={16} color="#667eea" />
                  <Text style={styles.addInlineBtnText}>Add Address</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={addresses}
                renderItem={renderAddressCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          ) : (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={["#667eea20", "#764ba220"]}
                style={styles.emptyStateIcon}
              >
                <Ionicons name="location-outline" size={60} color="#667eea" />
              </LinearGradient>
              <Text style={styles.emptyStateTitle}>No Addresses Saved</Text>
              <Text style={styles.emptyStateText}>
                Add your first address to start ordering
              </Text>
              <TouchableOpacity
                style={styles.addFirstBtn}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.addFirstBtnText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Tips</Text>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>Add landmark for easy location</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>
                Save multiple addresses for different locations
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.tipText}>
                Keep your default address updated for faster checkout
              </Text>
            </View>
          </View>
          <View style={{ height: 85 + insets.bottom }} />
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal || showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>
                {showAddModal ? "Add New Address" : "Edit Address"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Address Type</Text>
                <View style={styles.typeSelector}>
                  {(["home", "work", "other"] as const).map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        formData.type === type && styles.typeOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, type })}
                    >
                      <Ionicons
                        name={getAddressIcon(type) as any}
                        size={20}
                        color={
                          formData.type === type
                            ? "#FFF"
                            : getAddressColor(type)
                        }
                      />
                      <Text
                        style={[
                          styles.typeOptionText,
                          formData.type === type && styles.typeOptionTextActive,
                        ]}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Label (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Home, Office, Cafe"
                  value={formData.label}
                  onChangeText={(text) =>
                    setFormData({ ...formData, label: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Address *</Text>
                <View style={styles.addressInputContainer}>
                  <TextInput
                    style={[styles.input, styles.addressInput]}
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChangeText={(text) =>
                      setFormData({ ...formData, address: text })
                    }
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.locationBtn}
                    onPress={getCurrentLocation}
                  >
                    <Ionicons name="map" size={20} color="#667eea" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Landmark (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nearby landmark"
                  value={formData.landmark}
                  onChangeText={(text) =>
                    setFormData({ ...formData, landmark: text })
                  }
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contact number for delivery"
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.label}>Set as Default Address</Text>
                  <Switch
                    value={formData.isDefault}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isDefault: value })
                    }
                    trackColor={{ false: "#E0E0E0", true: "#667eea" }}
                    thumbColor="#FFF"
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={showAddModal ? addAddress : editAddress}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.saveBtnText}>
                      {showAddModal ? "Add Address" : "Save Changes"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Map Modal */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mapModalContent}>
            <LinearGradient
              colors={["#667eea", "#764ba2"]}
              style={styles.mapModalHeader}
            >
              <Text style={styles.mapModalTitle}>Select Location on Map</Text>
              <TouchableOpacity
                onPress={() => setShowMapModal(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </LinearGradient>

            {locationLoading ? (
              <View style={styles.mapLoading}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.mapLoadingText}>
                  Getting your location...
                </Text>
              </View>
            ) : (
              <>
                {currentLocation && (
                  <NativeMap
                    currentLocation={currentLocation}
                    selectedLocation={selectedLocation}
                    handleMapPress={handleMapPress}
                    handleMarkerDragEnd={handleMarkerDragEnd}
                  />
                )}
                <View style={styles.mapActions}>
                  <TouchableOpacity
                    style={styles.mapCancelBtn}
                    onPress={() => setShowMapModal(false)}
                  >
                    <Text style={styles.mapCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.mapConfirmBtn}
                    onPress={confirmLocation}
                    disabled={isWeb}
                  >
                    <Text style={styles.mapConfirmText}>Confirm Location</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {!isWeb && <BottomTab />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  webWidthLimit: { maxWidth: 800, width: "100%", alignSelf: "center" },
  contentWrapper: { flex: 1, width: "100%" },
  header: { zIndex: 100, backgroundColor: "#FFF" },
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
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationBtn: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  currentLocationGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  currentLocationText: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  scrollContent: { paddingTop: 10 },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  addInlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  addInlineBtnText: {
    color: "#667eea",
    fontSize: 13,
    fontWeight: "600",
  },
  addressCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#EBF0FF",
    borderRadius: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addressTypeContainer: { flexDirection: "row", alignItems: "center", gap: 12 },
  addressIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  typeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  addressLabel: { fontSize: 16, fontWeight: "bold", color: "#333" },
  defaultBadge: {
    backgroundColor: "#667eea20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: { fontSize: 10, fontWeight: "600", color: "#667eea" },
  addressType: { fontSize: 12, color: "#999", marginTop: 2 },
  cardActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  addressDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
    paddingRight: 8,
  },
  addressText: { flex: 1, fontSize: 13, color: "#666", lineHeight: 18 },
  setDefaultBtn: { marginTop: 8, paddingVertical: 6, alignSelf: "flex-start" },
  setDefaultText: { fontSize: 12, color: "#667eea", fontWeight: "600" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    marginHorizontal: 20,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  addFirstBtn: {
    backgroundColor: "#667eea",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addFirstBtnText: { color: "#FFF", fontWeight: "600" },
  tipsSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EBF0FF",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  tipText: { flex: 1, fontSize: 13, color: "#666" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: { padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#333", marginBottom: 8 },
  typeSelector: { flexDirection: "row", gap: 12 },
  typeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  typeOptionActive: { backgroundColor: "#667eea", borderColor: "#667eea" },
  typeOptionText: { fontSize: 14, color: "#666" },
  typeOptionTextActive: { color: "#FFF" },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#FFF",
  },
  addressInputContainer: { position: "relative" },
  addressInput: { paddingRight: 50, minHeight: 80, textAlignVertical: "top" },
  locationBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  cancelBtnText: { color: "#666", fontWeight: "500" },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#667eea",
    alignItems: "center",
  },
  saveBtnText: { color: "#FFF", fontWeight: "500" },
  mapModalContent: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    width: width - 40,
    maxWidth: 500,
    maxHeight: height * 0.8,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 60,
  },
  mapModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  mapModalTitle: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
  mapLoading: { height: 400, justifyContent: "center", alignItems: "center" },
  mapLoadingText: { marginTop: 12, color: "#666" },
  mapActions: { flexDirection: "row", gap: 12, padding: 16 },
  mapCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  mapCancelText: { color: "#666" },
  mapConfirmBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#667eea",
    alignItems: "center",
    opacity: isWeb ? 0.5 : 1,
  },
  mapConfirmText: { color: "#FFF", fontWeight: "600" },
});