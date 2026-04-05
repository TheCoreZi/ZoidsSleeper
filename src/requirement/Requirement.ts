export interface Requirement {
  hint(): string;
  isCompleted(): boolean;
  progress(): number;
  requiredValue: number;
}
