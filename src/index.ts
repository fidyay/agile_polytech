import express from "express";
import { getBalance, adjustResource } from "./controllers/balanceController.js";
import { db, initDB } from "./utils/database.js";
import { HistoricalDataController } from "./controllers/historicalDataController.js";
import { HistoricalDataService } from "./services/historicalDataService.js";
import { IssueMonitorService } from "./services/issueMonitorService.js";
import { VoltageMonitor } from "./controllers/VoltageMonitor.js"; // Путь к вашему классу

const voltageMonitor = new VoltageMonitor(db);

// Запуск мониторинга напряжения каждые 10 секунд (например)
voltageMonitor.start(10000); // Интервал в миллисекундах

const app = express();
const DEFAULT_SERVER_PORT = 3000;
const PORT = process.env.PORT || DEFAULT_SERVER_PORT;

app.use(express.json());

// Ініціалізація бази даних
initDB().then(() => {
  console.log("Database initialized.");
});

const historicalDataController = new HistoricalDataController(
  new HistoricalDataService(db)
);

// Роут для отримання історичних даних
app.get("/historical-data", historicalDataController.getAllHistoricalData);

// Роут для додавання історичного нового запису
app.post("/historical-data", historicalDataController.addHistoricalData);

// Роут для отримання історичних записів за енергією
app.get(
  "/historical-data/resource/:energyResourceId",
  historicalDataController.getRecordByEnergyResource
);

// Роут для отримання історичних записів за датою
app.get(
  "/historical-data/range",
  historicalDataController.getRecordsByDateRange
);

// Роут для видалення історичного запису
app.delete("/historical-data/:id", historicalDataController.deleteRecord);

// Роут для оновлення історичного запису
app.put(
  "/historical-data/consumption",
  historicalDataController.updateConsumption
);

// Роут для отримання середньої потреби
app.get(
  "/historical-data/average/:energyResourceId",
  historicalDataController.getAverageConsumption
);

// Роутинг для управління балансом
app.get("/balance", getBalance);
app.post("/adjust", adjustResource);

// Запуск автоматичного моніторингу ресурсів
setInterval(async () => {
  console.log("Running automated resource monitoring...");
  try {
    await IssueMonitorService.checkAndNotify();
  } catch (error) {
    console.error("Error during automated resource monitoring:", error);
  }
}, 10 * 60 * 1000); // Перевірка кожні 10 хвилин

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
