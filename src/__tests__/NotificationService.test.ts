import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NotificationService } from "../services/notificationService.js";
import { DatabaseRepository } from "../repositories/databaseRepository.js";

// Mock the DatabaseRepository methods
vi.mock("../repositories/databaseRepository.js", () => ({
  DatabaseRepository: {
    saveHistoricalRecord: vi.fn(),
  },
}));

describe("NotificationService", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear all mocks before each test
  });

  it("should log an issue and save it in the database", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const message = "Test issue";

    await NotificationService.logIssue(message);

    expect(logSpy).toHaveBeenCalledWith(`[ISSUE]: ${message}`);
    expect(DatabaseRepository.saveHistoricalRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/^issue-\d+$/),
        date: expect.any(String),
        description: message,
        energyResourceId: null,
        consumption: null,
      })
    );

    logSpy.mockRestore();
  });

  it("should notify multiple issues", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const messages = ["Issue 1", "Issue 2"];

    await NotificationService.notifyIssues(messages);

    expect(logSpy).toHaveBeenCalledWith("[ISSUE]: Issue 1");
    expect(logSpy).toHaveBeenCalledWith("[ISSUE]: Issue 2");
    expect(DatabaseRepository.saveHistoricalRecord).toHaveBeenCalledTimes(2);

    logSpy.mockRestore();
  });
});
