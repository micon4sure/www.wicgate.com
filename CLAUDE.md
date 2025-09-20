# CLAUDE.md - WiCGate Gaming Platform

**What this is:** Vue 3 + TypeScript single-page application for World in Conflict gaming community featuring authentic Massgate-inspired military design. Real-time player tracking, structured leaderboards, Discord events, community integration, and comprehensive military-themed interface.

## 🔧 Development Setup

```bash
# Install and run
npm install
npm run dev          # Development server (localhost:5175)

# Code quality (run these before commits)
npm run lint         # Check for errors
npm run lint:fix     # Auto-fix lint issues
npm run format       # Format code with Prettier

# Production
npm run build        # Build for production (1.76s)
npm run preview      # Preview production build
```

## 🎨 Visual Design & Theme

### Massgate-Inspired Military Aesthetic
**Complete visual redesign** implementing authentic original Massgate military design language:

- **Theme Transformation:** From modern green cards → Military orange/amber structured layouts
- **Color Scheme:** Authentic orange (`#e67e22`) and amber (`#f39c12`) matching original Massgate
- **Typography:** Military-style fonts (Rajdhani, Oswald) with structured hierarchy
- **Layout Pattern:** Sharp, structured military interfaces vs modern rounded cards
- **Navigation:** Tab-style orange navigation system matching original Massgate design

### Military Typography System
**Google Fonts Integration:**
- **Primary:** Rajdhani (500-700 weights) for body text and structured data
- **Headers:** Oswald (400-700 weights) for military authority and commands
- **Data Display:** Monospace (Courier New) for player names, scores, and military codes
- **Text Classes:** `.text-command`, `.text-tactical`, `.military-data`, `.rank-display`

### Color System Implementation
**Military Orange/Amber Palette:**
```css
--mg: #e67e22;        /* Primary orange (Massgate tabs) */
--mg-dark: #d35400;   /* Darker amber for depth */
--sw: #f39c12;        /* Warm amber accent */
--sw-light: #f8c471;  /* Lighter amber highlights */
```

**RGB Implementations:**
- Shadows & Glows: `rgba(230, 126, 34, *)` throughout all components
- Button effects: Orange gradients with military authority
- Table borders: Structured amber accent lines

## 🏗️ What Was Done (Military Redesign & Architecture)

### Comprehensive Visual Transformation
- **Navigation:** Modern navigation → Military tab-style system with clip-path styling
- **Leaderboards:** Card layouts → Structured military tables with rank authority
- **Buttons:** Modern rounded → Sharp military command buttons with borders
- **Typography:** System fonts → Military font hierarchy (Rajdhani/Oswald)
- **Colors:** Green theme → Authentic Massgate orange/amber throughout

### Component Architecture Redesign
- **Tab Navigation:** Authentic Massgate-style orange tabs with hover states
- **Military Tables:** Structured borders, rank highlighting, amber accents
- **Command Buttons:** Sharp rectangular design with military gradients
- **Data Display:** Monospace military formatting for stats and names
- **Structured Containers:** Sharp borders replacing modern card aesthetics

### CSS Modularization (Enhanced)
- **Before:** Single 2783-line `base.css` file (hard to maintain)
- **After:** 20+ organized CSS modules with military-themed components
- **Enhanced Files:** `typography.css` (military fonts), `navigation.css` (tab system), `leaderboards.css` (structured tables), `buttons.css` (military styling)
- **Result:** Authentic military design with maintainable modular architecture

### Recent Major Updates
- **Military Visual Redesign:** Complete transformation to Massgate-inspired design
- **Typography System:** Google Fonts integration with military hierarchy
- **Navigation Redesign:** Tab-style military navigation with orange theming
- **Component Overhaul:** Leaderboards, buttons, and UI elements redesigned
- **Color Implementation:** Orange/amber theme replacing green throughout

## 📁 Project Structure

```
src/
├── assets/styles/
│   ├── base.css                  # ACTIVE: imports all military-themed modules
│   ├── base-old.css              # LEGACY: original monolithic CSS
│   └── modules/                  # Military-themed CSS modules
│       ├── variables.css         # Orange/amber military color system
│       ├── typography.css        # Military fonts (Rajdhani/Oswald)
│       ├── buttons.css           # Military command button system
│       └── components/           # Military-styled components
│           ├── navigation.css    # Tab-style military navigation
│           ├── leaderboards.css  # Structured military tables
│           ├── hero.css          # Military-themed hero section
│           └── [other components] # All with military styling
├── components/                   # Vue components with military theming
├── screens/                      # Section components with military design
├── views/                        # Main pages with military aesthetics
├── composables/                  # API integration (unchanged)
├── utils/                        # Shared functions (unchanged)
├── stores/                       # State management (unchanged)
├── content/                      # Static content (unchanged)
├── api-types.ts                  # TypeScript interfaces (unchanged)
└── main.ts                       # App entry with military theme
```

