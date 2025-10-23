# Real Estate Investment Platform - Database Schema Documentation

## Overview

This database schema is designed to power a world-class real estate investment platform with comprehensive features including elite membership tiers, property visibility controls, multi-user reservations, and advanced investment analytics.

**Database:** PostgreSQL
**ORM:** Prisma
**Last Updated:** 2025-10-23

---

## Table of Contents

1. [Core Enumerations](#core-enumerations)
2. [User Management](#user-management)
3. [Property System](#property-system)
4. [Membership & Subscriptions](#membership--subscriptions)
5. [Reservation System](#reservation-system)
6. [Investment Analytics](#investment-analytics)
7. [Supporting Models](#supporting-models)
8. [Implementation Guide](#implementation-guide)
9. [API Considerations](#api-considerations)

---

## Core Enumerations

### Country
Countries where properties are available.
```prisma
enum Country {
  GEORGIA
  CYPRUS
  GREECE
  LEBANON
}
```

### PropertyType
```prisma
enum PropertyType {
  APARTMENT      // Standard apartment unit
  VILLA          // Standalone villa
  TOWNHOUSE      // Multi-story townhouse
  PENTHOUSE      // Luxury top-floor unit
  STUDIO         // Studio apartment
  DUPLEX         // Two-level unit
  LAND           // Land plots
  COMMERCIAL     // Commercial properties
  OFFICE         // Office spaces
}
```

### PropertyStatus
Indicates the construction/development status.
```prisma
enum PropertyStatus {
  OFF_PLAN       // Under construction, not yet built
  NEW_BUILD      // Recently completed
  RESALE         // Previously owned
}
```

### PropertyAvailabilityStatus
**KEY FEATURE:** Tracks sale status of properties.
```prisma
enum PropertyAvailabilityStatus {
  AVAILABLE      // Available for purchase
  RESERVED       // Reserved by one or more users
  SOLD           // Property has been sold
  OFF_MARKET     // Temporarily unavailable
}
```

### PropertyVisibility
**KEY FEATURE:** Controls who can see properties.
```prisma
enum PropertyVisibility {
  PUBLIC         // Visible to all users (free & elite)
  ELITE_ONLY     // Visible only to elite/premium members
  HIDDEN         // Hidden from all users (admin only)
}
```

### MembershipTier
**KEY FEATURE:** User membership levels.
```prisma
enum MembershipTier {
  FREE           // Basic free tier
  ELITE          // Elite membership with premium features
  PREMIUM        // Highest tier with all benefits
}
```

### ReservationStatus
```prisma
enum ReservationStatus {
  PENDING        // Awaiting admin approval
  APPROVED       // Approved by admin
  REJECTED       // Rejected by admin
  EXPIRED        // Reservation period expired
  CANCELLED      // Cancelled by user
}
```

### PaymentStatus
```prisma
enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
  CANCELLED
}
```

### FurnishingStatus
```prisma
enum FurnishingStatus {
  UNFURNISHED
  SEMI_FURNISHED
  FULLY_FURNISHED
}
```

### OwnershipType
```prisma
enum OwnershipType {
  FREEHOLD       // Full ownership
  LEASEHOLD      // Lease-based ownership
}
```

---

## User Management

### User Model

**Purpose:** Core user entity with membership tier integration.

**Key Features:**
- Multiple authentication methods (local, OAuth)
- Elite membership tracking
- Role-based access control
- Admin audit trail

```prisma
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  password        String?  // Hashed (null for OAuth users)
  firstName       String?
  lastName        String?
  phone           String?
  country         String?
  role            Role     @default(USER)

  // Membership & Subscription
  membershipTier      MembershipTier @default(FREE)
  membershipStartDate DateTime?
  membershipEndDate   DateTime?

  // Account status
  isActive        Boolean   @default(true)
  emailVerifiedAt DateTime?
  lastLoginAt     DateTime?

  // OAuth
  googleId        String?  @unique
  provider        String?
  avatar          String?

  investmentGoals InvestmentGoal[]
}
```

**Indexes:**
- `email`: Fast user lookup
- `membershipTier`: Quick filtering by membership level
- `role`: Admin/user separation
- `isActive`: Active user queries

**Relations:**
- `subscriptions`: Payment history
- `propertyReservations`: Properties reserved by user
- `favoriteProperties`: Saved properties
- `ownedProperties`: Investment portfolio

---

## Property System

### Property Model

**Purpose:** Comprehensive property entity with all details needed for investment decisions.

**Key Features:**
- Full property details (type, size, location, amenities)
- Visibility control (public/elite/hidden)
- Availability status (available/reserved/sold)
- SEO optimization
- Media galleries
- Investment highlights

```prisma
model Property {
  id               String  @id @default(cuid())
  title            String
  description      String
  shortDescription String?  // For listing cards

  // Pricing
  price            Float
  currency         String  @default("USD")

  // Basic Details
  propertyType     PropertyType
  bedrooms         Int
  bathrooms        Int
  area             Float    // square meters
  builtYear        Int?
  floors           Int?     // Total floors in building
  floor            Int?     // Which floor (apartments)
  parkingSpaces    Int?     @default(0)

  // Location
  country          Country
  city             String?
  district         String?
  address          String?
  zipCode          String?
  latitude         Float?   // For map display
  longitude        Float?

  // Status & Visibility
  status             PropertyStatus
  availabilityStatus PropertyAvailabilityStatus @default(AVAILABLE)
  visibility         PropertyVisibility         @default(PUBLIC)

  // Features
  furnishingStatus     FurnishingStatus?
  ownershipType        OwnershipType?
  isGoldenVisaEligible Boolean @default(false)
  hasPool              Boolean @default(false)
  hasGym               Boolean @default(false)
  hasGarden            Boolean @default(false)
  hasBalcony           Boolean @default(false)
  hasSecurity          Boolean @default(false)
  hasElevator          Boolean @default(false)
  hasCentralAC         Boolean @default(false)

  // Media
  images         String[]  // Array of image URLs
  videoUrl       String?   // Property video
  virtualTourUrl String?   // 360 tour

  // SEO & Marketing
  slug            String?   @unique
  metaTitle       String?
  metaDescription String?
  featured        Boolean   @default(false)
  featuredUntil   DateTime?
  views           Int       @default(0)

  // Availability Tracking
  availableFrom   DateTime?
  reservedUntil   DateTime?
  soldAt          DateTime?

  // Investment Highlights
  highlightedFeatures String[]  // ["Beach Front", "High ROI"]

  publishedAt     DateTime?
}
```

**Critical Indexes:**
- `visibility`: Filter properties by access level
- `availabilityStatus`: Quick filtering of available properties
- `country`, `propertyType`: Search filters
- `featured`, `price`: Sorting and filtering
- `slug`: SEO-friendly URLs

**Relations:**
- `investmentData`: Detailed ROI calculations
- `reservations`: Multiple users can reserve same property
- `documents`: Floor plans, contracts, certificates
- `amenities`: Detailed amenity list

---

### PropertyInvestmentData Model

**Purpose:** Comprehensive investment analysis data for each property.

```prisma
model PropertyInvestmentData {
  id         String @id @default(cuid())
  propertyId String @unique

  // ROI & Returns
  expectedROI        Float?  // Percentage
  rentalYield        Float?  // Annual rental yield %
  capitalGrowth      Float?  // Expected appreciation %
  annualAppreciation Float?  // Historical appreciation %

  // Investment Details
  minInvestment         Float?
  maxInvestment         Float?
  downPaymentPercentage Float?
  paymentPlan           String?
  installmentYears      Int?

  // Golden Visa
  isGoldenVisaEligible Boolean @default(false)
  goldenVisaMinAmount  Float?

  // Dates
  completionDate      DateTime?
  handoverDate        DateTime?
  expectedRentalStart DateTime?

  // Market Analysis
  averageRentPerMonth         Float?
  propertyAppreciationHistory Float[]  // Historical data
  comparableProperties        String[]  // Similar property IDs

  // Additional Costs
  mortgageAvailable Boolean @default(false)
  serviceFee        Float?  // Annual maintenance
  propertyTax       Float?  // Annual tax
}
```

**Use Cases:**
- ROI calculator in property details
- Investment comparison tools
- Market analysis dashboards
- Financial planning features

---

### PropertyReservation Model

**KEY FEATURE:** Allows multiple users to reserve the same property simultaneously.

**Purpose:** Track property reservations with approval workflow.

**Business Logic:**
- Multiple users can reserve one property
- Admin approves/rejects reservations
- Reservations expire automatically
- First approved reservation wins
- Reservation fees tracked

```prisma
model PropertyReservation {
  id              String @id @default(cuid())
  propertyId      String
  userId          String

  // Reservation Details
  status          ReservationStatus @default(PENDING)
  reservationDate DateTime          @default(now())
  expiryDate      DateTime

  // Financial
  reservationFee  Float?
  currency        String            @default("USD")
  paymentStatus   PaymentStatus     @default(PENDING)
  transactionId   String?

  // Admin Actions
  approvedAt      DateTime?
  approvedBy      String?  // Admin user ID
  rejectedAt      DateTime?
  rejectedBy      String?
  rejectionReason String?

  // User Actions
  cancelledAt     DateTime?
  cancelReason    String?

  // Communication
  userNotes       String?  // User's message
  adminNotes      String?  // Internal admin notes
}
```

**Workflow:**
1. User submits reservation with optional deposit
2. Status: `PENDING`
3. Admin reviews and either approves or rejects
4. If approved: property `availabilityStatus` → `RESERVED`
5. If multiple approved: first payment completes wins
6. Upon sale: property `availabilityStatus` → `SOLD`
7. Auto-expire unpaid reservations after `expiryDate`

**Indexes:**
- `propertyId`: Get all reservations for a property
- `userId`: User's reservation history
- `status`: Filter by status
- `expiryDate`: Background job to expire old reservations

---

## Membership & Subscriptions

### Subscription Model

**Purpose:** Track user subscriptions and payment history.

```prisma
model Subscription {
  id             String         @id @default(cuid())
  userId         String
  membershipTier MembershipTier

  // Pricing
  amount   Float
  currency String @default("USD")

  // Period
  startDate DateTime
  endDate   DateTime
  autoRenew Boolean  @default(true)

  // Status
  status PaymentStatus @default(PENDING)

  // Payment Gateway
  paymentGateway String?  // 'stripe', 'paypal'
  transactionId  String?
  paymentMethod  String?  // 'card', 'bank_transfer'

  // Metadata
  cancelledAt  DateTime?
  cancelReason String?
  refundedAt   DateTime?
  refundAmount Float?
}
```

**Business Logic:**
- On successful payment: Update `User.membershipTier`
- Set `User.membershipStartDate` and `User.membershipEndDate`
- Background job: Check expired memberships daily
- On expiry: Downgrade to `FREE` tier
- Auto-renewal: Charge before `endDate`

**Indexes:**
- `userId`: User's payment history
- `status`: Active subscriptions
- `endDate`: Expiry checks

---

### MembershipBenefit Model

**Purpose:** Define benefits for each membership tier.

```prisma
model MembershipBenefit {
  id          String         @id @default(cuid())
  tier        MembershipTier
  name        String
  description String
  icon        String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
}
```

**Example Benefits:**

**FREE Tier:**
- View public properties
- Save up to 5 favorites
- Basic property search
- Contact support

**ELITE Tier:**
- View elite properties
- Unlimited favorites
- Advanced search filters
- Investment calculator
- Market analysis reports
- Priority support
- Property alerts

**PREMIUM Tier:**
- All ELITE benefits
- Early access to new properties
- Dedicated account manager
- Exclusive investment opportunities
- Portfolio analytics dashboard
- 1-on-1 consultation calls

---

## Investment Analytics

### UserPortfolioAnalytics Model

**Purpose:** Track user investment portfolio performance.

```prisma
model UserPortfolioAnalytics {
  id     String @id @default(cuid())
  userId String @unique

  // Portfolio Metrics
  totalInvestment   Float @default(0)
  currentValue      Float @default(0)
  totalROI          Float @default(0)
  totalRentalIncome Float @default(0)

  // Performance
  averageROI              Float?
  bestPerformingProperty  String?
  worstPerformingProperty String?

  lastCalculatedAt DateTime @default(now())
}
```

**Calculation Logic:**
- Background job runs nightly
- Aggregates data from `UserOwnedProperty`
- Considers property appreciation, rental income
- Updates investment recommendations

---

## Supporting Models

### PropertyAmenity

**Purpose:** Flexible amenity system for properties.

```prisma
model PropertyAmenity {
  id          String  @id @default(cuid())
  propertyId  String
  name        String  // "Swimming Pool", "Gym"
  category    String? // "Recreation", "Security"
  description String?
  icon        String? // Icon identifier
}
```

**Categories:**
- Recreation: Pool, Gym, Playground
- Security: 24/7 Security, CCTV, Gated Community
- Utilities: High-speed Internet, Backup Generator
- Services: Concierge, Housekeeping, Maintenance

---

### PropertyDocument

**Purpose:** Store property-related documents with access control.

```prisma
model PropertyDocument {
  id         String @id @default(cuid())
  propertyId String

  title       String
  description String?
  type        DocumentType
  fileUrl     String
  fileSize    Int?
  mimeType    String?

  // Access Control
  isPublic Boolean @default(false)  // If false, elite only
}
```

**Document Types:**
- `FLOOR_PLAN`: Property layouts
- `BROCHURE`: Marketing materials
- `CONTRACT`: Purchase agreements
- `LEGAL_DOCUMENT`: Legal paperwork
- `CERTIFICATE`: Ownership certificates

**Access Logic:**
- If `isPublic = true`: All users can view
- If `isPublic = false`: Only elite/premium/admin

---

### PropertyView

**Purpose:** Track property view analytics.

```prisma
model PropertyView {
  id         String   @id @default(cuid())
  propertyId String
  userId     String?  // null for anonymous
  ipAddress  String?
  userAgent  String?
  referrer   String?
  viewedAt   DateTime @default(now())
}
```

**Use Cases:**
- Popular properties ranking
- User behavior analysis
- Marketing attribution
- A/B testing

---

### PropertyPriceHistory

**Purpose:** Track price changes over time.

```prisma
model PropertyPriceHistory {
  id         String   @id @default(cuid())
  propertyId String
  price      Float
  currency   String   @default("USD")
  changedAt  DateTime @default(now())
  changedBy  String?  // Admin user ID
  reason     String?
}
```

**Use Cases:**
- Price change notifications
- Market trends analysis
- Transparency for users
- Audit trail

---

### SavedSearch

**Purpose:** Allow users to save search criteria and get alerts.

```prisma
model SavedSearch {
  id       String @id @default(cuid())
  userId   String
  name     String
  criteria Json  // Search parameters

  // Notifications
  emailAlerts Boolean @default(false)
  frequency   String? // 'instant', 'daily', 'weekly'
}
```

**Example Criteria JSON:**
```json
{
  "country": ["CYPRUS", "GREECE"],
  "propertyType": ["APARTMENT", "VILLA"],
  "minPrice": 200000,
  "maxPrice": 500000,
  "bedrooms": [2, 3],
  "isGoldenVisaEligible": true
}
```

**Background Job:**
- Check for new properties matching criteria
- Send email alerts based on frequency
- Push notifications

---

### ContactRequest

**Purpose:** Centralized lead management system.

```prisma
model ContactRequest {
  id    String @id @default(cuid())

  name    String
  email   String
  phone   String?
  company String?

  subject String
  message String

  relatedPropertyId String?
  source            String?  // Origin of request

  isRead     Boolean @default(false)
  isReplied  Boolean @default(false)
  assignedTo String?  // Admin user ID
}
```

**Sources:**
- `contact_form`: General contact form
- `property_inquiry`: Property-specific inquiry
- `chat`: Live chat
- `phone`: Phone call log

**Admin Dashboard:**
- Unread count badge
- Filter by status, assigned admin
- Quick reply templates
- Auto-assignment rules

---

### NewsletterSubscription

**Purpose:** Email marketing and engagement.

```prisma
model NewsletterSubscription {
  id        String  @id @default(cuid())
  email     String  @unique
  firstName String?
  lastName  String?

  isActive    Boolean @default(true)
  preferences Json?

  subscribedAt      DateTime  @default(now())
  unsubscribedAt    DateTime?
  unsubscribeReason String?
}
```

**Preferences JSON:**
```json
{
  "topics": ["investment_tips", "market_updates", "new_properties"],
  "countries": ["CYPRUS", "GREECE"]
}
```

---

## Implementation Guide

### Phase 1: Database Migration

1. **Backup existing data**
   ```bash
   pg_dump propgroup > backup_$(date +%Y%m%d).sql
   ```

2. **Generate migration**
   ```bash
   npx prisma migrate dev --name add_elite_membership_and_reservations
   ```

3. **Review migration SQL**
   - Check for data loss warnings
   - Verify default values
   - Test on staging first

4. **Apply migration**
   ```bash
   npx prisma migrate deploy
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### Phase 2: Data Migration Scripts

**Migrate existing properties:**
```typescript
// Set default visibility for existing properties
await prisma.property.updateMany({
  where: { visibility: null },
  data: {
    visibility: 'PUBLIC',
    availabilityStatus: 'AVAILABLE'
  }
})
```

**Migrate existing users:**
```typescript
// Set all existing users to FREE tier
await prisma.user.updateMany({
  where: { membershipTier: null },
  data: { membershipTier: 'FREE' }
})
```

### Phase 3: Backend Implementation

**Property Visibility Middleware:**
```typescript
function checkPropertyAccess(user: User, property: Property) {
  // Admins can see everything
  if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
    return true
  }

  // Hidden properties only for admins
  if (property.visibility === 'HIDDEN') {
    return false
  }

  // Elite properties require elite/premium membership
  if (property.visibility === 'ELITE_ONLY') {
    return ['ELITE', 'PREMIUM'].includes(user.membershipTier)
  }

  // Public properties visible to all
  return true
}
```

**Reservation Creation:**
```typescript
async function createReservation(
  userId: string,
  propertyId: string,
  reservationFee: number
) {
  // Check if property is available
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  })

  if (property.availabilityStatus === 'SOLD') {
    throw new Error('Property already sold')
  }

  // Check if user already has pending reservation
  const existing = await prisma.propertyReservation.findFirst({
    where: {
      userId,
      propertyId,
      status: 'PENDING'
    }
  })

  if (existing) {
    throw new Error('You already have a pending reservation')
  }

  // Create reservation
  const reservation = await prisma.propertyReservation.create({
    data: {
      userId,
      propertyId,
      status: 'PENDING',
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      reservationFee,
      paymentStatus: 'PENDING'
    }
  })

  // Update property status
  await prisma.property.update({
    where: { id: propertyId },
    data: {
      availabilityStatus: 'RESERVED',
      reservedUntil: reservation.expiryDate
    }
  })

  return reservation
}
```

**Membership Upgrade:**
```typescript
async function upgradeMembership(
  userId: string,
  tier: MembershipTier,
  durationMonths: number = 12
) {
  const startDate = new Date()
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + durationMonths)

  // Create subscription record
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      membershipTier: tier,
      startDate,
      endDate,
      amount: getPricing(tier, durationMonths),
      status: 'PENDING'
    }
  })

  // After payment success:
  await prisma.user.update({
    where: { id: userId },
    data: {
      membershipTier: tier,
      membershipStartDate: startDate,
      membershipEndDate: endDate
    }
  })

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'COMPLETED' }
  })
}
```

### Phase 4: Frontend Implementation

**Property Listing Filters:**
```typescript
// Only fetch properties user can access
const properties = await prisma.property.findMany({
  where: {
    AND: [
      // User's search filters
      { country: selectedCountry },
      { price: { gte: minPrice, lte: maxPrice } },

      // Visibility filter
      user.membershipTier === 'FREE'
        ? { visibility: 'PUBLIC' }
        : { visibility: { in: ['PUBLIC', 'ELITE_ONLY'] } }
    ]
  }
})
```

**Elite Property Badge:**
```tsx
{property.visibility === 'ELITE_ONLY' && (
  <Badge variant="premium">
    <Crown className="w-4 h-4" />
    Elite Property
  </Badge>
)}
```

**Reservation Button:**
```tsx
<Button
  onClick={() => handleReserve(property.id)}
  disabled={property.availabilityStatus === 'SOLD'}
