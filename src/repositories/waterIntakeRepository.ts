import * as SQLite from "expo-sqlite";
import { WaterIntakeHistory } from "../models/WaterIntakeHistory";
import WaterEntry from "../models/WaterEntry";
import { WaterIntake } from "../models/WaterIntake";

const db = SQLite.openDatabaseAsync("water-tracker.db");

export const waterIntakeRepository = {
  setupDatabase: async () => {
    (await db).execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS water_intake (id INTEGER PRIMARY KEY NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, type TEXT NOT NULL);
    `);
  },
  addWaterEntry: async (amount: number, type: string) => {
    try {
      (await db).runAsync(
        "INSERT INTO water_intake (amount, date, type) VALUES (?, ?, ?)",
        amount,
        new Date().toISOString(),
        type
      );
    } catch (e) {
      console.error("Failed to save water entry.", e);
      throw e; // rethrow to be handled by caller
    }
  },
  getHistory: async (): Promise<WaterIntakeHistory[]> => {
    try {
      const dbInstance = await db;
      const result: WaterIntake[] = await dbInstance.getAllAsync(
        "SELECT * FROM water_intake ORDER BY date DESC"
      );

      if (!result) {
        return [];
      }

      const groupedByDate = result.reduce((acc, entry: WaterIntake) => {
        const date = new Date(entry.date).toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          amount: entry.amount,
          time: new Date(entry.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: entry.type,
        });
        return acc;
      }, {} as Record<string, WaterEntry[]>);

      const historyData: WaterIntakeHistory[] = Object.keys(groupedByDate).map(
        (date) => ({
          date,
          entries: groupedByDate[date],
        })
      );

      return historyData;
    } catch (error) {
      console.error("Failed to load history from database", error);
      return []; // Return empty array on error
    }
  },
};
