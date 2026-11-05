# Longevita — Preventive Health Landing Page

A pixel-accurate, modern, and responsive reproduction of the Longevita landing page design, crafted using **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

## ✨ Features

- **Pixel-Accurate Design**: Faithfully captures every element from the reference design including typography, colors, soft watercolor gradient backdrop, and organic leaf accents.
- **Glassmorphism & Micro-Interactions**:
  - Translucent frosted glass card with blur (`Small steps today, a healthier tomorrow`)
  - Crisp white status checklist (`Monitor`, `Understand`, `Prevent`, `Thrive`) with subtle vertical float animations.
- **Brand Typography & Iconography**:
  - Google Font **Plus Jakarta Sans** with balanced line-wrapping (`text-wrap: balance` and `text-wrap: pretty`).
  - Custom dual-leaf vector brand logo mark.
  - Vector outline icons for `Track Health Markers`, `Expert Guidance`, and `Personalised Plans`.
- **Responsive Layout**: Adapts gracefully across desktop (1440px+), laptop, tablet, and mobile with a collapsible navigation drawer.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ or v22+)
- npm

### Installation

```bash
npm install
```

### Development Server

Run the local Vite development server with hot module replacement:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

Build optimized static assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
Longevita/
├── index.html              # HTML shell with Google Fonts & meta tags
├── package.json            # Project dependencies & scripts
├── vite.config.js          # Vite config
├── tailwind.config.js      # Tailwind design tokens & brand theme
├── postcss.config.js       # PostCSS config
├── src/
│   ├── main.jsx            # React root mount
│   ├── App.jsx             # Top-level page container with background gradients
│   ├── index.css           # Tailwind directives & glassmorphism utilities
│   ├── assets/
│   │   ├── hero-woman.jpg  # High-resolution wellness hero portrait
│   │   └── plant-corner.jpg# Tropical ficus corner plant accent
│   └── components/
│       ├── Navbar.jsx      # Navigation header with dual-leaf logo & action pills
│       └── Hero.jsx        # Split hero section with floating cards & pillars
└── dist/                   # Production build output
```
