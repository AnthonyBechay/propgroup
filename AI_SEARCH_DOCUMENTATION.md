# PropGroup AI Property Search - Complete Documentation

## Overview

The PropGroup AI Property Search is an intelligent, natural language-powered property discovery system that allows users to find their perfect investment properties by simply describing what they're looking for in plain English.

## Features

### 1. Natural Language Processing
- **Plain English Queries**: Users can search using everyday language
- **Smart Pattern Recognition**: Automatically extracts:
  - Countries (Georgia, Cyprus, Greece, Lebanon)
  - Price ranges (under $500k, between $300k-$500k)
  - Bedrooms and bathrooms
  - Property status (off-plan, new build, resale)
  - Investment goals (ROI, Golden Visa, rental income)

### 2. Multiple Search Interfaces

#### a) Homepage Integration
- **Location**: Main hero section
- **Toggle**: Switch between AI Search and Traditional Search
- **Default**: AI Search enabled by default
- **File**: `apps/web/src/components/home/HeroSection.tsx`

#### b) Dedicated AI Search Page
- **Route**: `/ai-search`
- **Features**: Full-page chat interface with examples and how-it-works section
- **File**: `apps/web/src/app/ai-search/page.tsx`

#### c) Properties Page Integration
- **Location**: Properties listing page
- **Features**: Collapsible AI search bar with banner
- **File**: `apps/web/src/components/properties/PropertiesClient.tsx`

#### d) Floating AI Assistant
- **Global Component**: Available on all pages
- **Interaction**: Floating action button (FAB) in bottom-right corner
- **Modal**: Opens chat-style interface
- **File**: `apps/web/src/components/ai/AIAssistantFab.tsx`

### 3. Admin Panel

#### AI Settings Dashboard
- **Route**: `/admin/ai-settings`
- **Features**:
  - Real-time statistics (searches, success rate, response time)
  - Configuration toggles:
    - Enable/disable AI search
    - Show/hide floating assistant
    - Default search mode selection
  - Maximum results limit
  - Response timeout settings
  - Popular search queries analytics

**File**: `apps/web/src/app/(admin)/admin/ai-settings/page.tsx`

## Architecture

### Frontend Components

#### 1. AIPropertySearch Component
**Location**: `apps/web/src/components/ai/AIPropertySearch.tsx`

**Props**:
```typescript
interface AIPropertySearchProps {
  variant?: 'inline' | 'modal' | 'page'
  onSearch?: (filters: PropertyFilters) => void
  placeholder?: string
}
```

**Variants**:
- `inline`: Simple search bar with quick suggestions
- `modal`: Chat interface for floating assistant
- `page`: Full-page experience with extended features

**Key Features**:
- Real-time natural language parsing
- Conversational chat interface
- Quick suggestion chips
- Filter extraction and display
- Automatic navigation to results

#### 2. AIAssistantFab Component
**Location**: `apps/web/src/components/ai/AIAssistantFab.tsx`

**Features**:
- Floating action button with pulsing sparkle animation
- Modal overlay with backdrop
- Integrated AIPropertySearch in modal mode

### Backend API

#### AI Search Route
**Location**: `apps/backend/src/routes/ai-search.js`

**Endpoints**:

##### 1. POST `/api/ai-search`
Search properties using natural language

**Request Body**:
```json
{
  "query": "I want a 3-bedroom apartment in Cyprus under $400k",
  "context": {
    "userId": "optional-user-id",
    "previousSearches": ["optional-search-history"]
  }
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "query": "original query string",
    "filters": {
      "country": "CYPRUS",
      "maxPrice": 400000,
      "bedrooms": 3
    },
    "summary": "I found 23 properties matching your search...",
    "properties": [...],
    "count": 23
  }
}
```

