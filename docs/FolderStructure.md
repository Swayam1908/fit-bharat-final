# Folder Structure

This map highlights the architecture and folder layouts of the refactored **FitBharat** codebase.

---

## 1. Visual File Index

```
fitbharat-web/
├── app/                      # App router route definitions
│   ├── (auth)/               # Credentials registration, login, and recovery
│   ├── (dashboard)/          # High-performance charts & settings pages
│   ├── api/                  # NLP meal parser API routes
│   └── globals.css           # CSS variables overrides
├── components/               # Modular components index
│   ├── ui/                   # Theme token elements (Button, Card, Input)
│   ├── layout/               # Global components (Navbar, Sidebar)
│   └── garden/               # SVG graphic modules
├── constants/                # Immutable files (foods databases split lists)
├── docs/                     # Architectural documentation guides
├── lib/                      # Supabase DB connectors
├── providers/                # Session contexts wrappers
└── store/                    # Zustand client variables stores
```

---

## 2. Component Layout Mapping
- **`components/ui/`**: General buttons, inputs, dropdown selection bars, and typography layouts that adhere strictly to the 8px spacing rules.
- **`components/layout/`**: Sticky top glass bar (`Navbar.tsx`) and left navigation split panel (`Sidebar.tsx`).
- **`components/garden/`**: Plant canvas animation and metrics status indicator.
