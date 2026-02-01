# Contributing to AlgoViz

First off, thank you for considering contributing to AlgoViz! 🎉

Whether you're fixing a bug, proposing a new algorithm, or improving documentation — every contribution makes this project better for learners everywhere.

---

## 📋 Table of Contents

1. [Getting Started](#-getting-started)
2. [Adding a New Algorithm](#-adding-a-new-algorithm)
3. [Algorithm Module Structure](#-algorithm-module-structure)
4. [Code Style & Expectations](#-code-style--expectations)
5. [What Makes a Good Pull Request](#-what-makes-a-good-pull-request)
6. [Reporting Issues](#-reporting-issues)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+
- Basic familiarity with React and TypeScript

### Local Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/AlgoViz.git
cd AlgoViz

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Open http://localhost:3000
```

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/add-radix-sort

# Make your changes...

# Run linting
npm run lint

# Test locally by running the dev server
npm run dev

# Commit with a descriptive message
git commit -m "feat(sorting): add radix sort visualization"

# Push and create a Pull Request
git push origin feature/add-radix-sort
```

---

## 🧮 Adding a New Algorithm

So you want to add a new algorithm visualization? Awesome! Here's the process:

### Step 1: Add the Algorithm Logic

Location: `/lib/algorithms/`

Algorithms live here as **pure functions** — no UI code, no React. This keeps them:
- ✅ Easy to test
- ✅ Easy to understand
- ✅ Reusable across visualizers

**Example: Adding a sorting algorithm**

```typescript
// lib/algorithms/sorting.ts

// Define the step type for your algorithm if needed
export type Step =
  | { type: 'compare', idx: [number, number] }
  | { type: 'swap', idx: [number, number], val: [number, number] }
  | { type: 'overwrite', idx: number, val: number }
  | { type: 'sorted', idx: number };

// Add your algorithm to the Sort object
export const Sort = {
  // ... existing algorithms

  radix(arr: number[]): Step[] {
    const steps: Step[] = [];
    const a = [...arr];
    
    // Your algorithm implementation
    // Push steps as the algorithm progresses:
    // steps.push({ type: 'compare', idx: [i, j] });
    // steps.push({ type: 'swap', idx: [i, j], val: [a[i], a[j]] });
    
    return steps;
  },
};
```

### Step 2: Register in the Visualizer

Location: `/components/SortingVisualizer.tsx` (or appropriate visualizer)

```typescript
// Add to the ALGORITHMS object
const ALGORITHMS = {
  merge: 'Merge Sort',
  quick: 'Quick Sort',
  // ... existing
  radix: 'Radix Sort',  // ← Add your algorithm
};
```

### Step 3: Test Manually

1. Run `npm run dev`
2. Navigate to the visualizer
3. Select your algorithm from the dropdown
4. Verify the animation works correctly
5. Test edge cases (empty array, sorted array, single element)

---

## 📐 Algorithm Module Structure

### Sorting Algorithms (`lib/algorithms/sorting.ts`)

```typescript
// Required exports
export type Step = /* step type union */;
export const Sort = {
  algorithmName(arr: number[]): Step[] { /* ... */ }
};
```

**Step Types:**
| Type | Description | Fields |
|------|-------------|--------|
| `compare` | Comparing two elements | `idx: [number, number]` |
| `swap` | Swapping two elements | `idx: [number, number], val: [number, number]` |
| `overwrite` | Setting a value at index | `idx: number, val: number` |
| `sorted` | Marking index as sorted | `idx: number` |

### Pathfinding Algorithms (`lib/algorithms/pathfinding.ts`)

```typescript
export type Node = { row, col, isWall, distance, visited, parent, f?, g?, h? };
export type Step = 
  | { type: 'visit', row: number, col: number }
  | { type: 'path', row: number, col: number };

export const Pathfinder = {
  algorithmName(grid: Node[][], start: Node, end: Node): Step[] { /* ... */ }
};
```

### Data Structures (`lib/algorithms/datastructures.ts`)

```typescript
export class BSTNode { /* ... */ }
export const TreeUtils = {
  insert(root: BSTNode | null, value: number): BSTNode { /* ... */ }
  search(root: BSTNode | null, value: number): boolean { /* ... */ }
  layout(root: BSTNode | null, x, y, level, width) { /* ... */ }
};
```

---

## 🎨 Code Style & Expectations

### General Principles

1. **Clarity over cleverness** — Write code a student can understand
2. **Separate logic from UI** — Algorithms go in `/lib/`, visuals in `/components/`
3. **Use TypeScript** — All code should be type-safe
4. **Keep it minimal** — Resist adding unnecessary features

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Algorithm files | `lowercase.ts` | `sorting.ts` |
| Algorithm functions | `camelCase` | `bubbleSort` |
| Component files | `PascalCase.tsx` | `SortingVisualizer.tsx` |
| Helper functions | `_prefixed` | `_partition`, `_heapify` |
| Step types | `lowercase` | `'compare'`, `'swap'` |

### Visualization Guidelines

- **Animation speed should be adjustable** — Don't hardcode delays
- **Colors should be semantic** — Blue for comparing, green for sorted, etc.
- **State changes should be visible** — Every step should be observable
- **No magic jumps** — If the algorithm does something, it should be animated

### Don'ts

- ❌ Don't add Big-O explanations in code comments (keep it visual)
- ❌ Don't overcomplicate step types — simple is better
- ❌ Don't mix algorithm logic with React state
- ❌ Don't break existing visualizations when adding features

---

## ✅ What Makes a Good Pull Request

### Before Submitting

- [ ] Code runs locally without errors
- [ ] `npm run lint` passes
- [ ] New algorithm follows existing patterns
- [ ] Tested with edge cases (empty, single, sorted, reverse-sorted)
- [ ] Animation looks smooth and understandable

### PR Title Format

```
<type>(<scope>): <description>

Examples:
feat(sorting): add radix sort visualization
fix(pathfinding): correct A* heuristic calculation
docs(readme): add algorithm comparison section
style(visualizer): improve bar color transitions
```

### PR Description Template

```markdown
## What does this PR do?
[Brief description]

## Type of change
- [ ] 🐛 Bug fix
- [ ] ✨ New feature (algorithm/visualization)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI improvement

## Checklist
- [ ] Tested locally
- [ ] Lint passes
- [ ] Follows existing code patterns

## Screenshots/GIF (if applicable)
[Attach visual demo]
```

---

## 🐛 Reporting Issues

### Bug Reports

Found something broken? [Open an issue](https://github.com/Veerpratapsingh08/AlgoViz/issues/new?template=bug_report.md) with:

- Browser and OS
- Steps to reproduce
- Expected vs actual behavior
- Screenshot/GIF if visual

### Feature Requests

Have an idea? [Open an issue](https://github.com/Veerpratapsingh08/AlgoViz/issues/new?template=feature_request.md) with:

- What algorithm or feature you want
- Why it would help learners
- Any reference implementations

---

## 💬 Questions?

If you're stuck or unsure about something:

1. Check existing [issues](https://github.com/Veerpratapsingh08/AlgoViz/issues) and [PRs](https://github.com/Veerpratapsingh08/AlgoViz/pulls)
2. Open a discussion issue with the "question" label
3. Reach out to [Veer Pratap Singh](https://veerpratapsingh.vercel.app)

---

**Thank you for helping make algorithms visible! 🚀**
