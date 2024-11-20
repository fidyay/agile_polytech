import { describe, it, vi, expect } from "vitest";
import { BalanceService } from "../services/balanceService";
import { ResourceManager } from "../utils/resourceManager";

vi.mock("../utils/database", () => ({
  db: {
    data: {
      energyResources: [
        { id: "1", capacity: 100, isActive: true },
        { id: "2", capacity: 200, isActive: false },
        { id: "3", capacity: 300, isActive: true },
      ],
    },
  },
}));

vi.mock("../utils/resourceManager", () => ({
  ResourceManager: {
    adjustResourceCapacity: vi.fn(),
  },
}));

describe("BalanceService", () => {
  const balanceService = new BalanceService();

  it("повинен вивести в консоль загальну ємність активних ресурсів", async () => {
    const consoleSpy = vi.spyOn(console, "log");

    await balanceService.balanceResources();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Total capacity of active resources: 400 units"
    );

    consoleSpy.mockRestore();
  });

  it("повинен викликати adjustResourceCapacity з правильними параметрами", async () => {
    const id = "1";
    const newCapacity = 150;

    await balanceService.manualAdjustResource(id, newCapacity);

    expect(ResourceManager.adjustResourceCapacity).toHaveBeenCalledWith(
      id,
      newCapacity
    );
  });
});
