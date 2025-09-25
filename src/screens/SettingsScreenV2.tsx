import {
  View,
  Text,
  ScrollView,
  Alert,
  Switch,
  Modal,
  Linking,
  Platform,
  Share,
} from "react-native";
import { commonStyles } from "../styles/commonStyles";
import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { saveSetting, loadSetting } from '../services/settingsService';
import { styles } from "./SettingsScreenV2.styles";

export function SettingsScreenV2() {
  const [units, setUnits] = useState("metric");
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState<null | string>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const darkModeValue = await loadSetting('darkMode');
      if (darkModeValue !== null) {
        setDarkMode(darkModeValue);
      }
    };
    loadSettings();
  }, []);

  const handleDarkModeChange = (value: boolean) => {
    setDarkMode(value);
    saveSetting('darkMode', value);
  };

  const unitOptions = [
    {
      value: "metric",
      label: "Metric (ml, L)",
      desc: "Milliliters and Liters",
    },
    {
      value: "imperial",
      label: "Imperial (fl oz, cups)",
      desc: "Fluid ounces and Cups",
    },
    { value: "mixed", label: "Mixed Units", desc: "Both metric and imperial" },
  ];

  const handleUnitChange = (unit: string) => {
    setUnits(unit);
    setModalVisible(null);
    Alert.alert(
      "Success",
      `Units changed to ${unitOptions.find((u) => u.value === unit)?.label}`
    );
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@watertracker.com?subject=Support Request");
  };

  const handleRateApp = () => {
    const storeUrl =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/your-app-id"
        : "https://play.google.com/store/apps/details?id=com.yourapp";
    Linking.openURL(storeUrl);
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Checkout this amazing water tracking app! Stay hydrated and healthy",
      });
    } catch {
      Alert.alert("Error", "Could not share app");
    }
  };

  const handleWebsite = () => {
    Linking.openURL("https://watertracker.com");
  };

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your water tracking data will be exported to CSV format.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Export",
          onPress: () => Alert.alert("Success", "Data exported successfully!"),
        },
      ]
    );
  };

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    subtitle: string;
    showArrow?: boolean;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }> = ({
    icon,
    title,
    subtitle,
    showArrow = true,
    onPress,
    rightComponent,
  }) => (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <View style={styles.settingRight}>
          {rightComponent}
          {showArrow && <Text style={styles.chevron}>›</Text>}
        </View>
      </TouchableOpacity>
    );

  const CustomModal: React.FC<{
    visible: boolean;
    title: string;
    children: React.ReactNode;
    onClose?: () => void;
  }> = ({ visible, title, children, onClose }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>x</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView
      style={commonStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={commonStyles.header}>
        <View style={commonStyles.headerContent}>
          <View style={commonStyles.headerIcon}>
            <Text style={commonStyles.headerIconText}>🔔</Text>
          </View>
          <View>
            <Text style={commonStyles.headerTitle}>Settings</Text>
            <Text style={commonStyles.headerSubTitle}>
              Customize your water tracking experience
            </Text>
          </View>
        </View>
      </View>
      <View style={commonStyles.content}>
        <SectionHeader title="Preferences" />
        <SettingItem
          icon="📏"
          title="Units"
          subtitle={unitOptions.find((u) => u.value === units)?.label ?? ""}
          showArrow={true}
          onPress={() => setModalVisible("units")}
        />
        <SettingItem
          icon="🔔"
          title="Notifications"
          subtitle="Water reminder settings"
          showArrow={true}
          onPress={() => Alert.alert("Navigation", "Navigate to config screen")}
        />
        <SettingItem
          icon={darkMode ? "🌙" : "☀️"}
          title="Dark Mode"
          subtitle={darkMode ? "Dark theme enabled" : "Light theme enable"}
          showArrow={false}
          rightComponent={
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeChange}
              trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
              thumbColor={darkMode ? "#3B82F6" : "#F3F4F6"}
            />
          }
        />
        <SettingItem
          icon="🔊"
          title="Sound Effects"
          subtitle={soundEnabled ? "Enable" : "Disabled"}
          rightComponent={
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#E5E7EB", true: "#93C5FD" }}
              thumbColor={darkMode ? "#3B82F6" : "#F3F4F6"}
            />
          }
          showArrow={false}
        />
        {/* Data & Privacy Section */}
        <SectionHeader title="Data & Privacy Section" />
        <SettingItem
          icon="💾"
          title="Export Data"
          subtitle="Download your water tracking history"
          showArrow={true}
          onPress={handleExportData}
        />
        <SettingItem
          icon="🛡️"
          title="Privacy Policy"
          subtitle="How to protect your data"
          onPress={() => setModalVisible("privacy")}
        />
        <SettingItem
          icon="👤"
          title="Account Settings"
          subtitle="Manage your profile and preferences"
          onPress={() =>
            Alert.alert("Navigation", "Navigation to account settings")
          }
        />
        {/* Support Section */}
        <SectionHeader title="Support" />
        <SettingItem
          icon="❓"
          title="FAQ"
          subtitle="Frequently asked questions"
          onPress={() => setModalVisible("faq")}
        />
        <SettingItem
          icon="✉️"
          title="Contact Support"
          subtitle="Get help with the app"
          onPress={handleContactSupport}
        />
        <SettingItem
          icon="⭐"
          title="Rate App"
          subtitle="Share your feedback"
          onPress={handleRateApp}
        />
        <SettingItem
          icon="📤"
          title="Share App"
          subtitle="Tell friend about this app"
          onPress={handleShareApp}
        />
        {/* About section */}
        <SectionHeader title="About" />
        <SettingItem
          icon="ℹ️"
          title="App Version"
          subtitle="Version 2.1.3"
          onPress={() => setModalVisible("about")}
        />
        <SettingItem
          icon="🌐"
          title="Website"
          subtitle="Visit our website"
          onPress={handleWebsite}
        />
        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoIcon}>💧</Text>
          <Text style={styles.appInfoTitle}>Hydration Tracker</Text>
          <Text style={styles.appInfoSubtitle}>
            Stay healthy, stay hydrated
          </Text>
        </View>
        <CustomModal
          visible={modalVisible === "units"}
          title="Choose Units"
          onClose={() => setModalVisible(null)}
        >
          {unitOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.unitOption,
                units === option.value && styles.unitOptionSelected,
              ]}
              onPress={() => handleUnitChange(option.value)}
            >
              <Text
                style={[
                  styles.unitOptionTitle,
                  units === option.value && styles.unitOptionTitleSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.unitOptionDesc,
                  units === option.value && styles.unitOptionDescSelected,
                ]}
              >
                {option.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </CustomModal>
        {/* About Modal */}
        <CustomModal
          visible={modalVisible === "faq"}
          title="Frequently Asked Question"
          onClose={() => setModalVisible(null)}
        >
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              How much water should I drink daily?
            </Text>
            <Text style={styles.modalText}>
              The general recommendation is 8 glasses (64 oz or 2 liters) per
              day, but this can vary based on your activity level, climate, and
              body size.
            </Text>
          </View>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              Can I log different types of beverages?
            </Text>
            <Text style={styles.modalText}>
              Yes! You can log water, tea, coffee, and other beverages. The app
              tracks all fluid intake toward your daily goal.
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              How do I change my daily goal?
            </Text>
            <Text style={styles.modalText}>
              You can adjust your daily water goal in the main dashboard by
              tapping on your current goal amount.
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>
              Why aren't my reminders working?
            </Text>
            <Text style={styles.modalText}>
              Make sure notifications are enabled in your device settings and
              that you've configured your reminder times in the app settings.
            </Text>
          </View>
        </CustomModal>
        {/* Privacy Policy Modal */}
        <CustomModal
          visible={modalVisible === "privacy"}
          title="Privacy Policy"
          onClose={() => setModalVisible(null)}
        >
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Data Collection</Text>
            <Text style={styles.modalText}>
              We collect only the water intake data you choose to log. This
              includes:
            </Text>
            <Text style={styles.modalBullet}>
              • Daily water consumption amounts
            </Text>
            <Text style={styles.modalBullet}>• Reminder preferences</Text>
            <Text style={styles.modalBullet}>• App usage statistics</Text>
          </View>
          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Data Usage</Text>
            <Text style={styles.modalText}>
              Your data is used to provide personalized hydration tracking and reminders.
              We never share your personal data with third parties.
            </Text>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Data Security</Text>
            <Text style={styles.modalText}>
              All data is encrypted and stored securely on your device and our protected servers.
            </Text>
          </View>
        </CustomModal>
      </View>
    </ScrollView>
  );
}


