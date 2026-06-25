# The Algorithm Sketchbook (AlgoViz)

> **Built by a CS student who got tired of memorizing algorithms.**

I've always felt that traditional computer science resources get it backwards. They bury you in dry theory, mathematical proofs, and dense textbook paragraphs before you ever get to see the algorithm actually *run*. 

Learning algorithms shouldn't feel like deciphering an ancient manuscript. It should feel like playing with Lego blocks. You should be able to poke at it, change the speed, swap the data, and watch the mechanics unfold right in front of your eyes.

I built **The Algorithm Sketchbook** to be the tool I wish I had when I was first learning Data Structures and Algorithms. I wanted a messy, hands-on, highly visual playground where you can literally see an $O(n^2)$ algorithm struggle, or watch Dijkstra's algorithm organically explore a maze.

No corporate fluff. No generic grids. Just raw logic, visual intuition, and a chalkboard aesthetic to make it feel like you're sketching out ideas in a notebook.

---

## ✨ Features

- **Gamified Race Mode**: Pit $O(n^2)$ against $O(n \log n)$ side-by-side. Place your bets on which algorithm will finish first before the race starts!
- **Freeform Graphs**: Don't just click grids. Drop nodes onto an open canvas, draw connecting edges, and watch Kruskal's or Dijkstra's run directly on top of your sketches.
- **Pathfinding**: Draw your own walls and let A* or BFS organically explore the maze.
- **Data Structures**: Trees, Stacks, Queues, and Linked Lists. See how memory pointers actually connect and branch.
- **Deep Domain Logic**: Algorithms aren't faked with CSS tricks. The app implements the raw mathematical logic using generator-based state queues to pause execution frame-by-frame.

---

## 🛠️ Tech Stack

- **Next.js 15 & React 19**
- **TypeScript**
- **Tailwind CSS 4** (Using `@theme` for a custom, asymmetric "sketch" aesthetic)

*Algorithms are strictly decoupled from UI logic in `/lib/algorithms/` for clean state management.*

---

## 🚀 Quick Start

Want to break things locally? Be my guest.

```bash
# Clone the repository
git clone https://github.com/Veerpratapsingh08/AlgoViz.git
cd AlgoViz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Building Log: Mistakes & Discoveries

Building this wasn't straightforward. Here are a few things I broke along the way:

- **Day 1:** Attempted to build Quick Sort using React State. Instantly hit maximum update depth exceeded. Turns out `setArray` inside a recursive loop is a remarkably efficient way to crash Chrome.
- **Day 4:** Trying to animate CSS bars swapping. Discovered that React state batching and `setTimeout` are mortal enemies. Refactored the entire sorting engine to use a generator-like `Step` queue.
- **Day 12:** Accidentally animated 5,000 DOM updates per frame on a 100x100 pathfinding grid. My laptop fan sounded like a jet engine. Re-learned that $O(n^2)$ isn't just theory—it actually burns CPU cycles in the real world.
- **Day 18:** Dijkstra's algorithm kept exploring the entire grid even when the target was right next to it. Realized my priority queue was a standard array and I was doing `arr.sort()` on every single insertion. Big O strikes again.

---

## 📚 Architecture & Documentation

Want to dive deeper into how this is built? Check out our `docs/` folder:
- [**ARCHITECTURE.md**](docs/ARCHITECTURE.md): An overview of the project's goals, components, and long-term vision.
- [**PROJECT_HYGIENE.md**](docs/PROJECT_HYGIENE.md): The official guide to our repository structure, naming conventions, and code style.
- [**OSS_USABILITY_REVIEW.md**](docs/OSS_USABILITY_REVIEW.md): An analysis of the app's usability from a learner's perspective.

---

## 🤝 Open Source

This entire project is open source, and we welcome contributions from everyone! Whether you want to add a new algorithm, improve the existing visualizers (including our new **Race Mode** and **Freeform Graphs**), or fix a bug, please check out:
- [**CONTRIBUTING.md**](CONTRIBUTING.md) for local setup and algorithm module structure guidelines.
- Our [Issue Templates](.github/ISSUE_TEMPLATE) and [PR Template](.github/PULL_REQUEST_TEMPLATE.md) for reporting bugs or suggesting features.

[MIT License](LICENSE) — free to use, modify, and distribute.

---

<p align="center">
  <sub>If this helps you finally understand Quick Sort, consider giving it a ⭐</sub>
</p>
