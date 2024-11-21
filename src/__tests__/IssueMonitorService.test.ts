import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { IssueMonitorService } from "../services/issueMonitorService.js";
import { NotificationService } from "../services/notificationService.js";
import { IssueDetector } from "../services/issueDetector.js";

// Mock dependencies
vi.mock("../services/notificationService.js", () => ({
  NotificationService: {
    notifyIssues: vi.fn(),
  },
}));

vi.mock("../services/issueDetector.js", () => ({
  IssueDetector: {
    detectCriticalIssues: vi.fn(),
  },
}));

describe("IssueMonitorService", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks before each test to reset state
  });

  it("should notify issues if critical issues are detected", async () => {
    const mockIssues = ["Critical Issue 1", "Critical Issue 2"];
    IssueDetector.detectCriticalIssues.mockReturnValue(mockIssues);

    await IssueMonitorService.checkAndNotify();

    expect(NotificationService.notifyIssues).toHaveBeenCalledWith(mockIssues);
    expect(NotificationService.notifyIssues).toHaveBeenCalledTimes(1);
  });

  it("should log no issues if no critical issues are detected", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    IssueDetector.detectCriticalIssues.mockReturnValue([]);

    await IssueMonitorService.checkAndNotify();

    expect(NotificationService.notifyIssues).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("No critical issues detected.");

    logSpy.mockRestore();
  });
});