>
  {property.availabilityStatus === 'SOLD'
    ? 'Sold Out'
    : property.availabilityStatus === 'RESERVED'
    ? 'Reserve (Multiple Offers Accepted)'
    : 'Reserve Now'
  }
</Button>
```

---

## API Considerations

### Property Endpoints

**GET /api/properties**
- Query params: country, type, minPrice, maxPrice, bedrooms, etc.
- Auto-filter by user's membership tier
- Return only visible properties

**GET /api/properties/:id**
- Check property visibility
- Return 404 if user doesn't have access
- Increment view count
- Log view in PropertyView table

**POST /api/properties/:id/reserve**
- Requires authentication
- Check property availability
- Create reservation
- Process payment
- Send notification to admins

### Membership Endpoints

**GET /api/membership/benefits**
- Return benefits for all tiers
- Highlight current user's tier

**POST /api/membership/upgrade**
- Payment processing
- Create subscription
- Update user tier
- Send confirmation email

**GET /api/membership/my-benefits**
- Return user's current benefits
- Show expiry date
- Upgrade CTA if FREE

### Admin Endpoints

**GET /api/admin/reservations**
- List all pending reservations
- Filter by property, status, date
- Bulk approve/reject

**POST /api/admin/reservations/:id/approve**
- Approve reservation
- Notify user
- Update property status if first approval

**POST /api/admin/reservations/:id/reject**
- Reject with reason
- Notify user
- Update property status if no other pending

---

## Background Jobs & Cron Tasks

### Daily Tasks

**Expire Reservations:**
```typescript
// Run every hour
async function expireReservations() {
  const expired = await prisma.propertyReservation.findMany({
    where: {
      expiryDate: { lt: new Date() },
      status: 'PENDING'
    }
  })

  for (const reservation of expired) {
    await prisma.propertyReservation.update({
      where: { id: reservation.id },
      data: { status: 'EXPIRED' }
    })

    // If no other active reservations, mark property available
    const activeReservations = await prisma.propertyReservation.count({
      where: {
        propertyId: reservation.propertyId,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    })

    if (activeReservations === 0) {
      await prisma.property.update({
        where: { id: reservation.propertyId },
        data: { availabilityStatus: 'AVAILABLE' }
      })
    }
  }
}
```

**Expire Memberships:**
```typescript
// Run daily at midnight
async function expireMemberships() {
  const expiredUsers = await prisma.user.findMany({
    where: {
      membershipEndDate: { lt: new Date() },
      membershipTier: { not: 'FREE' }
    }
  })

  for (const user of expiredUsers) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        membershipTier: 'FREE',
        membershipEndDate: null
      }
    })

    // Send expiry notification email
    await sendExpiryEmail(user)
  }
}
```

**Calculate Portfolio Analytics:**
```typescript
// Run nightly
async function calculatePortfolios() {
  const users = await prisma.user.findMany({
    include: { ownedProperties: true }
  })

  for (const user of users) {
    const analytics = calculateUserPortfolio(user.ownedProperties)

    await prisma.userPortfolioAnalytics.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...analytics },
      update: { ...analytics, lastCalculatedAt: new Date() }
    })
  }
}
```

---

## Security Considerations

### Row-Level Security

Implement middleware to enforce access control:

```typescript
// Property access control
app.use('/api/properties/:id', async (req, res, next) => {
  const property = await getProperty(req.params.id)
  const user = req.user

  if (!checkPropertyAccess(user, property)) {
    return res.status(404).json({ error: 'Property not found' })
  }

  next()
})
```

### Data Privacy

- Never expose `HIDDEN` properties in API responses
- Filter properties at database level, not frontend
- Log all admin actions in `AdminAuditLog`
- Encrypt sensitive fields (payment info, personal data)

### Rate Limiting

- Reservation creation: 5 per hour per user
- Property views: 100 per hour per IP
- Search API: 60 requests per minute

---

## Performance Optimization

### Database Indexes

All critical indexes already defined in schema:
- Compound indexes on `(country, propertyType, visibility)`
- Partial indexes on `availabilityStatus WHERE status = 'AVAILABLE'`
- Covering indexes for common queries

### Caching Strategy

**Redis Cache:**
```typescript
// Cache public property listings (1 hour)
const cacheKey = `properties:${country}:${type}:public`
let properties = await redis.get(cacheKey)

