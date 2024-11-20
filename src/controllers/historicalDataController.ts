import { Request, Response } from "express";
import { IHistoricalDataService } from "../services/IHistoricalDataService";

export class HistoricalDataController {
  private service: IHistoricalDataService;

  constructor(service: IHistoricalDataService) {
    this.service = service;
  }

  async getAllHistoricalData(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.getAllHistoricalData();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch historical data" });
    }
  }

  // Метод для добавления исторических данных
  async addHistoricalData(req: Request, res: Response): Promise<void> {
    const { id, timestamp, energyResourceId, consumption } = req.body;

    // Генерация случайных данных для остальных полей
    const voltage = parseFloat((Math.random() * (240 - 220) + 220).toFixed(2)); // от 220 до 240 Вольт
    const current = parseFloat((Math.random() * (20 - 5) + 5).toFixed(2)); // от 5 до 20 Ампер
    const frequency = 50; // Фиксированная частота 50 Гц

    try {
      await this.service.addHistoricalRecord({
        id,
        timestamp,
        energyResourceId,
        consumption,
        voltage, // добавляем voltage
        current, // добавляем current
        frequency, // добавляем frequency
      });
      res.status(201).send({ message: "Historical data added" });
    } catch (error) {
      res.status(500).send({ error: "Failed to add historical data" });
    }
  }

  async getRecordByEnergyResource(req: Request, res: Response): Promise<void> {
    const { energyResourceId } = req.params;
    try {
      const record = await this.service.getRecordByEnergyResourceId(
        energyResourceId
      );
      res.status(200).send(record);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Failed to fetch record by energy resource" });
    }
  }

  async getRecordsByDateRange(req: Request, res: Response): Promise<void> {
    const { start, end } = req.query;
    try {
      const records = await this.service.getRecordsByDateRange(
        start as string,
        end as string
      );
      res.status(200).send(records);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch records by date range" });
    }
  }

  async deleteRecord(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      await this.service.deleteRecordById(id);
      res.status(200).send({ message: `Record ${id} deleted.` });
    } catch (error) {
      res.status(500).send({ error: "Failed to delete record" });
    }
  }

  async updateConsumption(req: Request, res: Response): Promise<void> {
    const { id, newConsumption } = req.body;
    try {
      await this.service.updateConsumptionById(id, newConsumption);
      res
        .status(200)
        .send({ message: `Consumption for record ${id} updated.` });
    } catch (error) {
      res.status(500).send({ error: "Failed to update consumption" });
    }
  }

  async getAverageConsumption(req: Request, res: Response): Promise<void> {
    const { energyResourceId } = req.params;
    try {
      const average = await this.service.getAverageConsumption(
        energyResourceId
      );
      res.status(200).send({ energyResourceId, averageConsumption: average });
    } catch (error) {
      res
        .status(500)
        .send({ error: "Failed to calculate average consumption" });
    }
  }
}