##### 2. GET `/api/ai-search/suggestions`
Get predefined search suggestions

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "text": "3-bedroom apartment in Cyprus under $300k",
      "category": "Popular",
      "icon": "home"
    }
  ]
}
```

### Natural Language Parser

**Function**: `parseNaturalLanguageQuery(query: string)`

**Extraction Patterns**:

1. **Countries**:
   - Matches: georgia, cyprus, greece, lebanon (case-insensitive)
   - Maps to database enum values

2. **Price Ranges**:
   ```
   - "under $500k" → maxPrice: 500000
   - "over $300k" → minPrice: 300000
   - "between $300k and $500k" → minPrice: 300000, maxPrice: 500000
   ```

3. **Bedrooms**:
   ```
   - "3 bedroom" → bedrooms: 3
   - "2-3 bedrooms" → minBedrooms: 2, maxBedrooms: 3
   ```

4. **Investment Goals**:
   ```
   - "golden visa" → goal: GOLDEN_VISA, isGoldenVisaEligible: true
   - "high ROI" → goal: HIGH_ROI, sortBy: 'roi'
   - "rental income" → goal: PASSIVE_INCOME, sortBy: 'rentalYield'
   ```

5. **Property Status**:
   ```
   - "off plan" → status: OFF_PLAN
   - "new build" → status: NEW_BUILD
   - "resale" → status: RESALE
   ```

## Example Searches

### Basic Searches
```
1. "2 bedroom apartment in Cyprus"
2. "Properties under $300k"
3. "Houses in Greece with 3 bedrooms"
```

### Advanced Searches
```
1. "3-bedroom apartment in Cyprus under $400k with good ROI"
2. "Golden Visa eligible properties between $250k and $500k"
3. "New build properties in Georgia with rental potential"
4. "Luxury villas in Lebanon over $1M"
```

### Investment-Focused Searches
```
1. "Show me properties with the highest ROI in Greece"
2. "I want passive income from rental properties in Cyprus"
3. "Golden Visa properties for my family"
```

## User Flow

### 1. Homepage Flow
```
User lands on homepage
  ↓
Sees AI Search (default) or can toggle to Traditional
  ↓
Types natural language query
  ↓
AI parses query in real-time
  ↓
User clicks search or presses Enter
  ↓
Shows brief AI response
  ↓
Redirects to /properties with filters applied
  ↓
Results displayed
```

### 2. Floating Assistant Flow
```
User on any page
  ↓
Clicks floating AI button (bottom-right)
  ↓
Chat modal opens
  ↓
User types query or clicks suggestion
  ↓
AI responds with summary
  ↓
Automatically redirects to results
  ↓
Modal closes
```

### 3. Properties Page Flow
```
User on /properties page
  ↓
Sees AI Search banner at top
  ↓
Clicks "Try Now" or "AI Search" button
  ↓
AI search bar expands
  ↓
User searches
  ↓