if (!properties) {
  properties = await prisma.property.findMany({ ... })
  await redis.setex(cacheKey, 3600, JSON.stringify(properties))
}
```

**Invalidation:**
- On property update: clear related cache keys
- On membership upgrade: clear user-specific caches
- On reservation: clear property detail cache

### Query Optimization

```typescript
// Bad: N+1 queries
const properties = await prisma.property.findMany()
for (const prop of properties) {
  const data = await prisma.propertyInvestmentData.findUnique({
    where: { propertyId: prop.id }
  })
}

// Good: Single query with includes
const properties = await prisma.property.findMany({
  include: {
    investmentData: true,
    developer: true,
    reservations: {
      where: { status: 'APPROVED' }
    }
  }
})
```

---

## Testing Strategy

### Unit Tests

Test individual models and business logic:

```typescript
describe('Property Visibility', () => {
  it('should hide elite properties from free users', () => {
    const freeUser = { membershipTier: 'FREE' }
    const eliteProperty = { visibility: 'ELITE_ONLY' }

    expect(checkPropertyAccess(freeUser, eliteProperty)).toBe(false)
  })

  it('should show elite properties to elite users', () => {
    const eliteUser = { membershipTier: 'ELITE' }
    const eliteProperty = { visibility: 'ELITE_ONLY' }

    expect(checkPropertyAccess(eliteUser, eliteProperty)).toBe(true)
  })
})
```

### Integration Tests

Test API endpoints with real database:

```typescript
describe('POST /api/properties/:id/reserve', () => {
  it('should create reservation for available property', async () => {
    const response = await request(app)
      .post('/api/properties/prop123/reserve')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reservationFee: 5000 })

    expect(response.status).toBe(201)
    expect(response.body.status).toBe('PENDING')
  })

  it('should reject reservation for sold property', async () => {
    // Mark property as sold
    await prisma.property.update({
      where: { id: 'prop123' },
      data: { availabilityStatus: 'SOLD' }
    })

    const response = await request(app)
      .post('/api/properties/prop123/reserve')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ reservationFee: 5000 })

    expect(response.status).toBe(400)
  })
})
```

---

## Migration Rollback Plan

If issues arise, rollback strategy:

1. **Restore database backup**
   ```bash
   psql propgroup < backup_20251023.sql
   ```

2. **Revert Prisma migration**
   ```bash
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

