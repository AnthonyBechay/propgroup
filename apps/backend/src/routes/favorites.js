import express from 'express';
import { prisma } from '@propgroup/db';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user's favorite properties
router.get('/', authenticateToken, async (req, res) => {
  try {
    const favorites = await prisma.favoriteProperty.findMany({
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
      data: favorites
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch favorite properties'
    });
  }
});

// Add property to favorites
router.post('/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: propertyId
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({
        error: 'Already Favorited',
        message: 'Property is already in your favorites'
      });
    }

    // Add to favorites
    const favorite = await prisma.favoriteProperty.create({
      data: {
        userId: req.user.id,
        propertyId: propertyId
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
      message: 'Property added to favorites',
      data: favorite
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to add property to favorites'
    });
  }
});

// Remove property from favorites
router.delete('/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if favorite exists
    const favorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: propertyId
        }
      }
    });

    if (!favorite) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Property not found in favorites'
      });
    }

    // Remove from favorites
    await prisma.favoriteProperty.delete({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: propertyId
        }
      }
    });

    res.json({
      success: true,
      message: 'Property removed from favorites'
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to remove property from favorites'
    });
  }
});

// Check if property is favorited
router.get('/check/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const favorite = await prisma.favoriteProperty.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: propertyId
        }
      }
    });

    res.json({
      success: true,
      isFavorited: !!favorite
    });

  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to check favorite status'
    });
  }
});

export default router;
