# PropGroup Design System 🎨

## Overview

The PropGroup design system is a modern, futuristic UI framework designed for a professional real estate investment platform. It features a cohesive color palette, glassmorphism effects, smooth animations, and full mobile responsiveness.

---

## 🎨 Color Palette

### Primary Colors (Deep Blue to Cyan Gradient)
```css
--pg-primary-900: #0a1628 (Darkest - Backgrounds)
--pg-primary-800: #0f2439
--pg-primary-700: #15304b
--pg-primary-600: #1e4976
--pg-primary-500: #2563eb (Main Primary)
--pg-primary-400: #3b82f6
--pg-primary-300: #60a5fa
--pg-primary-200: #93c5fd
--pg-primary-100: #dbeafe (Lightest - Badges)
```

### Secondary Colors (Electric Purple to Magenta)
```css
--pg-secondary-900: #2d1b4e
--pg-secondary-800: #3d2765
--pg-secondary-700: #4c1d95
--pg-secondary-600: #6d28d9
--pg-secondary-500: #8b5cf6 (Main Secondary)
--pg-secondary-400: #a78bfa
--pg-secondary-300: #c4b5fd
--pg-secondary-200: #ddd6fe
--pg-secondary-100: #ede9fe
```

### Accent Colors (Cyan to Teal)
```css
--pg-accent-900: #083344
--pg-accent-600: #0891b2
--pg-accent-500: #06b6d4 (Main Accent)
--pg-accent-400: #22d3ee
--pg-accent-300: #67e8f9
--pg-accent-200: #a5f3fc
--pg-accent-100: #cffafe
```

### Neutral Colors
```css
--pg-neutral-950: #030712 (Almost Black)
--pg-neutral-900: #0f172a (Dark Backgrounds)
--pg-neutral-800: #1e293b
--pg-neutral-700: #334155
--pg-neutral-600: #475569
--pg-neutral-500: #64748b (Mid Gray)
--pg-neutral-400: #94a3b8
--pg-neutral-300: #cbd5e1
--pg-neutral-200: #e2e8f0
--pg-neutral-100: #f1f5f9
--pg-neutral-50: #f8fafc (Almost White)
```

### Semantic Colors
```css
--pg-success: #10b981 (Green)
--pg-warning: #f59e0b (Amber)
--pg-error: #ef4444 (Red)
--pg-info: #3b82f6 (Blue)
```

---

## 🌈 Gradients

### Pre-defined Gradients
```css
--pg-gradient-primary: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)
--pg-gradient-secondary: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)
--pg-gradient-accent: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)
--pg-gradient-warm: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)
--pg-gradient-success: linear-gradient(135deg, #10b981 0%, #06b6d4 100%)
--pg-gradient-dark: linear-gradient(135deg, #0a1628 0%, #1e293b 100%)
```

### Usage Examples
```jsx
{/* Background gradient */}
<div className="bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b]">

{/* Text gradient */}
<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
  Gradient Text
</span>

{/* Button gradient */}
<button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
  Click Me
</button>
```

---

## 🎭 Component Classes

### Glass Cards (Glassmorphism)

**Light Mode:**
```jsx
<div className="pg-glass-card">
  Glass card content
</div>
```

**Features:**
- Semi-transparent background with blur effect
- Subtle border
- Hover elevation
- Smooth transitions

**CSS:**
```css
.pg-glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--pg-radius-2xl);
  box-shadow: var(--pg-shadow-lg);
}
```

### Gradient Text

```jsx
{/* Primary gradient text */}
<span className="pg-gradient-text">Gradient Text</span>

{/* Secondary gradient text */}
<span className="pg-gradient-text-secondary">Gradient Text</span>

{/* Accent gradient text */}
<span className="pg-gradient-text-accent">Gradient Text</span>

{/* Or use Tailwind */}
<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
  Gradient Text
</span>
```

### Buttons

```jsx
{/* Primary Button */}
<button className="pg-btn pg-btn-primary">
  Primary Action
</button>

{/* Secondary Button */}
<button className="pg-btn pg-btn-secondary">
  Secondary Action
</button>

{/* Outline Button */}
<button className="pg-btn pg-btn-outline">
  Outline Button
</button>

{/* Ghost Button */}
<button className="pg-btn pg-btn-ghost">
  Ghost Button
</button>

{/* With Tailwind (Modern Approach) */}
<button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all hover:scale-105">
  Modern Button
</button>
```

### Badges

