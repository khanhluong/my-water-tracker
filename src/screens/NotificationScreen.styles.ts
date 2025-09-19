import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F9FF",
  },
  header: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 32,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerIconText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  headerSubTitle: {
    fontSize: 14,
    color: "#BFDBFE",
  },
  content: {
    padding: 24,
    paddingTop: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 0.84,
    elevation: 5,
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  cardSubTitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeSection: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  timeButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#D1D5DB",
    padding: 12,
    alignItems: "center",
  },
  timeButtonText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },

  intervalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  intervalButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: "22%",
    alignItems: "center",
  },
  intervalButtonActive: {
    backgroundColor: "#3B82F6",
  },
  intervalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  intervalButtonTextActive: {
    color: "white",
  },
  intervalInfor: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
  },
  dayButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flex: 1,
    marginHorizontal: 2,
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: "#3B82F6",
  },
  dayButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    overflow: "hidden",
  },
  dayButtonTextActive: {
    color: "white",
  },
  soundSection: {
    marginBottom: 12,
  },
  soundOption: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7E8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  soundOptionActive: {
    backgroundColor: "#EBF4FF",
    borderColor: "#3B82F6",
  },
  soundOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  soundOptionTextActive: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  testSoundButton: {
    alignSelf: "flex-start",
  },
  testSoundButtonText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
  },

  statusCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 0,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    backgroundColor: "#10B981",
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: "#BFDBFE",
  },
  saveButton: {
    backgroundColor: "#3B82F6",
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
