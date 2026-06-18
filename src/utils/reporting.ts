import { ReportingApi } from "@reportportal/agent-js-playwright";

export type TestType = "positive" | "negative";
export type TestPriority = "P0" | "P1" | "P2";
export type TestRisk = "high" | "medium" | "low";
export type TestArea = "ecommerce" | "support" | "social-proof";
export type TestFeature = "cart" | "checkout" | "contact" | "review";

export interface RpTestAttributes {
  feature: TestFeature;
  type: TestType;
  priority: TestPriority;
  risk: TestRisk;
  area: TestArea;
  owner?: string;
  testCaseId?: string;
  description?: string;
}

export function applyRpAttributes(attrs: RpTestAttributes): void {
  const owner = attrs.owner ?? "qa-core";

  ReportingApi.addAttributes([
    { key: "feature", value: attrs.feature },
    { key: "type", value: attrs.type },
    { key: "priority", value: attrs.priority },
    { key: "risk", value: attrs.risk },
    { key: "area", value: attrs.area },
    { key: "owner", value: owner }
  ]);

  if (attrs.testCaseId) {
    ReportingApi.setTestCaseId(attrs.testCaseId);
  }

  if (attrs.description) {
    ReportingApi.setDescription(attrs.description);
  }
}
