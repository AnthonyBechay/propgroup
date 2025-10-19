# 🤖 PropGroup AI Property Search - Quick Start Guide

## What's New

Your PropGroup real estate platform now includes a powerful AI-powered property search system that makes finding the perfect investment property as easy as having a conversation!

## 🌟 Key Features

### 1. **Natural Language Search**
Simply describe what you want in plain English:
- "I want a 3-bedroom apartment in Cyprus under $400k"
- "Show me Golden Visa eligible properties in Greece"
- "Find me properties with the best ROI"

### 2. **Multiple Access Points**
- **Homepage**: Toggle between AI and traditional search
- **Properties Page**: Integrated AI search banner
- **Floating Assistant**: Always available via the blue bot icon (bottom-right)
- **Dedicated Page**: Full AI search experience at `/ai-search`

### 3. **Smart Admin Panel**
- Real-time analytics and statistics
- Configure AI settings
- View popular search queries
- Toggle features on/off

## 🚀 Quick Start

### For Users

1. **Homepage Search**:
   - Visit the homepage
   - You'll see "AI Search" selected by default
   - Type what you're looking for
   - Click search or press Enter

2. **Floating Assistant**:
   - Look for the blue bot icon in the bottom-right corner
   - Click it to open the chat
   - Type your query or click a suggestion
   - Results appear automatically

3. **Properties Page**:
   - Go to `/properties`
   - Click "Try AI Search" banner
   - Use natural language to filter properties

### For Admins

1. **Access AI Settings**:
   - Login to admin panel
   - Click "AI Settings" in sidebar
   - View statistics and configure options

2. **Monitor Usage**:
   - See total AI searches
   - Track success rates
   - Review popular queries

## 📝 Example Searches

### Basic
```
- "2 bedroom apartment in Cyprus"
- "Properties under $500k"
- "Houses in Greece"
```

### Advanced
```
- "3-bedroom apartment in Cyprus under $400k with good ROI"
- "Golden Visa properties between $250k-$500k"
- "New build with rental potential in Georgia"
```

### Investment-Focused
```
- "Properties with highest ROI"
- "Passive income opportunities"
- "Golden Visa eligible investments"
```

## 🛠️ Technical Stack

### Frontend
- **React/Next.js 15**: Main framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Lucide Icons**: Icon library

### Backend
- **Node.js/Express**: API server
- **Prisma**: Database ORM
- **Zod**: Schema validation

### Components
- `AIPropertySearch`: Main search component
- `AIAssistantFab`: Floating assistant button
- Admin settings page

## 📂 File Structure

```
apps/
├── web/
│   └── src/
│       ├── components/
│       │   └── ai/
│       │       ├── AIPropertySearch.tsx
│       │       └── AIAssistantFab.tsx
│       └── app/
│           ├── ai-search/
│           │   └── page.tsx
│           └── (admin)/
│               └── admin/
│                   └── ai-settings/
│                       └── page.tsx
└── backend/
    └── src/
        └── routes/
            └── ai-search.js
```

## 🎨 UI Components

### AIPropertySearch
- **Props**: `variant`, `onSearch`, `placeholder`
- **Variants**: `inline`, `modal`, `page`
- **Features**: Real-time parsing, suggestions, chat interface

### AIAssistantFab
- **Location**: Bottom-right corner
- **Features**: Floating button, modal overlay, chat interface

## 🔧 Configuration

### Admin Settings
Configure these options in the admin panel:

1. **Enable AI Search**: Toggle AI search globally
2. **Floating Assistant**: Show/hide floating bot
3. **Default Search Mode**: Set AI or traditional as default
4. **Max Results**: Limit properties returned (25-200)
5. **Response Timeout**: Set processing timeout (5-30s)

## 📊 Analytics

Track these metrics in the admin panel:
- Total AI searches
- Success rate
- Average response time
- Popular search queries

## 🌐 API Endpoints

### POST `/api/ai-search`
Search properties using natural language

**Request**:
```json
{
  "query": "3 bedroom apartment in Cyprus under $400k"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "filters": {...},
    "summary": "I found 23 properties...",
    "properties": [...],
    "count": 23
  }
}
```

### GET `/api/ai-search/suggestions`
Get search suggestions

## 🎯 Supported Query Patterns

### Countries
- Georgia, Cyprus, Greece, Lebanon
- Case-insensitive matching

### Price Ranges
- "under $500k" → Max: $500,000
- "over $300k" → Min: $300,000
- "between $300k and $500k" → Range

### Bedrooms/Bathrooms
- "3 bedroom" → Exactly 3
- "2-4 bedrooms" → Range 2-4

### Investment Goals
- "golden visa" → Golden Visa eligible
- "high ROI" → Sorted by ROI
- "rental income" → Rental yield focus

### Property Status
- "off plan" → Off-plan properties
- "new build" → New constructions
- "resale" → Existing properties

## 🚨 Troubleshooting

### AI Search Not Appearing
1. Check if `AIAssistantFab` is in layout.tsx
2. Verify all component files exist
3. Clear browser cache

### Navigation Links Not Working
1. Verify routes in Next.js app directory
2. Check middleware configuration
3. Review navbar component

### Backend API Issues
1. Ensure backend server is running
2. Check API route registration
3. Review server logs

## 📱 Mobile Support

- Fully responsive design
- Touch-optimized interactions
- Mobile-friendly chat interface
- Adaptive layouts

## ♿ Accessibility

- Keyboard navigation support
- Screen reader compatible
- ARIA labels on all interactive elements
- High contrast color scheme

## 🔐 Security

- Input validation on backend
- SQL injection prevention (Prisma)
- XSS protection
- Rate limiting ready

## 🎓 Best Practices

### For Users
1. Be specific in your queries
2. Include key criteria (bedrooms, location, budget)
3. Use natural, conversational language
4. Try the suggestions for inspiration

### For Admins
1. Monitor popular queries monthly
2. Review success rates regularly
3. Adjust max results based on performance
4. Keep timeout settings reasonable

## 🔄 Updates & Maintenance

### Regular Tasks
- Review search analytics weekly
- Update parser patterns monthly
- Monitor performance metrics
- Gather user feedback

### Future Enhancements
- AI/ML service integration (OpenAI/Claude)
- Multi-language support
- Voice search capability
- Advanced recommendations
- Search history & saved searches

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review the detailed technical docs
3. Contact the development team

## 🎉 Getting Started Now!

1. Visit your homepage
2. See the AI search interface
3. Type "3 bedroom apartment in Cyprus"
4. Watch the magic happen!

---

**Built with ❤️ for PropGroup - Making real estate investment smarter, one search at a time.**
