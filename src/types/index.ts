export interface CalculationRecord {
  id: number;
  expression: string;
  result: string;
  createdAt: string;
}

export interface CalculationPayload {
  expression: string;
  result: string;
}

export type ButtonType = 'number' | 'operator' | 'action' | 'equals' | 'special';

export interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
  span?: number;
}
