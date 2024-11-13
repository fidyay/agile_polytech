import { HistoricalData } from "../models/historicalData";

export interface IHistoricalDataService {
    getAllHistoricalData(): Promise<HistoricalData[]>;
    addHistoricalRecord(record: HistoricalData): Promise<void>;
    getRecordByEnergyResourceId(energyResourceId: string): Promise<HistoricalData | undefined>;
    getRecordsByDateRange(start: string, end: string): Promise<HistoricalData[]>;
    deleteRecordById(id: string): Promise<void>;
    updateConsumptionById(id: string, newConsumption: number): Promise<void>;
    getAverageConsumption(energyResourceId: string): Promise<number>;
}