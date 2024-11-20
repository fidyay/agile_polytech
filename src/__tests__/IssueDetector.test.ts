import { describe, it, expect, vi } from "vitest";
import { IssueDetector } from "../services/issueDetector.js";
import { DatabaseRepository } from "../repositories/databaseRepository.js";

// Mock the DatabaseRepository methods
vi.mock("../repositories/databaseRepository.js", () => ({
  DatabaseRepository: {
    getActiveResources: vi.fn(),
  },
}));

describe("IssueDetector", () => {
  it("should detect critical issues", () => {
    const mockResources = [
      { id: 1, name: "Resource A", capacity: 5 },
      { id: 2, name: "Resource B", capacity: 15 },
      { id: 3, name: "Resource C", capacity: 8 },
    ];
    DatabaseRepository.getActiveResources.mockReturnValue(mockResources);

    const issues = IssueDetector.detectCriticalIssues();

    expect(issues).toEqual([
      "Resource Resource A (ID: 1) has critically low capacity (5 units).",
      "Resource Resource C (ID: 3) has critically low capacity (8 units).",
    ]);
  });

  it("should return an empty array if no critical issues are found", () => {
    const mockResources = [
      { id: 1, name: "Resource A", capacity: 50 },
      { id: 2, name: "Resource B", capacity: 30 },
    ];
    DatabaseRepository.getActiveResources.mockReturnValue(mockResources);

    const issues = IssueDetector.detectCriticalIssues();

    expect(issues).toEqual([]);
  });
});