## 🛠️ Tech Stack

**Core:**
- Vue 3.4.29 (Composition API with `<script setup>`)
- TypeScript 5.4.5 (strict mode)
- Vue Router 4.3.0 (with code splitting)
- Vite 5.2.0 (build tool)

**Military-Themed Styling:**
- Modular CSS architecture (20+ modules) with military design
- Google Fonts: Rajdhani + Oswald for military typography
- Sass 1.92.1 for preprocessing
- Font Awesome 6.5.2 for icons
- Mobile-first responsive design maintaining military aesthetics

**Data & API:**
- Axios 1.12.2 for HTTP requests
- Lodash 4.17.21 (tree-shaken)
- API endpoint: `https://www.wicgate.com/api`
- Environment variable: `VITE_API_BASE`

## 🎖️ Military UI Components

### Tab-Style Navigation
**Authentic Massgate Design with Advanced Responsiveness:**
- Orange tab system with clip-path styling
- Active state: Bold orange background with amber borders
- Hover effects: Military-style elevation and glow
- **6-tier responsive system:** Progressive sizing from 1200px to mobile
- **Flexible layout:** Prevents clipping on any screen size
- **Uniform tab sizing:** Consistent appearance across all navigation elements
- Mobile: Collapsible military-themed mobile menu
- Typography: Oswald font with uppercase military styling

### Structured Military Tables
**Leaderboard System:**
- Sharp rectangular containers with orange borders
- Structured table format (vs modern cards)
- Military rank highlighting (gold/silver/bronze with glow effects)
- Monospace player names and clan tags
- Amber accent lines and military typography

### Command Button System
**Military Authority Design:**
- Sharp rectangular buttons (no border radius)
- Orange gradient backgrounds with military borders
- Button variants: Primary, Secondary, Outline, Danger
- Typography: Oswald font with uppercase military styling
- Active states: Military-style depression effects

### Military Data Display
**Structured Information:**
- Monospace fonts for stats, names, and codes
- Orange highlights for important data
- Military-style rank insignia integration
- Structured borders and amber accent lines
- Authority-based typography hierarchy

## 📦 Build Output

Production build creates optimized chunks:
- **vendor-[hash].js** (91.48kB): Vue, Vue Router
- **index-[hash].js** (79.47kB): Main application code with military theming
- **lodash-[hash].js** (70.48kB): Utility functions
- **GameMode-[hash].js** (2.45kB): Dashboard page with military styling
- **index-[hash].css** (115.17kB): All military-themed styles combined

## 🌟 Key Features

**Military-Themed Site Sections:**
1. **Hero/Home** - Sharp military design, square icons, military typography, structured layout
2. **Getting Started** - Military button styling, amber accents
3. **Statistics** - Structured military tables, rank authority display
4. **Community** - Clean military-themed integration panels, optimized video components
5. **About** - Military typography and structured information display
6. **FAQ** - Clean military-styled organization with reduced visual noise

**Military-Styled Gaming Data:**
- Live player counts with military display formatting
- Structured military leaderboard tables (not cards)
- Military rank highlighting with authority-based styling
- Game Mode dashboard with military aesthetics

**Authentic Military Design Elements:**
- Tab-style navigation matching original Massgate
- Orange/amber color scheme throughout
- Military typography hierarchy (command, tactical, data)
- Structured borders and sharp geometric design
- Authority-based visual hierarchy

**Preserved Modern Functionality:**
- Mobile-first responsive design with military theming
- Touch-optimized interactions maintaining military aesthetics
- Smooth animations with military-style transitions
- All original features with enhanced military presentation

## 🔒 Security Features

- **XSS Protection:** User input (player names) rendered safely as plain text
- **Server Names:** Admin-controlled content with military styling
- **Secure Dependencies:** All packages updated to patch vulnerabilities
- **Production Safety:** Debug information removed from production builds

## 🚀 Deployment

