// repositories/databaseRepository.ts
import { db } from "../utils/database.js";
import { EnergyResource } from "../models/energyResource.js";

export class DatabaseRepository {
  static getActiveResources(): EnergyResource[] {
    return db.data.energyResources.filter((resource) => resource.isActive);
  }

  static findResourceById(id: string): EnergyResource | undefined {
    return db.data.energyResources.find((resource) => resource.id === id);
  }

  static async saveHistoricalRecord(record: any): Promise<void> {
    db.data.historicalData.push(record);
    await db.write();
  }

  static async updateResourceCapacity(id: string, capacity: number): Promise<void> {
    const resource = this.findResourceById(id);
    if (resource) {
      resource.capacity = capacity;
      await db.write();
    }
  }
}
