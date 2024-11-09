import express from "express";
import { getBalance, adjustResource } from "./controllers/balanceController";
import { initDB } from "./utils/database";

const app = express();
const PORT = 3000;

app.use(express.json());

// Ініціалізація бази даних
initDB();

// Роут для автоматичного балансування ресурсів
app.get("/balance", getBalance);

// Роут для ручного коригування ресурсу
app.post("/adjust", adjustResource);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
