export interface HistoricalData {
  id: string;
  timestamp: string;
  energyResourceId: string;
  consumption: number;
  voltage: number;
  current: number;
  frequency: number;
}
