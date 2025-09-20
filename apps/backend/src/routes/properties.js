import express from 'express';
import { z } from 'zod';
import { prisma } from '@propgroup/db';
import { authenticateToken, requireAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(3, 'Currency is required'),
  bedrooms: z.number().min(0, 'Bedrooms must be non-negative'),
  bathrooms: z.number().min(0, 'Bathrooms must be non-negative'),
  area: z.number().min(0, 'Area must be positive'),
  country: z.enum(['GEORGIA', 'CYPRUS', 'GREECE', 'LEBANON']),
  status: z.enum(['OFF_PLAN', 'NEW_BUILD', 'RESALE']),
  isGoldenVisaEligible: z.boolean(),
  developerId: z.string().optional(),
  locationGuideId: z.string().optional(),
  images: z.array(z.string()).optional(),
  // Investment data
  expectedROI: z.number().optional(),
  rentalYield: z.number().optional(),
  capitalGrowth: z.number().optional(),
  minInvestment: z.number().optional(),
  maxInvestment: z.number().optional(),
  paymentPlan: z.string().optional(),
  completionDate: z.string().optional()
});

const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
  country: z.string().optional(),
  status: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  bedrooms: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  search: z.string().optional()
});

// Get all properties (public)
router.get('/', async (req, res) => {
  try {
    const query = querySchema.parse(req.query);
    const { page, limit, country, status, minPrice, maxPrice, bedrooms, search } = query;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where = {};
    
    if (country) where.country = country;
    if (status) where.status = status;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    if (bedrooms !== undefined) where.bedrooms = bedrooms;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
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
        take: limit
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid query parameters',
        details: error.errors
      });
    }

    console.error('Get properties error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch properties'
    });
  }
});

// Get single property (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
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
    });

    if (!property) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch property'
    });
  }
});

// Create property (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const validatedData = propertySchema.parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      // Create the property
      const property = await tx.property.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          currency: validatedData.currency,
          bedrooms: validatedData.bedrooms,
          bathrooms: validatedData.bathrooms,
          area: validatedData.area,
          country: validatedData.country,
          status: validatedData.status,
          isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
          developerId: validatedData.developerId || null,
          locationGuideId: validatedData.locationGuideId || null,
          images: validatedData.images || []
        }
      });

      // Create investment data if any investment fields are provided
      if (
        validatedData.expectedROI ||
        validatedData.rentalYield ||
        validatedData.capitalGrowth ||
        validatedData.minInvestment ||
        validatedData.maxInvestment ||
        validatedData.paymentPlan ||
        validatedData.completionDate
      ) {
        await tx.propertyInvestmentData.create({
          data: {
            propertyId: property.id,
            expectedROI: validatedData.expectedROI || null,
            rentalYield: validatedData.rentalYield || null,
            capitalGrowth: validatedData.capitalGrowth || null,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
            minInvestment: validatedData.minInvestment || null,
            maxInvestment: validatedData.maxInvestment || null,
            paymentPlan: validatedData.paymentPlan || null,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null
          }
        });
      }

      return property;
    });

    // Log admin action
    await logAdminAction('CREATE_PROPERTY', 'property', result.id, {
      title: result.title,
      price: result.price,
      country: result.country
    }, req);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: result
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Create property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create property'
    });
  }
});

// Update property (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const validatedData = propertySchema.partial().parse(req.body);

    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: req.params.id }
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update the property
      const property = await tx.property.update({
        where: { id: req.params.id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          price: validatedData.price,
          currency: validatedData.currency,
          bedrooms: validatedData.bedrooms,
          bathrooms: validatedData.bathrooms,
          area: validatedData.area,
          country: validatedData.country,
          status: validatedData.status,
          isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
          developerId: validatedData.developerId,
          locationGuideId: validatedData.locationGuideId,
          images: validatedData.images
        }
      });

      // Update or create investment data
      if (
        validatedData.expectedROI !== undefined ||
        validatedData.rentalYield !== undefined ||
        validatedData.capitalGrowth !== undefined ||
        validatedData.minInvestment !== undefined ||
        validatedData.maxInvestment !== undefined ||
        validatedData.paymentPlan !== undefined ||
        validatedData.completionDate !== undefined
      ) {
        await tx.propertyInvestmentData.upsert({
          where: { propertyId: req.params.id },
          update: {
            expectedROI: validatedData.expectedROI,
            rentalYield: validatedData.rentalYield,
            capitalGrowth: validatedData.capitalGrowth,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible,
            minInvestment: validatedData.minInvestment,
            maxInvestment: validatedData.maxInvestment,
            paymentPlan: validatedData.paymentPlan,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null
          },
          create: {
            propertyId: req.params.id,
            expectedROI: validatedData.expectedROI || null,
            rentalYield: validatedData.rentalYield || null,
            capitalGrowth: validatedData.capitalGrowth || null,
            isGoldenVisaEligible: validatedData.isGoldenVisaEligible || false,
            minInvestment: validatedData.minInvestment || null,
            maxInvestment: validatedData.maxInvestment || null,
            paymentPlan: validatedData.paymentPlan || null,
            completionDate: validatedData.completionDate 
              ? new Date(validatedData.completionDate) 
              : null
          }
        });
      }

      return property;
    });

    // Log admin action
    await logAdminAction('UPDATE_PROPERTY', 'property', req.params.id, {
      title: result.title,
      price: result.price,
      country: result.country
    }, req);

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: result
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Update property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update property'
    });
  }
});

// Delete property (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Check if property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: req.params.id },
      select: { id: true, title: true }
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    await prisma.property.delete({
      where: { id: req.params.id }
    });

    // Log admin action
    await logAdminAction('DELETE_PROPERTY', 'property', req.params.id, {
      title: existingProperty.title
    }, req);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete property'
    });
  }
});

export default router;
