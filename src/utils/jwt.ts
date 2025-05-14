import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env'

export const generatedToken = (payload: object) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export const verifyToken = (token: string): { userId: number; role: number; companyId?: number } => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: number; companyId?: number };
};