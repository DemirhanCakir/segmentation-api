import 'dotenv/config';
import express from 'express';
import path from 'path';
import routes from './routes';

const app = express();

// Parse JSON bodies
app.use(express.json());

// GET /evaluate serves the test UI
app.get('/evaluate', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'test.html'));
});

// Serve static files from public/ directory at /evaluate for GET requests
app.use('/evaluate', express.static(path.join(__dirname, '..', 'public')));

// Mount API routes
app.use(routes);

// Handle JSON parse errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON in request body' });
    return;
  }
  next(err);
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Segmentation service running on port ${PORT}`);
});
