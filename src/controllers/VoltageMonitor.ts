import { Low } from "lowdb/lib/core/Low";
import { HistoricalData } from "../models/historicalData.js";
import { DatabaseRepository } from "../repositories/databaseRepository.js";
import { EnergyResource } from "../models/energyResource";

// Новый класс для мониторинга напряжения, интегрированный с существующей системой
export class VoltageMonitor {
  constructor(private db: Low<any>) {}

  // Генерация случайных данных для напряжения и силы тока
  private generateRandomData(): HistoricalData {
    const voltage = parseFloat((Math.random() * (240 - 220) + 220).toFixed(2)); // от 220 до 240 Вольт
    const current = parseFloat((Math.random() * (20 - 5) + 5).toFixed(2)); // от 5 до 20 Ампер
    const frequency = 50; // Фиксированная частота 50 Гц
    const consumption = parseFloat((voltage * current).toFixed(2)); // Расчет потребления
    const energyResourceId = "default"; // Примерное значение для energyResourceId, можно менять

    return {
      id: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      energyResourceId,
      consumption,
      voltage,
      current,
      frequency,
    };
  }

  // Метод для добавления данных в историческую базу данных
  private async addMeasurement(data: HistoricalData): Promise<void> {
    try {
      await DatabaseRepository.saveHistoricalRecord(data); // Использование репозитория для записи
    } catch (error) {
      console.error("Error adding measurement:", error);
    }
  }

  // Метод для запуска мониторинга
  start(interval: number): void {
    setInterval(async () => {
      const data = this.generateRandomData();

      // Сохраняем данные в базу через addMeasurement
      await this.addMeasurement(data);

      // Логируем данные для наглядности
      console.log(
        `[${data.timestamp}] Voltage: ${data.voltage}V, Current: ${data.current}A, Frequency: ${data.frequency}Hz, Consumption: ${data.consumption}W`
      );
    }, interval);
  }
}
