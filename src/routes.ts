import { Router, Request, Response } from 'express';
import { validateRequest } from './validator';
import { evaluateSegments } from './evaluator';
import { EvaluateResponse, ErrorResponse } from './types';

const router = Router();

router.post('/evaluate', (req: Request, res: Response<EvaluateResponse | ErrorResponse>) => {
  try {
    const { user, segments } = validateRequest(req.body);
    const results = evaluateSegments(user, segments);
    res.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

export default router;