**GitHub Pages Ready:**
- Automatic deployment with military theme
- Supports both custom domain and GitHub Pages subpath
- SPA routing with fallback handling
- Optimized military-themed asset caching

**Environment Setup:**
```bash
# Optional: Set custom API endpoint
VITE_API_BASE=https://your-api-domain.com/api
```

## ✅ Current Status

**Production Ready** - Polished military-themed design complete, all features working, performance optimized.

- Zero lint errors, TypeScript strict mode
- Complete Massgate-inspired military visual design with latest refinements
- All original functionality preserved with enhanced presentation
- Security vulnerabilities resolved
- **Advanced responsive design** - Zero clipping issues on any screen size
- **Visual noise reduction** - Clean, professional appearance while maintaining military authority
- **Optimized user experience** - Smooth interactions across all devices
- Authentic orange/amber color scheme throughout with tasteful restraint

## 📚 Content Management

**Military-Themed Content Structure:**
- `aboutProject`: Mission with military typography
- `teamMembers`: Team profiles with military styling
- `projectValues`: Core principles with structured military presentation
- All content enhanced with military design language

**Military Navigation Structure:**
1. Getting Started → Installation with military button styling
2. Statistics → Military-structured leaderboard tables
3. Community → Military-themed integration panels
4. About → Project information with military typography
5. FAQ → Military-styled troubleshooting

## 🎨 Military CSS Architecture

### Enhanced Modular System (20+ modules)
**Core Military Modules:**
- **variables.css:** Orange/amber military color system
- **reset.css:** Base setup with military font integration
- **typography.css:** Military font hierarchy (Rajdhani/Oswald)
- **buttons.css:** Military command button system
- **layout.css:** Structured military layout patterns

**Military Component Modules:**
- **navigation.css:** Tab-style military navigation system
- **leaderboards.css:** Structured military table design
- **hero.css:** Military-themed hero section
- **about.css:** Military typography and layout
- **community.css:** Military-styled integration panels

**Military Design Patterns:**
- Sharp geometric design (no border radius)
- Orange/amber accent system throughout
- Military typography hierarchy
- Structured borders and authority-based layouts
- Authentic Massgate design language

## 🔧 Military Theme Implementation

### Google Fonts Integration
**Font Loading** (`index.html`):
```html
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Oswald:wght@200;300;400;500;600;700&display=swap" rel="stylesheet">
```

### Military Color System
**CSS Variables** (`variables.css`):
```css
--mg: #e67e22;        /* Primary orange (Massgate) */
--mg-dark: #d35400;   /* Darker amber */
--sw: #f39c12;        /* Warm amber accent */
--sw-light: #f8c471;  /* Lighter amber */
```

### Typography Hierarchy
**Military Font Usage:**
- **Headers:** Oswald for military authority
- **Body:** Rajdhani for structured readability
- **Data:** Courier New for military precision
- **All text:** Uppercase transforms where appropriate

## 🐛 Troubleshooting

```bash
# Clear cache and reinstall if issues
rm -rf node_modules dist .vite
npm install

# Check for type errors
npx tsc --noEmit

# Security audit
npm audit
```

**Common Issues:**
- **Military theme not loading:** Verify Google Fonts connection and CSS imports
- **Orange colors not showing:** Check CSS variable definitions in `variables.css`
- **Military fonts not displaying:** Ensure Google Fonts are loaded in `index.html`
- **Navigation tabs broken:** Check clip-path support and tab styling
- **Table styling issues:** Verify military table CSS in `leaderboards.css`
- **Button styling broken:** Check military button system in `buttons.css`

**Design-Specific Issues:**
- **Mobile military theme:** All military styling is responsive-first
- **Tab navigation mobile:** Collapses to military-themed mobile menu
- **Color contrast:** Orange/amber theme maintains accessibility standards
- **Font loading:** Military fonts fallback to system fonts gracefully

## 📈 Recent Development History

**Latest Refinements & Optimizations (2024):**
- ✅ **Hero Section Complete Transformation** - Sharp military design, square icons, military typography, removed rounded corners
- ✅ **Community Section Military Theme** - Full military styling, clean card layouts, proper typography hierarchy
- ✅ **Navigation Responsive System** - 6-tier breakpoint system, prevents clipping, uniform tab sizing, flexible layout
- ✅ **FAQ Visual Cleanup** - Removed excessive orange lines, neutral borders, eliminated visual noise
- ✅ **Video Component Optimization** - Clean play buttons, removed orange borders, subtle hover effects
- ✅ **Mobile Navigation Polish** - Progressive element degradation, smart space management across all screen sizes

