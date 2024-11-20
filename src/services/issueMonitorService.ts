// services/issueMonitorService.ts
import { IssueDetector } from "./issueDetector.js";
import { NotificationService } from "./notificationService.js";

export class IssueMonitorService {
  static async checkAndNotify(): Promise<void> {
    const issues = IssueDetector.detectCriticalIssues();
    if (issues.length > 0) {
      await NotificationService.notifyIssues(issues);
    } else {
      console.log("No critical issues detected.");
    }
  }
}
