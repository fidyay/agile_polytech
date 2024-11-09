import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import { join } from "path";
import { EnergyResource } from "../models/energyResource";

type Data = {
  energyResources: Array<EnergyResource>;
};

const file = join(__dirname, "../db/db.json");
let db: Low<Data>;

async function initDB() {
  db = await JSONFilePreset<Data>(file, { energyResources: [] });
}

export { db, initDB };