Results filter in real-time
```

## Integration Points

### 1. Layout Integration
**File**: `apps/web/src/app/layout.tsx`
```tsx
<AIAssistantFab /> // Added before Toaster
```

### 2. Navigation Integration
**File**: `apps/web/src/components/layout/Navbar.tsx`
- Added "AI Search" link with "NEW" badge
- Positioned after "Properties" link

### 3. Admin Sidebar Integration
**File**: `apps/web/src/components/admin/Sidebar.tsx`
- Added "AI Settings" menu item
- Icon: Bot
- Route: `/admin/ai-settings`

### 4. Backend Route Registration
**File**: `apps/backend/src/index.js`
```javascript
app.use('/api/ai-search', aiSearchRoutes)
```

## Database Integration

### Prisma Query Building

**Where Clause Construction**:
```javascript
const where = {
  country: "CYPRUS",
  price: { gte: 300000, lte: 500000 },
  bedrooms: { gte: 2, lte: 3 },
  isGoldenVisaEligible: true,
  status: "NEW_BUILD"
}
```

**Order By Construction**:
```javascript
const orderBy = [
  { investmentData: { expectedROI: 'desc' } },
  { createdAt: 'desc' }
]
```

## Styling & Design

### Color Scheme
- Primary gradient: `from-blue-600 to-purple-600`
- Success states: Green
- AI indicators: Blue with sparkle icons
- NEW badges: Purple gradient

### Animations
- Fade in/slide in for components
- Pulsing sparkle on FAB
- Smooth transitions on state changes

### Icons
- Main AI icon: `Bot` from lucide-react
- Secondary icon: `Sparkles` for AI features
- Search icon: `Search` for traditional search

## Performance Considerations

1. **Client-side Parsing**: Reduces server load
2. **Real-time Feedback**: Immediate visual response
3. **Debouncing**: Prevents excessive API calls
4. **Result Caching**: Stores recent searches
5. **Lazy Loading**: Components load on demand

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant

## Future Enhancements

### Planned Features
1. **Machine Learning Integration**: Connect to actual AI/ML service
2. **Search History**: Save and recall previous searches
3. **Smart Recommendations**: Suggest properties based on search patterns
4. **Multi-language Support**: Support for multiple languages
5. **Voice Search**: Speech-to-text integration
6. **Advanced Analytics**: Detailed search behavior tracking
7. **A/B Testing**: Test different search interfaces
8. **Saved Searches**: Allow users to save and get alerts

### API Improvements
1. Integration with OpenAI or Anthropic Claude for advanced NLP
2. Real-time search suggestions
3. Typo correction and fuzzy matching
4. Synonym recognition (e.g., "condo" = "apartment")
5. Context-aware searches based on user history

## Testing

### Manual Testing Checklist
- [ ] Homepage AI search works
- [ ] Floating assistant opens and closes
- [ ] Properties page AI search integrates correctly
- [ ] Admin settings page loads
- [ ] Navigation links work
- [ ] Mobile responsive design
- [ ] All example queries parse correctly
- [ ] Results redirect works
- [ ] Traditional search toggle functions

### Test Cases
```javascript
// Price extraction
"under $500k" → { maxPrice: 500000 }
"over $1M" → { minPrice: 1000000 }
"between $300k and $600k" → { minPrice: 300000, maxPrice: 600000 }

// Bedroom extraction
"3 bedroom" → { bedrooms: 3 }
"2-4 bedrooms" → { minBedrooms: 2, maxBedrooms: 4 }

// Country extraction
"Cyprus" → { country: "CYPRUS" }
"Greece and Cyprus" → { country: "CYPRUS" } // First match
```

## Deployment

### Environment Variables
No additional environment variables required for basic functionality.

### Build Process
1. Frontend components are built with Next.js
2. Backend API is deployed on Render
3. No additional build steps required

### Monitoring
- Track AI search usage in admin panel
- Monitor success rates
- Review popular queries for improvements

## Troubleshooting

### Common Issues

1. **AI Search Not Appearing**
   - Check if AIAssistantFab is imported in layout.tsx
   - Verify component files exist
   - Check for TypeScript errors

2. **Navigation Links Not Working**
   - Verify routes exist
   - Check Next.js routing setup
   - Review middleware configuration

3. **Backend API Errors**
   - Check if ai-search route is registered
   - Verify Prisma schema matches queries
   - Review server logs

## Support & Maintenance

### Files to Monitor
1. `apps/web/src/components/ai/AIPropertySearch.tsx` - Main search component
2. `apps/backend/src/routes/ai-search.js` - Backend API
3. `apps/web/src/app/(admin)/admin/ai-settings/page.tsx` - Admin settings

### Regular Maintenance
- Review popular search queries monthly
- Update parser patterns based on user behavior
- Monitor performance metrics
- Update documentation as features evolve

## Conclusion

The PropGroup AI Property Search system provides an intuitive, powerful way for users to find their perfect investment properties. With multiple integration points and a robust backend, it's designed to scale and evolve with user needs.

For questions or support, refer to the codebase or contact the development team.
