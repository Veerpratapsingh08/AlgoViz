# Project Hygiene & Scalability Checklist

This document provides guidelines for maintaining AlgoViz as it grows, ensuring consistency, and preventing feature creep.

---

## 📁 Recommended Repository Structure

```
AlgoViz/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/           # GitHub Actions (future)
│       └── ci.yml
│
├── app/                     # Next.js App Router
│   ├── sorting/
│   │   └── page.tsx
│   ├── pathfinding/
│   │   └── page.tsx
│   ├── datastructures/
│   │   └── page.tsx
│   ├── race/                # Gamified Mode
│   │   └── page.tsx
│   ├── graphs/              # Freeform Graphs
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
│
├── components/              # React components
│   ├── visualizers/         # Group visualizers
│   │   ├── SortingVisualizer.tsx
│   │   ├── PathfindingVisualizer.tsx
│   │   ├── DataStructureVisualizer.tsx
│   │   ├── RaceVisualizer.tsx
│   │   └── GraphVisualizer.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Slider.tsx
│   │   ├── Select.tsx
│   │   └── Panel.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── lib/
│   ├── algorithms/          # Pure algorithm logic
│   │   ├── sorting.ts
│   │   ├── pathfinding.ts
│   │   ├── datastructures.ts
│   │   ├── graphs.ts
│   │   └── index.ts         # Barrel export
│   ├── hooks/               # Custom React hooks
│   │   ├── useAnimation.ts
│   │   └── useKeyboard.ts
│   └── utils/               # Utility functions
│       ├── array.ts
│       └── timing.ts
│
├── public/
│   └── assets/
│       ├── logo/
│       └── og-image.png     # Social preview
│
├── docs/                    # 🆕 Documentation
│   ├── OSS_USABILITY_REVIEW.md
│   └── ARCHITECTURE.md
│
├── tests/                   # 🆕 Test files (future)
│   ├── algorithms/
│   └── components/
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── package.json
└── tsconfig.json
```

---

## 🏷️ Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `SortingVisualizer.tsx` |
| Algorithm files | lowercase | `sorting.ts` |
| Utility files | lowercase | `array.ts` |
| Test files | `*.test.ts` | `sorting.test.ts` |
| Style files | lowercase | `globals.css` |
| Documentation | SCREAMING_SNAKE | `OSS_USABILITY_REVIEW.md` |

### Code Naming

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `function SortingVisualizer()` |
| Algorithm exports | PascalCase objects | `export const Sort = {}` |
| Algorithm methods | camelCase | `bubbleSort`, `mergeSort` |
| Private helpers | _prefixed | `_partition`, `_heapify` |
| Types | PascalCase | `type Step`, `type Node` |
| Constants | SCREAMING_SNAKE | `const ANIMATION_SPEED` |
| CSS classes | kebab-case | `sorting-bar`, `path-cell` |

### Algorithm Naming

| Standard Name | Function Name | Display Name |
|---------------|---------------|--------------|
| Bubble Sort | `bubble` | "Bubble Sort" |
| Quick Sort | `quick` | "Quick Sort" |
| Merge Sort | `merge` | "Merge Sort" |
| Heap Sort | `heap` | "Heap Sort" |
| Insertion Sort | `insertion` | "Insertion Sort" |
| Selection Sort | `selection` | "Selection Sort" |
| Dijkstra's Algorithm | `dijkstra` | "Dijkstra's" |
| A* Search | `aStar` | "A* Search" |
| BFS | `bfs` | "Breadth-First Search" |
| DFS | `dfs` | "Depth-First Search" |
| Kruskal's | `kruskal` | "Kruskal's" |
| Prim's | `prim` | "Prim's" |

---

## 🎨 Visualization Consistency Guidelines

### Color Palette (Semantic)

```css
:root {
  /* Algorithm States */
  --color-default: #6366f1;     /* Indigo - neutral */
  --color-comparing: #3b82f6;   /* Blue - being evaluated */
  --color-swapping: #f97316;    /* Orange - in motion */
  --color-sorted: #22c55e;      /* Green - finalized */
  --color-pivot: #a855f7;       /* Purple - reference element */
  
  /* Pathfinding */
  --color-visited: #06b6d4;     /* Cyan - explored */
  --color-path: #eab308;        /* Yellow - solution */
  --color-wall: #374151;        /* Gray - obstacle */
  --color-start: #22c55e;       /* Green - origin */
  --color-end: #ef4444;         /* Red - destination */
  
  /* Data Structures */
  --color-node: #6366f1;        /* Indigo - BST nodes */
  --color-highlight: #3b82f6;   /* Blue - active node */
  --color-found: #22c55e;       /* Green - search result */
}
```

### Animation Timing

```css
:root {
  /* Speed presets (base values, scaled by user control) */
  --speed-compare: 150ms;
  --speed-swap: 300ms;
  --speed-move: 200ms;
  --speed-visit: 50ms;
  --speed-path: 30ms;
}
```

