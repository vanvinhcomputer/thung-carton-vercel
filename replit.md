# Thùng Carton Biên Hòa - Landing Page

## Overview

This is a Vietnamese B2B landing page for Bao Bì Carton Hoàng Nam Như, a carton box manufacturing company located in Biên Hòa, Đồng Nai, Vietnam. The application is built as a high-performance static site optimized for lead generation and conversion tracking.

## System Architecture

The application follows a modern JAMstack architecture with static site generation (SSG) for optimal performance:

- **Framework**: Astro 5.9.2 with static output mode
- **Styling**: TailwindCSS with custom design system
- **Deployment**: Vercel with Singapore region targeting
- **Analytics**: Triple tracking setup (Vercel Speed Insights, Google Analytics 4, Facebook Pixel)
- **Performance**: Optimized for Core Web Vitals and PageSpeed scores 90+

## Key Components

### Frontend Architecture
- **Static Site Generation**: Uses Astro's `output: 'static'` mode for maximum performance
- **Component Structure**: Modular Astro components for Hero, Benefits, Products, Contact, and Footer sections
- **Responsive Design**: Mobile-first approach with TailwindCSS utility classes
- **Image Optimization**: Sharp service for automatic image processing and WebP conversion
- **Video Integration**: Background hero video with autoplay and layout stability optimizations

### Performance Optimizations
- **Critical Resource Preloading**: Hero images and videos preloaded for faster initial render
- **Layout Stability**: CSS containment and explicit dimensions to prevent CLS
- **Lazy Loading**: Intersection Observer API for images and videos
- **Service Worker**: Aggressive caching strategy for static assets
- **Bundle Optimization**: Code splitting with manual chunks for vendor libraries

### Analytics Integration
- **Vercel Speed Insights**: Automatic Core Web Vitals tracking
- **Vercel Web Analytics**: Pageview and user behavior tracking
- **Google Analytics 4**: Enhanced ecommerce and conversion tracking
- **Facebook Pixel**: Retargeting and event tracking
- **Auto Event Tracking**: Automatic tracking of CTA buttons, form submissions, and user interactions

## Data Flow

1. **Static Build Process**: Astro generates static HTML/CSS/JS during build time
2. **Asset Pipeline**: Images and videos processed through Sharp and optimized for web delivery
3. **Client-Side Hydration**: Minimal JavaScript for interactive components (product tabs, forms)
4. **Analytics Pipeline**: Events flow to Vercel → GA4 → Facebook Pixel simultaneously
5. **Lead Generation**: Contact forms capture leads with tracking attribution

## External Dependencies

### Core Dependencies
- `@astrojs/vercel`: Vercel adapter with Speed Insights and Web Analytics
- `@vercel/speed-insights`: Core Web Vitals tracking
- `@vercel/analytics`: User behavior analytics
- `sharp`: Image processing and optimization
- `express`: Development server support

### Integrations
- **Google Analytics 4**: Configured via `VITE_GA_MEASUREMENT_ID`
- **Facebook Pixel**: Configured via `VITE_FB_PIXEL_ID`
- **Vercel Analytics**: Automatically enabled through adapter
- **TailwindCSS**: Utility-first CSS framework with custom theme

### Media Assets
- **Hero Video**: 23MB optimized MP4 with fallback poster
- **Product Images**: 93 authentic product photos in WebP format
- **Icons**: Custom SVG favicon and manifest icons

## Deployment Strategy

### Vercel Configuration
- **Region**: Singapore (sin1) for optimal Vietnam user experience
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Auto-detected as Astro
- **Environment Variables**: Required for GA4 and Facebook Pixel IDs

### Performance Targets
- **Build Time**: ~3 minutes
- **Load Time**: <1 second for Vietnam users
- **PageSpeed Score**: 90+ mobile/desktop
- **Core Web Vitals**: All green metrics

### Security Headers
- Content Security Policy with trusted domains
- XSS Protection and frame options
- HTTPS-only with HSTS
- Cache-Control headers for optimal caching

## Changelog

- June 13, 2025 18:12: Verified build structure matches successful deployment exactly
- June 13, 2025 18:00: Cleaned up deployment files, restored working backup from 10:00
- June 13, 2025 17:40: Created vercel-assets-fixed.tar.gz - working deployment package  
- June 13, 2025 10:00: Successfully deployed with Speed Insights integration
- June 13, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.