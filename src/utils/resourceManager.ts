import { db } from "../utils/database.js";
import { EnergyResource } from "../models/energyResource.js";

export class ResourceManager {
  static findResourceById(id: string): EnergyResource | undefined {
    return db.data.energyResources.find((resource) => resource.id === id);
  }

  static async adjustResourceCapacity(
    id: string,
    newCapacity: number
  ): Promise<void> {
    const resourceToAdjust = this.findResourceById(id);
    if (resourceToAdjust) {
      resourceToAdjust.capacity = newCapacity;
      await db.write();
      console.log(`Resource ${id} capacity updated to ${newCapacity}`);
    } else {
      console.log(`Resource with ID ${id} not found`);
    }
  }
}
