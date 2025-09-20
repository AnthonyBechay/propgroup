import express from 'express';
import { z } from 'zod';
import { prisma } from '@propgroup/db';
import { authenticateToken, requireAdmin, requireSuperAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const updateRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN'])
});

const banUserSchema = z.object({
  reason: z.string().min(1, 'Ban reason is required')
});

const inviteAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN'])
});

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          country: true,
          role: true,
          isActive: true,
          bannedAt: true,
          bannedReason: true,
          emailVerifiedAt: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              favoriteProperties: true,
              propertyInquiries: true,
              ownedProperties: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch users'
    });
  }
});

// Get single user (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        role: true,
        investmentGoals: true,
        isActive: true,
        bannedAt: true,
        bannedBy: true,
        bannedReason: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        invitedBy: true,
        invitationAcceptedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            favoriteProperties: true,
            propertyInquiries: true,
            ownedProperties: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user'
    });
  }
});

// Update user role (super admin only)
router.put('/:id/role', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = updateRoleSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Prevent self-role change
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot change your own role'
      });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });

    // Log admin action
    await logAdminAction('UPDATE_ROLE', 'user', id, {
      oldRole: existingUser.role,
      newRole: role,
      userEmail: existingUser.email
    }, req);

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: updatedUser
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Update user role error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update user role'
    });
  }
});

// Ban user (admin only)
router.post('/:id/ban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = banUserSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, isActive: true, bannedAt: true }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Prevent self-ban
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot ban yourself'
      });
    }

    // Check if already banned
    if (existingUser.bannedAt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User is already banned'
      });
    }

    // Only super admins can ban other admins
    if ((existingUser.role === 'ADMIN' || existingUser.role === 'SUPER_ADMIN') && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only super admins can ban other admins'
      });
    }

    // Ban user
    const bannedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        bannedAt: new Date(),
        bannedBy: req.user.id,
        bannedReason: reason
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        bannedAt: true,
        bannedReason: true
      }
    });

    // Log admin action
    await logAdminAction('BAN_USER', 'user', id, {
      reason,
      userEmail: existingUser.email,
      userRole: existingUser.role
    }, req);

    res.json({
      success: true,
      message: 'User banned successfully',
      data: bannedUser
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Ban user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to ban user'
    });
  }
});

// Unban user (admin only)
router.post('/:id/unban', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, bannedAt: true, bannedReason: true }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Check if user is banned
    if (!existingUser.bannedAt) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User is not banned'
      });
    }

    // Only super admins can unban other admins
    if ((existingUser.role === 'ADMIN' || existingUser.role === 'SUPER_ADMIN') && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only super admins can unban other admins'
      });
    }

    // Unban user
    const unbannedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        bannedAt: null,
        bannedBy: null,
        bannedReason: null
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        bannedAt: true
      }
    });

    // Log admin action
    await logAdminAction('UNBAN_USER', 'user', id, {
      previousBanReason: existingUser.bannedReason,
      userEmail: existingUser.email,
      userRole: existingUser.role
    }, req);

    res.json({
      success: true,
      message: 'User unbanned successfully',
      data: unbannedUser
    });

  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to unban user'
    });
  }
});

// Delete user (super admin only)
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Prevent self-deletion
    if (id === req.user.id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot delete yourself'
      });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    // Log admin action
    await logAdminAction('DELETE_USER', 'user', id, {
      userEmail: existingUser.email,
      userRole: existingUser.role
    }, req);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete user'
    });
  }
});

// Invite admin (super admin only)
router.post('/invite', authenticateToken, requireSuperAdmin, async (req, res) => {
  try {
    const { email, role } = inviteAdminSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'User with this email already exists'
      });
    }

    // Create user with admin role (they'll need to set password on first login)
    const newAdmin = await prisma.user.create({
      data: {
        email,
        role,
        invitedBy: req.user.id,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        invitedBy: true,
        createdAt: true
      }
    });

    // Log admin action
    await logAdminAction('INVITE_ADMIN', 'user', newAdmin.id, {
      email,
      role,
      invitedBy: req.user.email
    }, req);

    // TODO: Send invitation email with magic link
    // await sendAdminInvitationEmail(email, role);

    res.status(201).json({
      success: true,
      message: 'Admin invited successfully',
      data: newAdmin
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Invite admin error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to invite admin'
    });
  }
});

export default router;