**Major Military Redesign (Initial):**
- ✅ **Complete visual transformation** to authentic Massgate military design
- ✅ **Military typography system** with Google Fonts (Rajdhani/Oswald)
- ✅ **Tab-style navigation** matching original Massgate with orange theming
- ✅ **Structured military tables** replacing modern card layouts
- ✅ **Military button system** with command-style authority design
- ✅ **Orange/amber color scheme** throughout all components
- ✅ **Preserved responsiveness** with military aesthetics on all devices

**Previous Enhancements:**
- ✅ About section implementation with mission, story, team, and values
- ✅ Navigation expanded to 5 sections with optimized responsive breakpoints
- ✅ CSS architecture improvements (20 modular files, proper component isolation)
- ✅ Content management system for team and project information
- ✅ Enhanced scroll positioning and mobile navigation
- ✅ Security hardening and performance optimization

**Military Design Principles Applied:**
- Authentic Massgate visual language recreation
- Military typography hierarchy and authority
- Structured geometric design (sharp, not rounded)
- Orange/amber military color psychology
- Command-style interface design
- Mobile-first responsive military aesthetics
- Visual noise reduction while maintaining military authority

## 🎨 Latest Design Optimizations (2024)

### Visual Noise Reduction Philosophy
**Balanced Military Aesthetic:**
The latest optimizations focused on reducing excessive orange visual elements while preserving the authentic military authority. Key principle: **Military structure with tasteful restraint**.

### Component-Specific Improvements

**Hero Section Transformation:**
- ✅ Removed all rounded corners → Sharp geometric military design
- ✅ Circular icons → Square military containers with borders
- ✅ Improved military typography integration
- ✅ Section background cleanup (removed competing red/blue tints)

**Navigation Responsive Excellence:**
- ✅ **6-tier breakpoint system:** 1200px, 1100px, 1000px, 900px, 850px, 800px
- ✅ **Progressive degradation:** Smart element sizing and space management
- ✅ **Zero clipping guarantee:** All navigation elements visible on every screen size
- ✅ **Flexible tab system:** Adapts to content while maintaining uniformity

**FAQ Visual Cleanup:**
- ✅ Removed excessive orange gradient borders → Subtle white borders
- ✅ Eliminated orange vertical accent lines → Clean content focus
- ✅ Toned down item borders → Neutral professional appearance
- ✅ Simplified hover effects → Subtle backgrounds instead of orange highlights

**Community Video Optimization:**
- ✅ Clean play button overlays → Removed orange borders
- ✅ Subtle dark backgrounds → Eliminated visual competition with content
- ✅ Professional hover states → Focus on functionality over decoration

### Responsive Design Achievements
**Universal Compatibility:**
- **Desktop (>1200px):** Full-featured military design with complete spacing
- **Large Tablet (1000px-1200px):** Optimized spacing with maintained functionality
- **Medium Tablet (900px-1000px):** Progressive element compression
- **Small Tablet (850px-900px):** Ultra-compact horizontal navigation
- **Mobile (<800px):** Vertical navigation with full feature preservation

### User Experience Improvements
**Readability & Focus:**
- Reduced visual distractions while maintaining military command presence
- Improved content hierarchy through strategic color usage
- Enhanced mobile interactions with smart responsive breakpoints
- Cleaner information architecture across all components

## 🎖️ Visual Identity

### Design Philosophy
**Authentic Military Aesthetic:**
- Recreates original Massgate design language with modern implementation
- Orange/amber color scheme matching original World in Conflict branding
- Military typography conveying authority and structure
- Sharp geometric design reflecting military precision
- Command-style interface elements for gaming authority

### Military Color Psychology
**Orange/Amber Significance:**
- **Command Authority:** Orange conveys leadership and action
- **Military Heritage:** Matches World in Conflict's military aesthetic
- **Gaming Intensity:** Energetic colors for competitive gaming
- **Brand Authenticity:** Faithful to original Massgate visual identity

### Balance of Authenticity & Usability
**Modern Standards Maintained:**
- Mobile-first responsive design within military aesthetics
- Accessibility standards met with proper color contrast
- Touch-friendly interactions with military styling
- Modern CSS techniques for performance
- Semantic structure preserved with military presentation

---
*Vue 3 SPA with authentic Massgate military design, complete modular architecture, and enterprise-grade functionality*