3. **Regenerate old client**
   ```bash
   git checkout HEAD~1 prisma/schema.prisma
   npx prisma generate
   ```

4. **Redeploy previous version**

---

## Future Enhancements

### Phase 2 Features

1. **Auction System**
   - Allow bidding on properties
   - Bid history tracking
   - Auto-bid functionality

2. **Property Comparison**
   - Side-by-side comparison tool
   - Investment metrics comparison
   - Location comparison

3. **Investment Calculator**
   - Mortgage calculator
   - ROI projections
   - Cash flow analysis
   - Tax implications

4. **Social Features**
   - User reviews and ratings
   - Property discussions
   - Investment groups
   - Referral program

5. **Advanced Analytics**
   - Market trends dashboard
   - Predictive analytics
   - Investment recommendations
   - Portfolio diversification suggestions

6. **Mobile App**
   - Push notifications for new properties
   - Saved search alerts
   - Virtual property tours
   - Document signing

---

## Support & Maintenance

### Monitoring

- **Database Performance:** Monitor slow queries
- **Cache Hit Rate:** Track Redis performance
- **API Response Times:** Set up alerts for slow endpoints
- **Error Tracking:** Log and alert on errors

### Backup Strategy

- **Daily automated backups** at 2 AM UTC
- **Weekly full backups** retained for 3 months
- **Transaction logs** backed up every 15 minutes
- **Backup restoration testing** monthly

### Documentation Updates

Update this document when:
- New models are added
- Business logic changes
- API endpoints change
- Performance optimizations are made

---

## Contact

For questions or support regarding this schema:
- **Technical Lead:** [Your Name]
- **Database Admin:** [DBA Name]
- **Documentation:** [Link to internal wiki]

---

**Last Updated:** 2025-10-23
**Version:** 2.0
**Database Version:** PostgreSQL 15+
