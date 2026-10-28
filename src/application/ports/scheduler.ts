export interface Scheduler {
  wait(ms: number): Promise<void>;
}
