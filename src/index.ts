import express from "express";
import { getBalance, adjustResource } from "./controllers/balanceController.js";
import { db, initDB } from "./utils/database.js";
import { HistoricalDataController } from "./controllers/historicalDataController.js";
import { HistoricalDataService } from "./services/historicalDataService.js";

const app = express();
const DEFAULT_SERVER_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_SERVER_PORT;

app.use(express.json());

// Ініціалізація бази даних
initDB();

const historicalDataController = new HistoricalDataController(new HistoricalDataService(db));

// Роут для отримання історичних даних
app.get("/historical-data", historicalDataController.getAllHistoricalData);

// Роут для додавання історичного нового запису
app.post("/historical-data", historicalDataController.addHistoricalData);

// Роут для отримання історичних записів за енергією
app.get("/historical-data/resource/:energyResourceId", historicalDataController.getRecordByEnergyResource);

// Роут для отримання історичних записів за датою
app.get("/historical-data/range", historicalDataController.getRecordsByDateRange);

// Роут для видалення історичного запису
app.delete("/historical-data/:id", historicalDataController.deleteRecord);

// Роут для оновлення історичного запису
app.put("/historical-data/consumption", historicalDataController.updateConsumption);

// Роут для отримання середньої потреби
app.get("/historical-data/average/:energyResourceId", historicalDataController.getAverageConsumption);

// Роут для автоматичного балансування ресурсів
app.get("/balance", getBalance);

// Роут для ручного коригування ресурсу
app.post("/adjust", adjustResource);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
