import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
  Modal,
} from "react-native";
import { commonStyles } from "./styles/commonStyles";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { center } from "@shopify/react-native-skia";

export function SettingsScreenV2() {
  const [units, setUnits] = useState("metric");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [modalVisible, setModalVisible] = useState<null | string>(null);

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

  const handleUnitChange = (unit) => {
    setUnits(unit);
    setModalVisible(null);
    Alert.alert(
      "Success",
      `Units changed to ${unitOptions.find((u) => u.value === unit)?.label}`
    );
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
              onValueChange={setDarkMode}
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
        />
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
        </CustomModal>;
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 8,
  },
  settingItem: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    fontSize: 20,
    marginLeft: 8,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden'
  },
  modalHeader: {
    backgroundColor: '#3B82F6',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white'
  },
  closeButton: {
    padding: 4
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
  modalContent: {
    padding: 20
  },

  unitOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  unitOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },

  unitOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4
  },
  unitOptionTitleSelected: {
    color: '#1D4ED8',
  },

  unitOptionDesc: {
    fontSize: 14,
    color: "#6B7280"
  },
  unitOptionDescSelected: {
    color: '#1D4ED8',
  },
});
