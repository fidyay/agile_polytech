// file: src/controllers/historicalDataController.ts
import { Request, Response } from "express";
import { HistoricalDataService } from "../services/historicalDataService.js";

const historicalDataService = new HistoricalDataService();

export const getHistoricalData = async (req: Request, res: Response) => {
    try {
        const data = await historicalDataService.getAllHistoricalData();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch historical data" });
    }
};

export const addHistoricalData = async (req: Request, res: Response) => {
    const { id, timestamp, energyResourceId, consumption } = req.body;
    try {
        await historicalDataService.addHistoricalRecord({
            id,
            timestamp,
            energyResourceId,
            consumption,
        });
        res.status(201).send({ message: "Historical data added" });
    } catch (error) {
        res.status(500).send({ error: "Failed to add historical data" });
    }
};

export const getRecordByEnergyResource = async (req: Request, res: Response) => {
    const { energyResourceId } = req.params;
    try {
        const records = await historicalDataService.getRecordByEnergyResourceId(energyResourceId);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch records for the energy resource" });
    }
};

export const getRecordsByDateRange = async (req: Request, res: Response) => {
    const { start, end } = req.query;
    try {
        const records = await historicalDataService.getRecordsByDateRange(start as string, end as string);
        res.status(200).send(records);
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch records by date range" });
    }
};

export const deleteRecord = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await historicalDataService.deleteRecordById(id);
        res.status(200).send({ message: `Record ${id} deleted.` });
    } catch (error) {
        res.status(500).send({ error: "Failed to delete record" });
    }
};

export const updateConsumption = async (req: Request, res: Response) => {
    const { id, newConsumption } = req.body;
    try {
        await historicalDataService.updateConsumptionById(id, newConsumption);
        res.status(200).send({ message: `Consumption for record ${id} updated.` });
    } catch (error) {
        res.status(500).send({ error: "Failed to update consumption" });
    }
};

export const getAverageConsumption = async (req: Request, res: Response) => {
    const { energyResourceId } = req.params;
    try {
        const average = await historicalDataService.getAverageConsumption(energyResourceId);
        res.status(200).send({ energyResourceId, averageConsumption: average });
    } catch (error) {
        res.status(500).send({ error: "Failed to calculate average consumption" });
    }
};
