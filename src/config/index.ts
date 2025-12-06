import dotenv from 'dotenv';
import { Config } from '../types';

dotenv.config();

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  database: {
    url: process.env.DATABASE_URL || 'mysql://user:password@localhost:3306/mydb',
  },
};

export default config;

