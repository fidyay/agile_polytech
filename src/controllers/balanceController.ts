import { Request, Response } from "express";
import { BalanceService } from "../services/balanceService";

const balanceService = new BalanceService();

export const getBalance = async (req: Request, res: Response) => {
  try {
    await balanceService.balanceResources();
    res.status(200).send({ message: "Balancing complete" });
  } catch (error) {
    res.status(500).send({ error: "Balancing error" });
  }
};

export const adjustResource = async (req: Request, res: Response) => {
  const { id, newCapacity } = req.body;
  try {
    await balanceService.manualAdjustResource(id, newCapacity);
    res.status(200).send({ message: `Resource ${id} adjusted` });
  } catch (error) {
    res.status(500).send({ error: "Adjustment error" });
  }
};
