import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { EnergyResource } from "../models/energyResource.js";
import { HistoricalData } from "../models/historicalData.js";

type Data = {
  energyResources: Array<EnergyResource>;
  historicalData: Array<HistoricalData>;
};

const file = "db.json";
let db: Low<Data>;

async function initDB() {
  db = await JSONFilePreset<Data>(file, { energyResources: [], historicalData: [] });
}

export { db, initDB, Data };
