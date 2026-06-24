export type StudyContent = {
  title: string;
  description: string[];
  best: string;
  avg: string;
  worst: string;
  space: string;
  characteristics: string[];
  code: string;
};

export const STUDY_DATA: Record<string, StudyContent> = {
  // ================== SORTING ALGORITHMS ==================
  merge: {
    title: 'Merge Sort',
    description: [
      'Merge Sort is a highly efficient, stable, divide-and-conquer sorting algorithm.',
      'It works by recursively breaking down the array into smaller and smaller halves until each sub-array consists of a single element (which is inherently sorted).',
      'Then, it repeatedly merges these smaller sorted sub-arrays back together into larger sorted arrays until the entire array is sorted.'
    ],
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
    characteristics: ['Stable', 'Not in-place', 'Divide and Conquer', 'Predictable performance'],
    code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  let result = [], i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`
  },
  quick: {
    title: 'Quick Sort',
    description: [
      'Quick Sort is a highly efficient, in-place, divide-and-conquer sorting algorithm that is usually faster in practice than other O(n log n) algorithms.',
      'It works by picking a "pivot" element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.',
      'The sub-arrays are then sorted recursively.'
    ],
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
    characteristics: ['Not stable', 'In-place', 'Divide and Conquer', 'Fast practically due to cache locality'],
    code: `function quickSort(arr: number[], low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
  },
  heap: {
    title: 'Heap Sort',
    description: [
      'Heap Sort is a comparison-based sorting algorithm that can be thought of as an improved selection sort.',
      'It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region.',
      'It uses a max-heap data structure to quickly find the maximum element.'
    ],
    best: 'O(n log n)',
    avg: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
    characteristics: ['Not stable', 'In-place', 'Consistent time complexity'],
    code: `function heapSort(arr: number[]) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr: number[], n: number, i: number) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`
  },
  bubble: {
    title: 'Bubble Sort',
    description: [
      'Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.',
      'This algorithm is not suitable for large data sets as its average and worst-case time complexity is quite high.',
      'However, it is easy to understand and implement, making it a great teaching tool.'
    ],
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    characteristics: ['Stable', 'In-place', 'Adaptive (fast if nearly sorted)', 'Very slow generally'],
    code: `function bubbleSort(arr: number[]) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    n--; // The largest element bubbles up to its final position
  } while (swapped);
  return arr;
}`
  },
  selection: {
    title: 'Selection Sort',
    description: [
      'Selection Sort is an in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.',
      'The algorithm proceeds by finding the smallest (or largest) element in the unsorted sublist, exchanging (swapping) it with the leftmost unsorted element, and moving the sublist boundaries one element to the right.'
    ],
    best: 'O(n²)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    characteristics: ['Not stable', 'In-place', 'Makes exactly O(n) swaps', 'Slow'],
    code: `function selectionSort(arr: number[]) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`
  },
  insertion: {
    title: 'Insertion Sort',
    description: [
      'Insertion Sort builds the final sorted array one item at a time.',
      'It takes an element from the unsorted portion and compares it against elements in the sorted portion, shifting larger elements to the right to make room for the new element.',
      'It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort. However, it provides several advantages: it is highly efficient for small data sets or nearly sorted data.'
    ],
    best: 'O(n)',
    avg: 'O(n²)',
    worst: 'O(n²)',
    space: 'O(1)',
    characteristics: ['Stable', 'In-place', 'Adaptive', 'Online (can sort a list as it receives it)'],
    code: `function insertionSort(arr: number[]) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`
  },

  // ================== PATHFINDING ALGORITHMS ==================
  dijkstra: {
    title: "Dijkstra's Algorithm",
    description: [
      "Dijkstra's Algorithm is the foundational pathfinding algorithm for finding the shortest path between a starting node and all other nodes in a weighted graph.",
      "It works by maintaining a priority queue (or just scanning) to always explore the node with the shortest known distance from the start.",
      "It guarantees the shortest path as long as there are no negative edge weights."
    ],
    best: 'O(E log V)',
    avg: 'O(E log V)',
    worst: 'O(E log V)',
    space: 'O(V)',
    characteristics: ['Guarantees shortest path', 'Weighted graphs', 'No heuristic used', 'Explores radially'],
    code: `// Conceptual pseudo-code
function dijkstra(graph, start) {
  let distances = {};
  let pq = new PriorityQueue();
  
  distances[start] = 0;
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    let current = pq.dequeue();
    
    for (let neighbor of graph.getNeighbors(current)) {
      let newDist = distances[current] + weight(current, neighbor);
      if (newDist < distances[neighbor] || !distances[neighbor]) {
        distances[neighbor] = newDist;
        pq.enqueue(neighbor, newDist);
      }
    }
  }
  return distances;
}`
  },
  astar: {
    title: 'A* Search Algorithm',
    description: [
      'A* (A-star) is one of the most successful pathfinding algorithms. It is essentially an informed variation of Dijkstra.',
      'It combines the actual distance from the start (g-cost) like Dijkstra, with an estimated distance to the goal (h-cost, usually a heuristic like Manhattan or Euclidean distance).',
      'By prioritizing nodes that are both close to the start AND seemingly close to the goal (f-cost = g + h), it drastically reduces the number of nodes it needs to explore.'
    ],
    best: 'O(E)',
    avg: 'O(E)',
    worst: 'O(b^d) (b=branching factor, d=depth)',
    space: 'O(V)',
    characteristics: ['Guarantees shortest path', 'Uses heuristic (Informed)', 'Very fast in practice'],
    code: `// Conceptual pseudo-code
function aStar(graph, start, goal) {
  let openSet = new PriorityQueue(); // Ordered by f-cost
  let gScore = {}; gScore[start] = 0;
  let fScore = {}; fScore[start] = heuristic(start, goal);
  
  openSet.enqueue(start, fScore[start]);
  
  while (!openSet.isEmpty()) {
    let current = openSet.dequeue();
    if (current === goal) return reconstructPath();
    
    for (let neighbor of graph.getNeighbors(current)) {
      let tentativeG = gScore[current] + weight(current, neighbor);
      if (tentativeG < gScore[neighbor] || !gScore[neighbor]) {
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
        if (!openSet.contains(neighbor)) openSet.enqueue(neighbor, fScore[neighbor]);
      }
    }
  }
}`
  },
  bfs: {
    title: 'Breadth-First Search',
    description: [
      'Breadth-First Search (BFS) is an unweighted pathfinding algorithm that explores equally in all directions.',
      'It starts at the tree root (or graph node) and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
      'Because it explores uniformly, BFS guarantees the shortest path on unweighted graphs (graphs where all edges have a weight of 1).'
    ],
    best: 'O(V + E)',
    avg: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V)',
    characteristics: ['Guarantees shortest path on UNWEIGHTED graphs', 'Uses a Queue', 'Explores radially'],
    code: `function bfs(graph, start, goal) {
  let queue = [start];
  let visited = new Set([start]);
  
  while (queue.length > 0) {
    let current = queue.shift(); // Dequeue
    if (current === goal) return true;
    
    for (let neighbor of graph.getNeighbors(current)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // Enqueue
      }
    }
  }
  return false;
}`
  },
  dfs: {
    title: 'Depth-First Search',
    description: [
      'Depth-First Search (DFS) is an unweighted pathfinding algorithm that plunges as deep as possible along a branch before backtracking.',
      'It uses a Stack (or recursion) to remember where it needs to backtrack to when it hits a dead end.',
      'DFS does NOT guarantee the shortest path. It will simply return the first path it happens to find.'
    ],
    best: 'O(V + E)',
    avg: 'O(V + E)',
    worst: 'O(V + E)',
    space: 'O(V) (recursion stack)',
    characteristics: ['Does NOT guarantee shortest path', 'Uses a Stack / Recursion', 'Good for maze generation and topological sort'],
    code: `function dfs(graph, current, goal, visited = new Set()) {
  if (current === goal) return true;
  
  visited.add(current);
  
  for (let neighbor of graph.getNeighbors(current)) {
    if (!visited.has(neighbor)) {
      if (dfs(graph, neighbor, goal, visited)) {
        return true; // Found path!
      }
    }
  }
  return false;
}`
  },

  // ================== DATA STRUCTURES ==================
  bst: {
    title: 'Binary Search Tree',
    description: [
      'A Binary Search Tree (BST) is a node-based binary tree data structure where each node has at most two child nodes (left and right).',
      'The key property of a BST is: for any given node, all values in its left subtree are strictly less than the node\'s value, and all values in its right subtree are strictly greater.',
      'This property allows for highly efficient search, insertion, and deletion operations, akin to binary search on a sorted array, but with dynamic sizing.'
    ],
    best: 'O(log n)',
    avg: 'O(log n)',
    worst: 'O(n) (if unbalanced)',
    space: 'O(n)',
    characteristics: ['Sorted order traversal (In-order)', 'Hierarchical', 'Requires balancing (e.g. AVL, Red-Black) to avoid worst-case O(n)'],
    code: `class Node {
  value: number;
  left: Node | null = null;
  right: Node | null = null;
  constructor(val: number) { this.value = val; }
}

function insert(root: Node | null, val: number): Node {
  if (!root) return new Node(val);
  
  if (val < root.value) {
    root.left = insert(root.left, val);
  } else if (val > root.value) {
    root.right = insert(root.right, val);
  }
  return root;
}

function search(root: Node | null, val: number): boolean {
  if (!root) return false;
  if (root.value === val) return true;
  if (val < root.value) return search(root.left, val);
  return search(root.right, val);
}`
  },
  stack: {
    title: 'Stack',
    description: [
      'A Stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle.',
      'Imagine a stack of plates in a cafeteria: you can only add a new plate to the top, and you can only take a plate from the top.',
      'It is fundamentally used in scenarios like the call stack (executing functions), undo mechanisms in text editors, and evaluating expressions.'
    ],
    best: 'O(1) (push/pop)',
    avg: 'O(1)',
    worst: 'O(1)',
    space: 'O(n)',
    characteristics: ['LIFO (Last-In, First-Out)', 'Only access top element', 'Used for recursion / backtracking'],
    code: `class Stack<T> {
  private items: T[] = [];
  
  push(element: T): void {
    this.items.push(element); // Append to end of array
  }
  
  pop(): T | undefined {
    return this.items.pop(); // Remove from end of array
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}`
  },
  queue: {
    title: 'Queue',
    description: [
      'A Queue is a linear data structure that follows the First-In, First-Out (FIFO) principle.',
      'Imagine a line of people waiting to buy movie tickets: the first person to get in line is the first person to be served.',
      'Queues are used heavily in asynchronous data transfer, task scheduling (like print spools or web server requests), and breadth-first search algorithms.'
    ],
    best: 'O(1) (enqueue/dequeue)',
    avg: 'O(1)',
    worst: 'O(1)',
    space: 'O(n)',
    characteristics: ['FIFO (First-In, First-Out)', 'Add to back, remove from front', 'Used for scheduling / BFS'],
    code: `class Queue<T> {
  private items: Record<number, T> = {};
  private frontIdx = 0;
  private backIdx = 0;
  
  enqueue(element: T): void {
    this.items[this.backIdx] = element;
    this.backIdx++;
  }
  
  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.frontIdx];
    delete this.items[this.frontIdx];
    this.frontIdx++;
    return item;
  }
  
  isEmpty(): boolean {
    return this.backIdx === this.frontIdx;
  }
}`
  },
  linkedlist: {
    title: 'Linked List',
    description: [
      'A Linked List is a linear data structure where elements are not stored in contiguous memory locations. Instead, each element (node) contains a data field and a reference (link) to the next node in the sequence.',
      'This allows for efficient insertion and removal of elements without needing to shift surrounding elements like you would in a standard array.',
      'However, since memory is not contiguous, you lose the ability to randomly access an element by its index; you must traverse the list from the head to reach the desired node.'
    ],
    best: 'O(1) (append to tail / prepend)',
    avg: 'O(n) (search/delete specific node)',
    worst: 'O(n)',
    space: 'O(n)',
    characteristics: ['Non-contiguous memory', 'Dynamic size', 'No random access (no indexing)', 'O(1) insertions at head/tail'],
    code: `class Node<T> {
  value: T;
  next: Node<T> | null = null;
  constructor(val: T) { this.value = val; }
}

class LinkedList<T> {
  head: Node<T> | null = null;
  tail: Node<T> | null = null;
  
  append(val: T) {
    const newNode = new Node(val);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    if (this.tail) {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  
  delete(val: T) {
    if (!this.head) return;
    if (this.head.value === val) {
      this.head = this.head.next;
      return;
    }
    
    let current = this.head;
    while (current.next && current.next.value !== val) {
      current = current.next;
    }
    
    if (current.next) {
      if (current.next === this.tail) this.tail = current;
      current.next = current.next.next;
    }
  }
}`
  }
};
