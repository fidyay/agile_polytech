// services/notificationService.ts
import { DatabaseRepository } from "../repositories/databaseRepository.js";

export class NotificationService {
  static async logIssue(message: string): Promise<void> {
    console.log(`[ISSUE]: ${message}`);
    await DatabaseRepository.saveHistoricalRecord({
      id: `issue-${Date.now()}`,
      date: new Date().toISOString(),
      description: message,
      energyResourceId: null,
      consumption: null,
    });
  }

  static async notifyIssues(messages: string[]): Promise<void> {
    for (const message of messages) {
      await this.logIssue(message);
    }
  }
}
