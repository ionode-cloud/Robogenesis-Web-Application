import dotenv from 'dotenv';
dotenv.config();

export const ADMIN_CONFIG = {
  defaultEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@robogenesis.com',
  defaultPassword: process.env.DEFAULT_ADMIN_PASSWORD || '123456',
  name: process.env.DEFAULT_ADMIN_NAME || 'Robogenesis Administrator',
  role: process.env.DEFAULT_ADMIN_ROLE || 'Root Administrator',
  labAccess: process.env.DEFAULT_ADMIN_LAB_ACCESS || 'Full System Root',
  jwtSecret: process.env.JWT_SECRET || 'robogenesis_ultra_secure_jwt_secret_token_2026_xyz!#',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
};
