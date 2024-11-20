import { Database, OperatorData } from "../models/Database";

export class SystemMonitor {
  constructor(private db: Database) {}

  // Генерация случайных данных для напряжения и силы тока
  private generateRandomData(): OperatorData {
    const voltage = parseFloat((Math.random() * (240 - 220) + 220).toFixed(2)); // от 220 до 240 Вольт
    const current = parseFloat((Math.random() * (20 - 5) + 5).toFixed(2)); // от 5 до 20 Ампер
    const frequency = 50; // Фиксированная частота 50 Гц

    return {
      timestamp: new Date().toISOString(),
      voltage,
      current,
      frequency,
    };
  }

  // Имитация получения данных и запись их в БД
  start(interval: number): void {
    setInterval(async () => {
      const data = this.generateRandomData();

      // Сохраняем данные в базу
      await this.db.addMeasurement(data);

      // Логируем данные для наглядности
      console.log(
        `[${data.timestamp}] Voltage: ${data.voltage}V, Current: ${data.current}A, Frequency: ${data.frequency}Hz`
      );
    }, interval);
  }
}
