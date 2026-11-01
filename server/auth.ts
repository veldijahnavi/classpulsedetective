/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { User, StudentProfile, TeacherProfile, UserRole } from './types.js';

export interface SessionData {
  token: string;
  userId: string;
  loginId: string;
  name: string;
  role: UserRole;
  expiresAt: number;
}

// In-memory session store backed by database persistence
const activeSessions = new Map<string, SessionData>();

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derived = crypto.scryptSync(password, salt, 64);
    const stored = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(derived, stored);
  } catch (err) {
    return false;
  }
}

export function createSession(user: User): string {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionDuration = 1000 * 60 * 60 * 24; // 24 hours
  const expiresAt = Date.now() + sessionDuration;

  activeSessions.set(token, {
    token,
    userId: user.id,
    loginId: user.loginId,
    name: user.name,
    role: user.role,
    expiresAt,
  });

  return token;
}

export function invalidateSession(token: string): void {
  activeSessions.delete(token);
}

export function getSession(token: string): SessionData | null {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      userSession?: SessionData;
      userProfile?: User;
      studentProfile?: StudentProfile;
      teacherProfile?: TeacherProfile;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-session-token'] as string);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. No active session token found.' });
  }

  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  req.userSession = session;
  next();
}

export function requireRole(allowedRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userSession) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.userSession.role !== allowedRole) {
      return res.status(403).json({ 
        error: `Forbidden. This portal requires a ${allowedRole} account, but current session is a ${req.userSession.role}.` 
      });
    }

    next();
  };
}
