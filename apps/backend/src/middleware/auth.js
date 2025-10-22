// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { prisma } from '@propgroup/db';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: any;
}

// Middleware principal pour authentification
export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Récupère token depuis cookie ou header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized', message: 'No authentication token provided' });
    }

    // Vérifie le token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Récupère l'utilisateur dans la DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        bannedAt: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User not found' });
    }

    if (!user.isActive || user.bannedAt) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Account inactive or banned' });
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized', message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: 'Authentication failed' });
  }
};

// Vérification ADMIN
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }
  if (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
  }
  next();
};

// Vérification SUPER ADMIN
export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
  }
  if (req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden', message: 'Super admin access required' });
  }
  next();
};

// Logger d'action admin
export const logAdminAction = async (
  action: string,
  targetType?: string,
  targetId?: string,
  details?: any,
  req?: AuthRequest
) => {
  try {
    if (!req?.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN')) return;

    await prisma.adminAuditLog.create({
      data: {
        adminId: req.user.id,
        action,
        targetType,
        targetId,
        details,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || ''
      }
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};
