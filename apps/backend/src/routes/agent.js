import express from 'express';
import { prisma } from '@propgroup/db';
import { authenticateToken, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// Middleware to require agent role
const requireAgentRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Agent access required'
    });
  }

  next();
};

// Get agent dashboard stats
router.get('/dashboard/stats', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const agentId = req.user.id;

    const [
      totalProperties,
      activeProperties,
      soldProperties,
      totalInquiries,
      pendingInquiries,
      totalViews,
      recentInquiries,
      topProperties
    ] = await Promise.all([
      // Total properties assigned to agent
      prisma.property.count({
        where: { agentId }
      }),

      // Active properties
      prisma.property.count({
        where: {
          agentId,
          availabilityStatus: 'AVAILABLE'
        }
      }),

      // Sold properties
      prisma.property.count({
        where: {
          agentId,
          availabilityStatus: 'SOLD'
        }
      }),

      // Total inquiries
      prisma.propertyInquiry.count({
        where: {
          property: {
            agentId
          }
        }
      }),

      // Pending inquiries (last 7 days)
      prisma.propertyInquiry.count({
        where: {
          property: {
            agentId
          },
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),

      // Total views across all properties
      prisma.property.aggregate({
        where: { agentId },
        _sum: { views: true }
      }),

      // Recent inquiries (last 10)
      prisma.propertyInquiry.findMany({
        where: {
          property: {
            agentId
          }
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              images: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Top performing properties
      prisma.property.findMany({
        where: { agentId },
        include: {
          investmentData: true,
          _count: {
            select: {
              propertyInquiries: true,
              favoriteProperties: true
            }
          }
        },
        orderBy: { views: 'desc' },
        take: 5
      })
    ]);

    // Calculate commission estimate (assuming commission rate from user profile)
    const commissionRate = req.user.agentCommissionRate || 3.0;
    const soldPropertiesData = await prisma.property.findMany({
      where: {
        agentId,
        availabilityStatus: 'SOLD'
      },
      select: { price: true }
    });

    const totalSalesValue = soldPropertiesData.reduce((sum, prop) => sum + prop.price, 0);
    const estimatedCommission = (totalSalesValue * commissionRate) / 100;

    res.json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          soldProperties,
          totalInquiries,
          pendingInquiries,
          totalViews: totalViews._sum.views || 0,
          totalSalesValue,
          estimatedCommission,
          commissionRate
        },
        recentInquiries,
        topProperties
      }
    });

  } catch (error) {
    console.error('Get agent dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch agent dashboard stats'
    });
  }
});

// Get agent's properties
router.get('/properties', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, availabilityStatus, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const agentId = req.user.id;

    const where = { agentId };

    if (status) where.status = status;
    if (availabilityStatus) where.availabilityStatus = availabilityStatus;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: {
          developer: true,
          locationGuide: true,
          investmentData: true,
          _count: {
            select: {
              favoriteProperties: true,
              propertyInquiries: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get agent properties error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch properties'
    });
  }
});

// Get agent's inquiries
router.get('/inquiries', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const { page = 1, limit = 10, propertyId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const agentId = req.user.id;

    const where = {
      property: { agentId }
    };

    if (propertyId) where.propertyId = propertyId;

    const [inquiries, total] = await Promise.all([
      prisma.propertyInquiry.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              images: true,
              country: true,
              city: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              country: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.propertyInquiry.count({ where })
    ]);

    res.json({
      success: true,
      data: inquiries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get agent inquiries error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch inquiries'
    });
  }
});

// Get agent profile
router.get('/profile', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const agent = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        country: true,
        role: true,
        agentLicenseNumber: true,
        agentCompany: true,
        agentBio: true,
        agentCommissionRate: true,
        membershipTier: true,
        createdAt: true,
        _count: {
          select: {
            agentProperties: true
          }
        }
      }
    });

    if (!agent) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Agent not found'
      });
    }

    res.json({
      success: true,
      data: agent
    });

  } catch (error) {
    console.error('Get agent profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch agent profile'
    });
  }
});

// Update agent profile
router.put('/profile', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      agentLicenseNumber,
      agentCompany,
      agentBio,
      agentCommissionRate
    } = req.body;

    const updatedAgent = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        phone,
        agentLicenseNumber,
        agentCompany,
        agentBio,
        agentCommissionRate: agentCommissionRate ? parseFloat(agentCommissionRate) : undefined
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        agentLicenseNumber: true,
        agentCompany: true,
        agentBio: true,
        agentCommissionRate: true,
        updatedAt: true
      }
    });

    res.json({
      success: true,
      message: 'Agent profile updated successfully',
      data: updatedAgent
    });

  } catch (error) {
    console.error('Update agent profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update agent profile'
    });
  }
});

// Update property status (agent can update their own properties)
router.patch('/properties/:id/status', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const { id } = req.params;
    const { availabilityStatus } = req.body;

    if (!['AVAILABLE', 'RESERVED', 'SOLD', 'OFF_MARKET'].includes(availabilityStatus)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid availability status'
      });
    }

    // Check if property belongs to agent
    const property = await prisma.property.findUnique({
      where: { id },
      select: { id: true, agentId: true, title: true }
    });

    if (!property) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    if (property.agentId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update properties assigned to you'
      });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { availabilityStatus },
      select: {
        id: true,
        title: true,
        availabilityStatus: true,
        updatedAt: true
      }
    });

    // Log action
    await logAdminAction('UPDATE_PROPERTY_STATUS', 'property', id, {
      title: property.title,
      newStatus: availabilityStatus
    }, req);

    res.json({
      success: true,
      message: 'Property status updated successfully',
      data: updatedProperty
    });

  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update property status'
    });
  }
});

// Get agent performance analytics
router.get('/analytics', authenticateToken, requireAgentRole, async (req, res) => {
  try {
    const agentId = req.user.id;
    const { period = '30' } = req.query; // days
    const days = parseInt(period);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      inquiriesByDay,
      propertiesByCountry,
      propertiesByStatus,
      avgResponseTime,
      conversionRate
    ] = await Promise.all([
      // Inquiries by day
      prisma.$queryRaw`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM "PropertyInquiry"
        WHERE property_id IN (
          SELECT id FROM "Property" WHERE agent_id = ${agentId}
        )
        AND created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

      // Properties by country
      prisma.property.groupBy({
        by: ['country'],
        where: { agentId },
        _count: { country: true }
      }),

      // Properties by status
      prisma.property.groupBy({
        by: ['availabilityStatus'],
        where: { agentId },
        _count: { availabilityStatus: true }
      }),

      // Average response time (placeholder - would need response tracking)
      Promise.resolve({ hours: 2.5 }),

      // Conversion rate (inquiries to sales)
      prisma.property.findMany({
        where: { agentId },
        select: {
          availabilityStatus: true,
          _count: {
            select: { propertyInquiries: true }
          }
        }
      })
    ]);

    const totalInquiries = conversionRate.reduce((sum, prop) => sum + prop._count.propertyInquiries, 0);
    const totalSales = conversionRate.filter(prop => prop.availabilityStatus === 'SOLD').length;
    const conversionPercentage = totalInquiries > 0 ? ((totalSales / totalInquiries) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        inquiriesByDay,
        propertiesByCountry,
        propertiesByStatus,
        avgResponseTime: avgResponseTime.hours,
        conversionRate: {
          totalInquiries,
          totalSales,
          percentage: parseFloat(conversionPercentage)
        }
      }
    });

  } catch (error) {
    console.error('Get agent analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;
