import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import routes from './routes';
import errorHandler from './middlewares/error-handler.middleware';
import notFound from './middlewares/not-found.middleware';

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint (before API prefix)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Service is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use(config.apiPrefix, routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;

