import type { DemoRun } from "../shared/control-contract";
import type { Actor, ControlState } from "./types";

export const DEMO_STEP_INTERVAL_MS = 2000;
export const DEMO_STEPS = [
  { title: "Seeded report received", detail: "SIMULATED X report: 20°C displays as 20°F instead of 68°F.", phase: "RECEIVED" },
  { title: "Report triaged", detail: "Deterministic fixture triage routes the conversion defect to engineering resolution.", phase: "TRIAGING" },
  { title: "Defect reproduced", detail: "SIMULATED reproduction records 20°F actual versus 68°F expected.", phase: "INVESTIGATING" },
  { title: "Build approval requested", detail: "A scoped Build request binds the weather repository, base revision, and lib/temperature.ts.", phase: "AWAITING_BUILD" },
  { title: "Simulated Build approved", detail: "Simulated engineer approves the exact Build scope. No Slack decision occurred.", phase: "BUILDING" },
  { title: "Candidate built", detail: "SIMULATED patch corrects the Celsius-to-Fahrenheit formula; candidate identity is recorded.", phase: "VERIFYING_CANDIDATE" },
  { title: "Candidate verified", detail: "SIMULATED protected checks cover 20°C, 0°C, −40°C, 100°C, repeated toggles, and default units.", phase: "VERIFYING_CANDIDATE" },
  { title: "Go approval requested", detail: "The exact candidate, check evidence, and customer reply are bound to a Go request.", phase: "AWAITING_GO" },
  { title: "Simulated Go approved", detail: "Simulated marketer approves the exact candidate and reply. No Slack decision occurred.", phase: "RELEASING" },
  { title: "Release promoted", detail: "SIMULATED promotion records the approved candidate. No repository or deployment provider was changed.", phase: "VERIFYING_LIVE" },
  { title: "Live behavior verified", detail: "SIMULATED deployment identity and 20°C → 68°F behavior match the approved candidate.", phase: "READY_TO_PUBLISH" },
  { title: "Approved reply sending", detail: "The publication guard checks the exact approval and fresh simulated evidence before the fixture send.", phase: "PUBLISHING" },
  { title: "Reply confirmed", detail: "A SIMULATED receipt confirms the fixture reply. No public message was sent.", phase: "COMPLETED" },
] as const;

export const SIMULATED_DEMO_ACTOR: Actor = { id: "simulated-demo-run", name: "Simulated demo runner", roles: ["engineer", "marketer"] };

export function recordDemoStep(run: DemoRun, now: number): void {
  const step = DEMO_STEPS[run.stepIndex];
  run.events.push({ id: `${run.runId}:step:${run.stepIndex + 1}`, at: now, ...step });
  run.stepIndex++;
  run.stepLabel = step.title;
  run.updatedAt = now;
  run.status = run.stepIndex === run.totalSteps ? "completed" : "running";
  run.nextAt = run.status === "running" ? now + DEMO_STEP_INTERVAL_MS : null;
  if (run.status === "completed") run.completedAt = now;
}

export function stopDemoRun(state: ControlState, now: number, reason: string, phase: string): void {
  const run = state.demoRun;
  if (!run || run.status === "completed") return;
  run.status = "completed"; run.stopReason = reason; run.nextAt = null; run.updatedAt = now; run.completedAt = now;
  run.stepLabel = reason === "case_canceled" ? "Demo case canceled" : "Demo run stopped";
  run.events.push({ id: `${run.runId}:stop:${now}`, at: now, title: run.stepLabel, detail: reason, phase });
}
