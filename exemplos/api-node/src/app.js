import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const ALLOWED_ORIGINS = [
  'https://leon.dev.br',
  'https://www.leon.dev.br',
  'http://localhost:5173'
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida pelo CORS: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: { code: 'ROUTE_NOT_FOUND', message: `Rota ${req.method} ${req.path} não existe.` }
  });
});

app.use(errorHandler); // sempre por último

export default app;
