import { describe, it, expect, beforeEach, vi } from "vitest";
import { Low } from "lowdb";
import { HistoricalDataService } from "../services/historicalDataService";
import { HistoricalData } from "../models/historicalData";

const mockDb = {
  data: {
    historicalData: [] as HistoricalData[],
  },
  write: vi.fn(),
} as unknown as Low<{ historicalData: HistoricalData[] }>;

describe("HistoricalDataService", () => {
  let service: HistoricalDataService;

  beforeEach(() => {
    service = new HistoricalDataService(mockDb);
    mockDb.data.historicalData = [];
    mockDb.write.mockClear();
  });

  it("should add a historical record", async () => {
    const record: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    await service.addHistoricalRecord(record);
    expect(mockDb.data.historicalData).toContain(record);
    expect(mockDb.write).toHaveBeenCalled();
  });

  it("should get all historical data", async () => {
    const records = await service.getAllHistoricalData();
    expect(records).toEqual(mockDb.data.historicalData);
  });

  it("should get record by energy resource ID", async () => {
    const record: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    mockDb.data.historicalData.push(record);
    const result = await service.getRecordByEnergyResourceId("resource1");
    expect(result).toEqual(record);
  });

  it("should delete a record by ID", async () => {
    const record: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    mockDb.data.historicalData.push(record);
    await service.deleteRecordById("1");
    expect(mockDb.data.historicalData).not.toContain(record);
    expect(mockDb.write).toHaveBeenCalled();
  });

  it("should update consumption by ID", async () => {
    const record: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    mockDb.data.historicalData.push(record);
    await service.updateConsumptionById("1", 200);
    expect(record.consumption).toBe(200);
    expect(mockDb.write).toHaveBeenCalled();
  });

  it("should get average consumption by energy resource ID", async () => {
    const record1: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    const record2: HistoricalData = {
      id: "2",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 200,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    mockDb.data.historicalData.push(record1, record2);
    const average = await service.getAverageConsumption("resource1");
    expect(average).toBe(150);
  });
});
