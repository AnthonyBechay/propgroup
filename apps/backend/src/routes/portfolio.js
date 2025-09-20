import express from 'express';
import { z } from 'zod';
import { prisma } from '@propgroup/db';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation schemas
const ownedPropertySchema = z.object({
  customName: z.string().min(1, 'Property name is required'),
  purchasePrice: z.number().min(0, 'Purchase price must be positive'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  initialMortgage: z.number().optional().nullable(),
  currentRent: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  propertyId: z.string().optional().nullable()
});

// Get user's portfolio
router.get('/', authenticateToken, async (req, res) => {
  try {
    const ownedProperties = await prisma.userOwnedProperty.findMany({
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
      data: ownedProperties
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch portfolio'
    });
  }
});

// Add property to portfolio
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = ownedPropertySchema.parse(req.body);

    // If propertyId is provided, check if property exists
    if (validatedData.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: validatedData.propertyId }
      });

      if (!property) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Property not found'
        });
      }
    }

    // Create owned property
    const ownedProperty = await prisma.userOwnedProperty.create({
      data: {
        userId: req.user.id,
        customName: validatedData.customName,
        purchasePrice: validatedData.purchasePrice,
        purchaseDate: new Date(validatedData.purchaseDate),
        initialMortgage: validatedData.initialMortgage,
        currentRent: validatedData.currentRent,
        notes: validatedData.notes,
        propertyId: validatedData.propertyId
      },
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
      }
    });

    res.status(201).json({
      success: true,
      message: 'Property added to portfolio',
      data: ownedProperty
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Add owned property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add property to portfolio'
    });
  }
});

// Update owned property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = ownedPropertySchema.partial().parse(req.body);

    // Check if owned property exists and belongs to user
    const existingProperty = await prisma.userOwnedProperty.findFirst({
      where: { 
        id: id,
        userId: req.user.id 
      }
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found in your portfolio'
      });
    }

    // If propertyId is being updated, check if property exists
    if (validatedData.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: validatedData.propertyId }
      });

      if (!property) {
        return res.status(404).json({
          error: 'Not Found',
          message: 'Property not found'
        });
      }
    }

    // Update owned property
    const updatedProperty = await prisma.userOwnedProperty.update({
      where: { id: id },
      data: {
        customName: validatedData.customName,
        purchasePrice: validatedData.purchasePrice,
        purchaseDate: validatedData.purchaseDate ? new Date(validatedData.purchaseDate) : undefined,
        initialMortgage: validatedData.initialMortgage,
        currentRent: validatedData.currentRent,
        notes: validatedData.notes,
        propertyId: validatedData.propertyId
      },
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
      }
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updatedProperty
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details: error.errors
      });
    }

    console.error('Update owned property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update property'
    });
  }
});

// Delete owned property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if owned property exists and belongs to user
    const existingProperty = await prisma.userOwnedProperty.findFirst({
      where: { 
        id: id,
        userId: req.user.id 
      }
    });

    if (!existingProperty) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found in your portfolio'
      });
    }

    // Delete owned property
    await prisma.userOwnedProperty.delete({
      where: { id: id }
    });

    res.json({
      success: true,
      message: 'Property removed from portfolio'
    });

  } catch (error) {
    console.error('Delete owned property error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to remove property from portfolio'
    });
  }
});

// Get portfolio statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const ownedProperties = await prisma.userOwnedProperty.findMany({
      where: { userId: req.user.id },
      include: {
        property: {
          include: {
            investmentData: true
          }
        }
      }
    });

    // Calculate statistics
    const totalProperties = ownedProperties.length;
    const totalInvestment = ownedProperties.reduce((sum, prop) => sum + prop.purchasePrice, 0);
    const totalMortgage = ownedProperties.reduce((sum, prop) => sum + (prop.initialMortgage || 0), 0);
    const totalRent = ownedProperties.reduce((sum, prop) => sum + (prop.currentRent || 0), 0);
    const averageROI = ownedProperties.length > 0 
      ? ownedProperties.reduce((sum, prop) => {
          const roi = prop.property?.investmentData?.expectedROI || 0;
          return sum + roi;
        }, 0) / ownedProperties.length
      : 0;

    res.json({
      success: true,
      data: {
        totalProperties,
        totalInvestment,
        totalMortgage,
        totalRent,
        averageROI,
        netWorth: totalInvestment - totalMortgage
      }
    });

  } catch (error) {
    console.error('Get portfolio stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch portfolio statistics'
    });
  }
});

export default router;
