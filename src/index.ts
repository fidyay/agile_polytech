import express from "express";
import { getBalance, adjustResource } from "./controllers/balanceController.js";
import {
  getHistoricalData,
  addHistoricalData,
  getRecordByEnergyResource,
  getRecordsByDateRange,
  deleteRecord,
  updateConsumption,
  getAverageConsumption,
} from "./controllers/historicalDataController.js";
import { initDB } from "./utils/database.js";

const app = express();
const DEFAULT_SERVER_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_SERVER_PORT;

app.use(express.json());

// Ініціалізація бази даних
initDB();

// Роут для отримання історичних даних
app.get("/historical-data", getHistoricalData);

// Роут для додавання історичного нового запису
app.post("/historical-data", addHistoricalData);

// Роут для отримання історичних записів за енергією
app.get("/historical-data/resource/:energyResourceId", getRecordByEnergyResource);

// Роут для отримання історичних записів за датою
app.get("/historical-data/range", getRecordsByDateRange);

// Роут для видалення історичного запису
app.delete("/historical-data/:id", deleteRecord);

// Роут для оновлення історичного запису
app.put("/historical-data/consumption", updateConsumption);

// Роут для отримання середньої потреби
app.get("/historical-data/average/:energyResourceId", getAverageConsumption);

// Роут для автоматичного балансування ресурсів
app.get("/balance", getBalance);

// Роут для ручного коригування ресурсу
app.post("/adjust", adjustResource);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
