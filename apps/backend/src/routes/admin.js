import express from 'express';
import { prisma } from '@propgroup/db';
import { authenticateToken, requireAdmin, requireSuperAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalInquiries,
      totalFavorites,
      recentUsers,
      recentInquiries,
      userStats,
      propertyStats
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.propertyInquiry.count(),
      prisma.favoriteProperty.count(),
      
      // Recent users (last 7 days)
      prisma.user.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Recent inquiries (last 7 days)
      prisma.propertyInquiry.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // User statistics
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      
      // Property statistics
      prisma.property.groupBy({
        by: ['country'],
        _count: { country: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProperties,
          totalInquiries,
          totalFavorites
        },
        recent: {
          users: recentUsers,
          inquiries: recentInquiries
        },
        statistics: {
          usersByRole: userStats,
          propertiesByCountry: propertyStats
        }
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch admin statistics'
    });
  }
});

// Get audit logs (admin only)
router.get('/audit-logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, action, adminId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (action) where.action = action;
    if (adminId) where.adminId = adminId;

    const [auditLogs, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.adminAuditLog.count({ where })
    ]);

    res.json({
      success: true,
      data: auditLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch audit logs'
    });
  }
});

// Create super admin (super admin only)
router.post('/create-super-admin', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create super admin
    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerifiedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    // Log admin action
    await logAdminAction('CREATE_SUPER_ADMIN', 'user', superAdmin.id, {
      email,
      createdBy: req.user.email
    }, req);

    res.status(201).json({
      success: true,
      message: 'Super admin created successfully',
      data: superAdmin
    });

  } catch (error) {
    console.error('Create super admin error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create super admin'
    });
  }
});

// Get system health
router.get('/health', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    };

    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Unhealthy',
      message: 'System health check failed',
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error.message
      }
    });
  }
});

export default router;
