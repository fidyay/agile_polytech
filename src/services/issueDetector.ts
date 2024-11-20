// services/issueDetector.ts
import { DatabaseRepository } from "../repositories/databaseRepository.js";

export class IssueDetector {
  static detectCriticalIssues(): string[] {
    const activeResources = DatabaseRepository.getActiveResources();
    return activeResources
      .filter((resource) => resource.capacity < 10)
      .map(
        (resource) =>
          `Resource ${resource.name} (ID: ${resource.id}) has critically low capacity (${resource.capacity} units).`
      );
  }
}
