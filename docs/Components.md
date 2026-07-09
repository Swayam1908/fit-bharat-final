# Components Guide

This document lists the core reusable layout and input components in **FitBharat**.

---

## 1. Primary Components System

### `Button` (UI)
* **Path**: `components/ui/Button.tsx`
* **Props**:
  * `variant`: `"primary" | "secondary" | "outline" | "destructive"`
  * `size`: `"sm" | "md" | "lg"`
  * `isLoading`: `boolean`
* **Style**: Encapsulates Framer Motion scale-taps and custom shimmer reflections on hover.

### `GlassCard` (UI)
* **Path**: `components/ui/GlassCard.tsx`
* **Props**:
  * `variant`: `"standard" | "dark" | "sage"`
  * `noHover`: `boolean`
* **Style**: Enforces a `24px` internal padding and glassmorphic styling parameters.

---

## 2. Dynamic Layout Components

### `Sidebar` (Layout)
* **Path**: `components/layout/Sidebar.tsx`
* **Functions**: Keeps active route pathways highlighted with uniform heights, while fixing user profile metadata at the bottom-left edge.

### `Navbar` (Layout)
* **Path**: `components/layout/Navbar.tsx`
* **Functions**: Houses search metrics, notification lists, and light/dark theme toggle triggers.

### `GardenWidget` (Garden)
* **Path**: `components/garden/GardenWidget.tsx`
* **Functions**: Renders dynamic canvas landscapes using client-side Zustand store states.
