import express from 'express';
import cors from 'cors';
import photosRouter from './routes/photos'
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET'],
}));

app.use(express.json());

// API Routes
app.use('/v1/api/photos', photosRouter);

app.listen(PORT, () => {
  logger.info(`MetaPhoto WebApp API running on port ${PORT}`);
});

export default app;