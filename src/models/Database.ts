import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export type OperatorData = {
  timestamp: string;
  voltage: number; // Напряжение в Вольтах
  current: number; // Ток в Амперах
  frequency: number; // Частота в Герцах
};

type Data = {
  measurements: OperatorData[];
  loads?: OperatorData[];
};

export class Database {
  private db: Low<Data>;

  constructor(private filePath: string) {
    const adapter = new JSONFile<Data>(this.filePath);
    this.db = new Low(adapter, { measurements: [], loads: [] });
  }

  async init(): Promise<void> {
    await this.db.read();
    this.db.data ||= { measurements: [], loads: [] };
    this.db.data.measurements ||= [];
    this.db.data.loads ||= [];
    await this.db.write();
  }

  async addMeasurement(data: OperatorData): Promise<void> {
    this.db.data!.measurements.push(data);
    await this.db.write();
  }

  async addLoadEntry(data: OperatorData): Promise<void> {
    this.db.data!.loads!.push(data);
    await this.db.write();
  }

  getAllMeasurements(): OperatorData[] {
    return this.db.data!.measurements;
  }

  // Добавляем метод getAllLoads
  getAllLoads(): OperatorData[] {
    return this.db.data!.loads || [];
  }
}
