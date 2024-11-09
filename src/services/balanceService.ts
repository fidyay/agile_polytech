import { db } from "../utils/database";

export class BalanceService {
  async balanceResources(): Promise<void> {
    const totalCapacity = db.data.energyResources.reduce((acc, resource) => {
      return resource.isActive ? acc + resource.capacity : acc;
    }, 0);

    console.log(`Total capacity of active resources: ${totalCapacity} units`);
  }

  async manualAdjustResource(id: string, newCapacity: number): Promise<void> {
    const resource = db.data.energyResources.find((r) => r.id === id);
    if (resource) {
      resource.capacity = newCapacity;
      await db.write();
      console.log(`Resource ${id} capacity updated to ${newCapacity}`);
    } else {
      console.log(`Resource with ID ${id} not found`);
    }
  }
}
