import express from "express";
import { WebSocketServer } from "ws";
import { Database } from "./models/Database.js";
import { ApiController } from "./controllers/index.js";
import { SystemMonitor } from "./services/SystemMonitor.js";

async function main() {
  const app = express();
  const port = 3000;
  const databasePath = "./db.json";

  const db = new Database(databasePath);
  await db.init();

  const apiController = new ApiController(db);
  const monitor = new SystemMonitor(db);
  monitor.start(5000);

  const server = app.listen(port, () => {
    console.log(`HTTP сервер запущен на http://localhost:${port}`);
  });

  const wss = new WebSocketServer({ server });
  wss.on("connection", (ws) => {
    console.log("Новое подключение WebSocket");

    ws.on("close", () => {
      console.log("Соединение закрыто");
    });
  });

  app.use(express.json());

  app.post("/data", apiController.addMeasurement.bind(apiController));
  app.get("/data", apiController.getAllMeasurements.bind(apiController));
  app.get("/loads", apiController.getAllLoads.bind(apiController));
}

main().catch((err) => console.error("Ошибка:", err));
