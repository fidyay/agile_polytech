import { db } from "../utils/database.js";
import { HistoricalData } from "../models/historicalData.js";

export class HistoricalDataService {
    async getAllHistoricalData(): Promise<HistoricalData[]> {
        return db.data.historicalData || [];
    }

    async addHistoricalRecord(record: HistoricalData): Promise<void> {
        db.data.historicalData = db.data.historicalData || [];
        db.data.historicalData.push(record);
        await db.write();
        console.log(`Historical record added: ${JSON.stringify(record)}`);
    }

    async getRecordByEnergyResourceId(energyResourceId: string): Promise<HistoricalData|undefined> {
        return db.data.historicalData.find(record => record.energyResourceId === energyResourceId);
    }

    async getRecordsByDateRange(start: string, end: string): Promise<HistoricalData[]> {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return db.data.historicalData.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= startDate && recordDate <= endDate;
        }) || [];
    }

    async deleteRecordById(id: string): Promise<void> {
        db.data.historicalData = db.data.historicalData.filter(record => record.id !== id);
        await db.write();
        console.log(`Record with ID ${id} deleted.`);
    }

    async updateConsumptionById(id: string, newConsumption: number): Promise<void> {
        const record = db.data.historicalData.find(record => record.id === id);
        if (record) {
            record.consumption = newConsumption;
            await db.write();
            console.log(`Consumption for record ${id} updated to ${newConsumption}`);
        } else {
            console.log(`Record with ID ${id} not found.`);
        }
    }

    async getAverageConsumption(energyResourceId: string): Promise<number> {
        const records = db.data.historicalData.filter(record => record.energyResourceId === energyResourceId);
        const totalConsumption = records.reduce((sum, record) => sum + record.consumption, 0);
        return records.length ? totalConsumption / records.length : 0;
    }
}
