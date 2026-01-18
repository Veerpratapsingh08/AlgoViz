export type Node = {
  row: number;
  col: number;
  isWall: boolean;
  distance: number;
  visited: boolean;
  parent: Node | null;
  f?: number;
  g?: number;
  h?: number;
};

export type Step = 
  | { type: 'visit', row: number, col: number }
  | { type: 'path', row: number, col: number };

export const Pathfinder = {
  dijkstra(grid: Node[][], start: Node, end: Node): Step[] {
    const steps: Step[] = [];
    start.distance = 0;
    
    // Using simple array as priority queue - acceptable for visualization scale
    const unvisited = grid.flat(); 

    while (unvisited.length) {
      unvisited.sort((a, b) => a.distance - b.distance);
      const curr = unvisited.shift();

      if (!curr || curr.distance === Infinity) return steps;
      if (curr.isWall) continue;

      curr.visited = true;
      steps.push({ type: 'visit', row: curr.row, col: curr.col });

      if (curr === end) return [...steps, ...this._tracePath(end)];

      this._updateNeighbors(curr, grid);
    }
    return steps;
  },

  aStar(grid: Node[][], start: Node, end: Node): Step[] {
    const steps: Step[] = [];
    const open: Node[] = [start];
    const closed = new Set<Node>();
    
    start.g = 0;
    start.h = this._manhattan(start, end);
    start.f = start.h;
    
    while (open.length) {
      open.sort((a, b) => (a.f || 0) - (b.f || 0));
      const curr = open.shift()!;
      
      if (curr === end) return [...steps, ...this._tracePath(end)];
      
      closed.add(curr);
      steps.push({ type: 'visit', row: curr.row, col: curr.col });
      
      for (const n of this._getNeighbors(curr, grid)) {
        if (n.isWall || closed.has(n)) continue;
        
        const g = (curr.g || 0) + 1;
        if (g < (n.g || Infinity)) {
          n.g = g;
          n.h = this._manhattan(n, end);
          n.f = n.g + n.h;
          n.parent = curr;
          
          if (!open.includes(n)) open.push(n);
        }
      }
    }
    return steps;
  },

  bfs(grid: Node[][], start: Node, end: Node): Step[] {
    const steps: Step[] = [];
    const q: Node[] = [start];
    start.visited = true;
    
    while (q.length) {
      const curr = q.shift()!;
      steps.push({ type: 'visit', row: curr.row, col: curr.col });
      
      if (curr === end) return [...steps, ...this._tracePath(end)];
      
      for (const n of this._getNeighbors(curr, grid)) {
        if (!n.visited && !n.isWall) {
          n.visited = true;
          n.parent = curr;
          q.push(n);
        }
      }
    }
    return steps;
  },

  dfs(grid: Node[][], start: Node, end: Node): Step[] {
    const steps: Step[] = [];
    const stack: Node[] = [start];
    
    while (stack.length) {
      const curr = stack.pop()!;
      
      if (!curr.visited) {
        curr.visited = true;
        steps.push({ type: 'visit', row: curr.row, col: curr.col });

        if (curr === end) return [...steps, ...this._tracePath(end)];
        
        // Reverse for consistent visual order
        const neighbors = this._getNeighbors(curr, grid).reverse();
        for (const n of neighbors) {
          if (!n.visited && !n.isWall) {
             n.parent = curr;
             stack.push(n);
          }
        }
      }
    }
    return steps;
  },

  _updateNeighbors(node: Node, grid: Node[][]) {
    for (const n of this._getNeighbors(node, grid)) {
      if (n.visited || n.isWall) continue;
      if (node.distance + 1 < n.distance) {
        n.distance = node.distance + 1;
        n.parent = node;
      }
    }
  },

  _getNeighbors(node: Node, grid: Node[][]): Node[] {
    const res: Node[] = [];
    const { row: r, col: c } = node;
    const R = grid.length, C = grid[0].length;
    
    if (r > 0) res.push(grid[r - 1][c]);
    if (r < R - 1) res.push(grid[r + 1][c]);
    if (c > 0) res.push(grid[r][c - 1]);
    if (c < C - 1) res.push(grid[r][c + 1]);
    return res;
  },

  _tracePath(end: Node): Step[] {
    const path: Step[] = [];
    let curr: Node | null = end;
    while (curr) {
      path.unshift({ type: 'path', row: curr.row, col: curr.col });
      curr = curr.parent;
    }
    return path;
  },
  
  _manhattan(a: Node, b: Node): number {
      return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  }
};
