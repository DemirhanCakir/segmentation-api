export interface User {
  id: string;
  level: number;
  country: string;
  first_session: number;
  last_session: number;
  purchase_amount: number;
  last_purchase_at: number;
}

export interface EvaluateRequest {
  user: User;
  segments: Record<string, string>;
}

export interface EvaluateResponse {
  results: Record<string, boolean>;
}

export interface ErrorResponse {
  error: string;
}

export const USER_FIELDS: (keyof User)[] = [
  'id',
  'level',
  'country',
  'first_session',
  'last_session',
  'purchase_amount',
  'last_purchase_at',
];

export const STRING_FIELDS: (keyof User)[] = ['id', 'country'];
export const INTEGER_FIELDS: (keyof User)[] = [
  'level',
  'first_session',
  'last_session',
  'purchase_amount',
  'last_purchase_at',
];
