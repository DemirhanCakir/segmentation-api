import { EvaluateRequest, USER_FIELDS, STRING_FIELDS, INTEGER_FIELDS } from './types';

export function validateRequest(body: unknown): EvaluateRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }

  const req = body as Record<string, unknown>;

  if (!req.user || typeof req.user !== 'object') {
    throw new Error('Missing or invalid "user" field');
  }

  if (!req.segments || typeof req.segments !== 'object' || Array.isArray(req.segments)) {
    throw new Error('Missing or invalid "segments" field');
  }

  const user = req.user as Record<string, unknown>;

  // Check all required fields exist
  for (const field of USER_FIELDS) {
    if (!(field in user)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate string fields
  for (const field of STRING_FIELDS) {
    const value = user[field];
    if (typeof value !== 'string') {
      throw new Error(`Field "${field}" must be a string`);
    }
    if (value === '') {
      throw new Error(`Field "${field}" cannot be empty`);
    }
  }

  // Validate integer fields
  for (const field of INTEGER_FIELDS) {
    const value = user[field];
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      throw new Error(`Field "${field}" must be an integer`);
    }
    if (value < 0) {
      throw new Error(`Field "${field}" must be non-negative`);
    }
  }

  // Validate segments
  const segments = req.segments as Record<string, unknown>;
  if (Object.keys(segments).length === 0) {
    throw new Error('Segments object cannot be empty');
  }

  for (const [name, rule] of Object.entries(segments)) {
    if (typeof rule !== 'string') {
      throw new Error(`Segment "${name}" rule must be a string`);
    }
    if (rule.trim() === '') {
      throw new Error(`Segment "${name}" rule cannot be empty`);
    }
  }

  return {
    user: user as unknown as EvaluateRequest['user'],
    segments: segments as Record<string, string>,
  };
}
