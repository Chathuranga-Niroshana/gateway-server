import dotenv from 'dotenv'
dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET;
export const PORT = process.env.PORT;

export const SUPERADMIN_EMAIL = process.env.superadminEmail
export const SUPERADMIN_NAME = process.env.superadminName
export const SUPERADMIN_PASSWORD = process.env.superadminPassword