```jsx
{/* Primary Badge */}
<span className="pg-badge pg-badge-primary">
  <Sparkles className="w-4 h-4" />
  AI-Powered
</span>

{/* Success Badge */}
<span className="pg-badge pg-badge-success">
  Verified
</span>

{/* Custom Badge with Tailwind */}
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
  <Sparkles className="w-4 h-4 text-cyan-400" />
  <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
    Featured
  </span>
</div>
```

---

## ✨ Animations

### Fade In Animations

```jsx
{/* Basic fade in */}
<div className="pg-fade-in">Content</div>

{/* Fade in from bottom */}
<div className="pg-fade-in-up">Content</div>

{/* With stagger delay */}
<div className="pg-fade-in-up pg-stagger-1">Item 1</div>
<div className="pg-fade-in-up pg-stagger-2">Item 2</div>
<div className="pg-fade-in-up pg-stagger-3">Item 3</div>
```

### Floating Animation

```jsx
<div className="pg-float">
  Floating Element
</div>
```

### Pulse Glow Effect

```jsx
<div className="pg-pulse-glow">
  Glowing Element
</div>
```

### Shimmer Effect

```jsx
<div className="pg-shimmer">
  Shimmer on hover
</div>
```

### Animated Gradient Background

```jsx
<div className="pg-animated-gradient">
  Animated gradient background
</div>
```

---

## 📐 Spacing System

```css
--pg-space-xs: 0.25rem    /* 4px */
--pg-space-sm: 0.5rem     /* 8px */
--pg-space-md: 1rem       /* 16px */
--pg-space-lg: 1.5rem     /* 24px */
--pg-space-xl: 2rem       /* 32px */
--pg-space-2xl: 3rem      /* 48px */
--pg-space-3xl: 4rem      /* 64px */
--pg-space-4xl: 6rem      /* 96px */
```

**Usage:**
```jsx
<div className="px-4 py-8 sm:px-6 lg:px-8">
  {/* Mobile: 16px, Tablet: 24px, Desktop: 32px */}
</div>
```

---

## 🎯 Border Radius

```css
--pg-radius-sm: 0.375rem   /* 6px */
--pg-radius-md: 0.5rem     /* 8px */
--pg-radius-lg: 0.75rem    /* 12px */
--pg-radius-xl: 1rem       /* 16px */
--pg-radius-2xl: 1.5rem    /* 24px */
--pg-radius-3xl: 2rem      /* 32px */
--pg-radius-full: 9999px   /* Fully rounded */
```

**Usage:**
```jsx
<div className="rounded-xl">Standard card</div>
<div className="rounded-2xl">Large card</div>
<button className="rounded-full">Pill button</button>
```

---

## 🌑 Dark Mode

All components are dark mode compatible. Use Tailwind's `dark:` variant:

```jsx
<div className="bg-white dark:bg-[#0a1628] text-gray-900 dark:text-white">
  Auto dark mode support
</div>
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
sm: 640px   (Mobile landscape, tablets)
md: 768px   (Tablets)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra large desktop)
```

### Mobile-First Approach

```jsx
<div className="
  text-2xl          /* Mobile: 24px */
  sm:text-3xl       /* Tablet: 30px */
  lg:text-4xl       /* Desktop: 36px */
  xl:text-5xl       /* Large: 48px */
">
  Responsive heading
</div>

<div className="
  grid
  grid-cols-1       /* Mobile: 1 column */
  sm:grid-cols-2    /* Tablet: 2 columns */
  lg:grid-cols-3    /* Desktop: 3 columns */
  gap-4 sm:gap-6 lg:gap-8
">
  {/* Responsive grid */}
</div>
```

---

## 🎪 Background Effects

### Animated Blobs

```jsx
<div className="relative overflow-hidden">
  {/* Blue blob */}
  <div
    className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-[120px]"
    style={{
      background: 'radial-gradient(circle, #2563eb 0%, transparent 70%)',
      animation: 'pg-blob-float 20s ease-in-out infinite',
    }}
  />

  {/* Purple blob */}
  <div
    className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-[120px]"
    style={{
      background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
      animation: 'pg-blob-float 18s ease-in-out infinite',
      animationDelay: '7s',
    }}
  />
</div>
```

### Grid Pattern

```jsx
<div className="absolute inset-0 pg-grid-pattern opacity-[0.02]" />
```

### Dot Pattern

```jsx
<div className="absolute inset-0 pg-dot-pattern opacity-30" />
```

---

## 🖼️ Component Patterns

### Hero Section Pattern

```jsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b]">
  {/* Animated blobs */}
  <div className="absolute inset-0">
    {/* Blobs here */}
  </div>

  {/* Grid overlay */}
  <div className="absolute inset-0 pg-grid-pattern opacity-[0.02]" />

  {/* Content */}
  <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Your content */}
  </div>
</section>
```

### Feature Card Pattern

```jsx
<div className="pg-glass-card bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 sm:p-8 group hover:border-blue-300 dark:hover:border-cyan-500/50 transition-all">
  {/* Icon */}
  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform">
    <Icon className="w-7 h-7 text-white" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
    Feature Title
  </h3>

  {/* Description */}
  <p className="text-gray-600 dark:text-slate-400">
    Feature description
  </p>
</div>
```

### Stat Card Pattern

```jsx
<div className="pg-glass-card bg-white/5 border border-white/10 p-6 sm:p-8 group hover:border-white/20 transition-all">
  {/* Icon */}
  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg group-hover:scale-110 transition-transform">
    <TrendingUp className="w-7 h-7 text-white" />
  </div>

  {/* Value */}
  <div className="text-4xl font-black text-white mt-4 mb-2 group-hover:text-cyan-400 transition-colors">
    12.5%
  </div>

  {/* Label */}
  <div className="text-sm text-slate-400">Average ROI</div>
</div>
```

---

## 🎬 Usage Examples

### Complete Component Example

```jsx
import { Sparkles, TrendingUp } from 'lucide-react'

export function ExampleSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-[#0a1628] via-[#0f2439] to-[#1e293b] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pg-dot-pattern opacity-30" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6 pg-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Featured
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 pg-fade-in-up pg-stagger-1">
            Your Amazing{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Headline
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-slate-300 pg-fade-in-up pg-stagger-2">
            Compelling description text
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((item, index) => (
            <div
              key={item}
              className="pg-glass-card bg-white/5 border-white/10 p-6 sm:p-8 group hover:border-cyan-500/50 transition-all pg-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3">Card Title</h3>
              <p className="text-slate-400">Card description</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 🛠️ Best Practices

### 1. **Mobile-First**
Always start with mobile styles, then add responsive breakpoints.

```jsx
<div className="text-2xl sm:text-3xl lg:text-4xl">
  Mobile first
</div>
```

### 2. **Consistent Spacing**
Use the spacing system for consistent padding/margins.

```jsx
<div className="p-4 sm:p-6 lg:p-8">
  Consistent spacing
</div>
```

### 3. **Dark Mode Support**
Always provide dark mode variants.

```jsx
<div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
  Dark mode ready
</div>
```

### 4. **Performance**
- Use `will-change` sparingly (already in design system)
- Prefer `transform` over position changes
- Use CSS animations over JavaScript when possible

### 5. **Accessibility**
- Maintain proper contrast ratios
- Use semantic HTML
- Add `aria-label` to icon buttons

```jsx
<button aria-label="Close menu" className="pg-btn">
  <X className="w-5 h-5" />
</button>
```

---

## 📦 File Structure

```
apps/web/src/
├── styles/
│   └── design-system.css         # Design system classes
├── app/
│   └── globals.css                # Global styles + design system import
└── components/
    └── home/
        ├── HeroSectionNew.tsx     # New hero with AI search
        ├── FeaturesSectionNew.tsx # Features with new design
        ├── StatsSectionNew.tsx    # Animated stats
        └── CTASectionNew.tsx      # Modern CTA
```

---

## 🎨 Color Usage Guidelines

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Page Background | `bg-white` or `from-slate-50 to-blue-50` | `from-[#0a1628] to-[#1e293b]` |
| Card Background | `bg-white/80` | `bg-white/5` |
| Text Primary | `text-gray-900` | `text-white` |
| Text Secondary | `text-gray-600` | `text-slate-300` |
| Text Muted | `text-gray-500` | `text-slate-400` |
| Borders | `border-gray-200` | `border-white/10` |
| Gradients | `from-cyan-500 to-blue-600` | `from-cyan-400 to-blue-500` |

---

## ✅ Implementation Checklist

- [x] Color palette defined
- [x] Component classes created
- [x] Animations implemented
- [x] Responsive breakpoints set
- [x] Dark mode support added
- [x] Landing page redesigned
- [x] Mobile-friendly confirmed
- [x] Documentation complete

---

## 🚀 Next Steps

1. Apply design system to other pages (properties, admin, portal)
2. Create reusable component library
3. Add more animation variants
4. Implement theme customization
5. Create Storybook documentation

---

**Last Updated:** 2025-01-23
**Version:** 1.0.0
**Author:** PropGroup Development Team
