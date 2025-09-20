import express from 'express';
import { z } from 'zod';
import { prisma } from '@propgroup/db';
import { authenticateToken, requireAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const inquirySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().optional()
});

// Create property inquiry
router.post('/', async (req, res) => {
  try {
    const validatedData = inquirySchema.parse(req.body);
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId }
    });

    if (!property) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    // Create inquiry
    const inquiry = await prisma.propertyInquiry.create({
      data: {
        propertyId: validatedData.propertyId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        message: validatedData.message,
        userId: req.user?.id // Optional - user might not be logged in
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            country: true
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
      }
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Create inquiry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to submit inquiry'
    });
  }
});

// Get user's inquiries (authenticated users only)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const inquiries = await prisma.propertyInquiry.findMany({
      where: { userId: req.user.id },
      include: {
        property: {
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
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: inquiries
    });

  } catch (error) {
    console.error('Get user inquiries error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch inquiries'
    });
  }
});

// Get all inquiries (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, propertyId, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
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
              country: true
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
    console.error('Get inquiries error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch inquiries'
    });
  }
});

// Get single inquiry (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id: req.params.id },
      include: {
        property: {
          include: {
            developer: true,
            locationGuide: true,
            investmentData: true
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
      }
    });

    if (!inquiry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      data: inquiry
    });

  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch inquiry'
    });
  }
});

// Delete inquiry (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiry = await prisma.propertyInquiry.findUnique({
      where: { id: req.params.id },
      select: { id: true, propertyId: true, name: true, email: true }
    });

    if (!inquiry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Inquiry not found'
      });
    }

    await prisma.propertyInquiry.delete({
      where: { id: req.params.id }
    });

    // Log admin action
    await logAdminAction('DELETE_INQUIRY', 'inquiry', req.params.id, {
      propertyId: inquiry.propertyId,
      name: inquiry.name,
      email: inquiry.email
    }, req);

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });

  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete inquiry'
    });
  }
});

export default router;
