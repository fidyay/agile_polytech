import { Low } from "lowdb";
import { HistoricalData } from "../models/historicalData.js";
import { Data } from "../utils/database.js";
import { IHistoricalDataService } from "./IHistoricalDataService.js";

export class HistoricalDataService implements IHistoricalDataService {
    private db: Low<Data>;

    constructor(db: Low<Data>) {
        this.db = db;
    }

    private async saveChanges(): Promise<void> {
        try {
            await this.db.write();
        } catch (error) {
            console.error("Failed to save changes to the database:", error);
            throw new Error("Database write error");
        }
    }

    async getAllHistoricalData(): Promise<HistoricalData[]> {
        return this.db.data.historicalData || [];
    }

    async addHistoricalRecord(record: HistoricalData): Promise<void> {
        try {
            this.db.data.historicalData.push(record);
            await this.saveChanges();
            console.info(`Record added successfully: ${JSON.stringify(record)}`);
        } catch (error) {
            console.error("Failed to add record:", error);
            throw new Error("Failed to add historical record");
        }
    }

    async getRecordByEnergyResourceId(energyResourceId: string): Promise<HistoricalData | undefined> {
        return this.db.data.historicalData.find(record => record.energyResourceId === energyResourceId);
    }

    async getRecordsByDateRange(start: string, end: string): Promise<HistoricalData[]> {
        try {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return this.db.data.historicalData.filter(record => {
                const recordDate = new Date(record.timestamp);
                return recordDate >= startDate && recordDate <= endDate;
            });
        } catch (error) {
            console.error("Error filtering records by date range:", error);
            throw new Error("Invalid date range provided");
        }
    }

    async deleteRecordById(id: string): Promise<void> {
        const initialCount = this.db.data.historicalData.length;
        this.db.data.historicalData = this.db.data.historicalData.filter(record => record.id !== id);

        if (this.db.data.historicalData.length === initialCount) {
            console.warn(`No record found with ID: ${id}`);
            return;
        }

        await this.saveChanges();
        console.info(`Record with ID ${id} deleted successfully.`);
    }

    async updateConsumptionById(id: string, newConsumption: number): Promise<void> {
        const record = this.db.data.historicalData.find(record => record.id === id);
        if (!record) {
            console.warn(`No record found with ID: ${id}`);
            return;
        }

        record.consumption = newConsumption;
        await this.saveChanges();
        console.info(`Consumption for record ID ${id} updated to ${newConsumption}`);
    }

    async getAverageConsumption(energyResourceId: string): Promise<number> {
        const records = this.db.data.historicalData.filter(record => record.energyResourceId === energyResourceId);

        if (records.length === 0) {
            console.warn(`No records found for energy resource ID: ${energyResourceId}`);
            return 0;
        }

        const totalConsumption = records.reduce((sum, record) => sum + record.consumption, 0);
        return parseFloat((totalConsumption / records.length).toFixed(2)); // Додаємо округлення
    }
}
