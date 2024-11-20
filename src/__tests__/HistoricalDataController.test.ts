import { describe, it, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import express from "express";
import { HistoricalDataController } from "../controllers/historicalDataController";
import { IHistoricalDataService } from "../services/IHistoricalDataService";
import { HistoricalData } from "../models/historicalData";

const mockService: IHistoricalDataService = {
  getAllHistoricalData: vi.fn(),
  addHistoricalRecord: vi.fn(),
  getRecordByEnergyResourceId: vi.fn(),
  getRecordsByDateRange: vi.fn(),
  deleteRecordById: vi.fn(),
  updateConsumptionById: vi.fn(),
  getAverageConsumption: vi.fn(),
};

const app = express();
app.use(express.json());
const controller = new HistoricalDataController(mockService);
app.get("/historical-data", controller.getAllHistoricalData.bind(controller));
app.post("/historical-data", controller.addHistoricalData.bind(controller));
app.get(
  "/historical-data/resource/:energyResourceId",
  controller.getRecordByEnergyResource.bind(controller)
);
app.get(
  "/historical-data/range",
  controller.getRecordsByDateRange.bind(controller)
);
app.delete("/historical-data/:id", controller.deleteRecord.bind(controller));
app.put(
  "/historical-data/consumption",
  controller.updateConsumption.bind(controller)
);
app.get(
  "/historical-data/average/:energyResourceId",
  controller.getAverageConsumption.bind(controller)
);

describe("HistoricalDataController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all historical data", async () => {
    const data: HistoricalData[] = [];
    mockService.getAllHistoricalData.mockResolvedValue(data);
    const response = await request(app).get("/historical-data");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(data);
  });

  it("should add historical data", async () => {
    const record: HistoricalData = {
      id: "1",
      timestamp: new Date().toISOString(),
      energyResourceId: "resource1",
      consumption: 100,
      voltage: 230,
      current: 10,
      frequency: 50,
    };
    const response = await request(app).post("/historical-data").send(record);
    expect(response.status).toBe(201);
    expect(mockService.addHistoricalRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1",
        timestamp: expect.any(String),
        energyResourceId: "resource1",
        consumption: 100,
        voltage: 230,
        current: 10,
        frequency: 50,
      })
    );
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
    mockService.getRecordByEnergyResourceId.mockResolvedValue(record);
    const response = await request(app).get(
      "/historical-data/resource/resource1"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(record);
  });

  it("should delete a record by ID", async () => {
    const response = await request(app).delete("/historical-data/1");
    expect(response.status).toBe(200);
    expect(mockService.deleteRecordById).toHaveBeenCalledWith("1");
  });

  it("should update consumption by ID", async () => {
    const updateData = { id: "1", newConsumption: 200 };
    const response = await request(app)
      .put("/historical-data/consumption")
      .send(updateData);
    expect(response.status).toBe(200);
    expect(mockService.updateConsumptionById).toHaveBeenCalledWith("1", 200);
  });

  it("should get average consumption by energy resource ID", async () => {
    mockService.getAverageConsumption.mockResolvedValue(150);
    const response = await request(app).get(
      "/historical-data/average/resource1"
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      energyResourceId: "resource1",
      averageConsumption: 150,
    });
  });
});
