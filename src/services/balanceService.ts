import { db } from "../utils/database.js";
import { ResourceManager } from "../utils/resourceManager.js";

export class BalanceService {
  async balanceResources(): Promise<void> {
    console.log(
      `Total capacity of active resources: ${this.calculateTotalCapacity()} units`
    );
  }

  async manualAdjustResource(id: string, newCapacity: number): Promise<void> {
    await ResourceManager.adjustResourceCapacity(id, newCapacity);
  }

  private calculateTotalCapacity(): number {
    return db.data.energyResources.reduce(
      (acc, resource) => (resource.isActive ? acc + resource.capacity : acc),
      0
    );
  }
}
