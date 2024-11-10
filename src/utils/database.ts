import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { EnergyResource } from "../models/energyResource.js";

type Data = {
  energyResources: Array<EnergyResource>;
};

const file = "db.json";
let db: Low<Data>;

async function initDB() {
  db = await JSONFilePreset<Data>(file, { energyResources: [] });
}

export { db, initDB };
