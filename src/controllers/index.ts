import { Request, Response } from "express";
import { Database } from "../models/Database.js";

export class ApiController {
  constructor(private db: Database) {}

  async addMeasurement(req: Request, res: Response): Promise<void> {
    const { voltage, current, frequency } = req.body;

    if (
      typeof voltage !== "number" ||
      typeof current !== "number" ||
      typeof frequency !== "number"
    ) {
      res.status(400).send("Некорректные данные");
      return;
    }

    const newMeasurement = {
      timestamp: new Date().toISOString(),
      voltage,
      current,
      frequency,
    };

    await this.db.addMeasurement(newMeasurement);
    res.status(201).send("Данные успешно добавлены");
  }

  getAllMeasurements(req: Request, res: Response): void {
    res.json(this.db.getAllMeasurements());
  }

  getAllLoads(req: Request, res: Response): void {
    res.json(this.db.getAllLoads());
  }
}