### UI Control Standards

Every visualizer should have:

| Control | Type | Purpose |
|---------|------|---------|
| Algorithm selector | Dropdown | Choose algorithm |
| Speed slider | Range input | Control animation speed |
| Array/Grid size | Range input | Set problem size |
| Run button | Button | Start visualization |
| Reset button | Button | Clear and regenerate |
| Pause/Resume | Button | Interrupt animation |

---

## 🚫 Preventing Feature Creep

### Decision Framework

Before adding a feature, ask:

1. **Does it help visualize an algorithm?**
   - ✅ Step-by-step controls
   - ❌ User accounts and progress tracking

2. **Does it reduce cognitive load?**
   - ✅ Cleaner color scheme
   - ❌ Adding Big-O explanations everywhere

3. **Can a beginner use it immediately?**
   - ✅ Single-click "Run" button
   - ❌ Complex configuration panels

4. **Is it a core visualization feature or a nice-to-have?**
   - ✅ Swap animations
   - ❌ Dark/light theme (nice-to-have, not core)

### Features to AVOID

| Feature | Why Not |
|---------|---------|
| User accounts | Adds backend complexity, not needed for learning |
| Achievement systems | Gamification distracts from learning |
| Code editor | Scope creep, other tools do this better |
| Multiple languages | One language done well > many done poorly |
| Competitive elements | Creates anxiety, not conducive to learning |
| Ads | Degrades experience, compromises mission |

### Features to DEFER (v2.0+)

| Feature | Why Defer |
|---------|-----------|
| Code export | Useful but not core to visualization |
| Custom algorithm builder | Complex, needs careful UX design |
| Performance benchmarking | Interesting but secondary |
| Mobile app | Web-first is sufficient initially |

---

## ✅ Pull Request Checklist

Before merging any PR:

### Code Quality
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (`npm run lint`)
- [ ] No hardcoded values (use constants/CSS variables)
- [ ] Algorithm logic separated from visualization

### Visual Consistency
- [ ] Uses semantic color variables
- [ ] Animation speeds match existing patterns
- [ ] Controls follow UI standards
- [ ] Responsive on mobile viewport

### Documentation
- [ ] New algorithm added to README
- [ ] CONTRIBUTING.md patterns followed
- [ ] Code comments for non-obvious logic

### Testing (Manual for now)
- [ ] Works with minimum input size
- [ ] Works with maximum input size
- [ ] Works with edge cases (sorted, reverse-sorted, empty)
- [ ] Animation can be interrupted and reset

---

## 📏 Code Organization Rules

### Algorithm Files (`lib/algorithms/`)

```typescript
// ✅ GOOD: Pure logic, no React
export const Sort = {
  bubble(arr: number[]): Step[] { /* ... */ }
};

// ❌ BAD: Don't import React or DOM APIs
import { useState } from 'react';  // NO!
```

### Component Files (`components/`)

```typescript
// ✅ GOOD: Use algorithm functions from lib
import { Sort } from '@/lib/algorithms/sorting';

const steps = Sort.bubble(array);

// ❌ BAD: Implementing algorithm logic in components
function bubbleSort(arr) { /* Don't do this */ }
```

### Hook Patterns (Future)

```typescript
// ✅ GOOD: Extract reusable animation logic
// lib/hooks/useAnimation.ts
export function useAnimation(steps: Step[], speed: number) {
  // ...
}

// Usage in component
const { isPlaying, currentStep, play, pause } = useAnimation(steps, speed);
```

---

## 🔄 Version Management

### Versioning Scheme

Follow [SemVer](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., `1.2.3`)
- **MAJOR**: Breaking changes (rare)
- **MINOR**: New algorithms/features
- **PATCH**: Bug fixes, visual tweaks

### Changelog Format

```markdown
## [1.1.0] - 2026-02-15

### Added
- Radix Sort visualization
- Step-by-step controls

### Fixed
- A* heuristic calculation bug
- Swap animation timing

### Changed
- Default animation speed reduced
```

---

## 🧹 Maintenance Tasks

### Weekly
- [ ] Review open issues
- [ ] Merge approved PRs
- [ ] Update dependencies (security patches only)

### Monthly
- [ ] Check for Next.js updates
- [ ] Review and triage feature requests
- [ ] Update roadmap in README

### Per Release
- [ ] Update version in `package.json`
- [ ] Write changelog entry
- [ ] Test all visualizers on Chrome, Firefox, Safari
- [ ] Verify mobile responsiveness
- [ ] Update live demo deployment

---

## 🎯 Quality Gates

Before any release:

| Check | Command/Action | Passing Criteria |
|-------|----------------|------------------|
| Types | `npm run build` | No TypeScript errors |
| Lint | `npm run lint` | No ESLint errors |
| Visual | Manual testing | All visualizers work |
| Performance | Lighthouse | 90+ Performance score |
| Accessibility | Lighthouse | 90+ Accessibility score |

---

*Document last updated: February 2026*
