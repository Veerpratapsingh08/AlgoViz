// Algorithm Implementations
class SortingAlgorithms {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }

    async bubbleSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                this.visualizer.compare(j, j + 1);
                await this.visualizer.delay();
                if (arr[j] > arr[j + 1]) {
                    this.visualizer.swap(j, j + 1);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                    await this.visualizer.delay();
                }
                this.visualizer.resetColors(j, j + 1);
            }
            this.visualizer.markSorted(n - i - 1);
        }
        this.visualizer.markSorted(0);
    }

    async selectionSort(arr) {
        const n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                this.visualizer.compare(minIdx, j);
                await this.visualizer.delay();
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
                this.visualizer.resetColors(minIdx, j);
            }
            if (minIdx !== i) {
                this.visualizer.swap(i, minIdx);
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
                await this.visualizer.delay();
            }
            this.visualizer.markSorted(i);
        }
        this.visualizer.markSorted(n - 1);
    }

    async insertionSort(arr) {
        const n = arr.length;
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                this.visualizer.compare(j, j + 1);
                await this.visualizer.delay();
                arr[j + 1] = arr[j];
                this.visualizer.updateBar(j + 1, arr[j]);
                this.visualizer.resetColors(j, j + 1);
                j--;
            }
            arr[j + 1] = key;
            this.visualizer.updateBar(j + 1, key);
        }
        for (let i = 0; i < n; i++) this.visualizer.markSorted(i);
    }

    async mergeSort(arr, left = 0, right = arr.length - 1) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);
        await this.mergeSort(arr, left, mid);
        await this.mergeSort(arr, mid + 1, right);
        await this.merge(arr, left, mid, right);
    }

    async merge(arr, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);
        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            this.visualizer.compare(left + i, mid + 1 + j);
            await this.visualizer.delay();
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                this.visualizer.updateBar(k, leftArr[i]);
                i++;
            } else {
                arr[k] = rightArr[j];
                this.visualizer.updateBar(k, rightArr[j]);
                j++;
            }
            this.visualizer.incrementSwaps();
            k++;
        }

        while (i < leftArr.length) {
            arr[k] = leftArr[i];
            this.visualizer.updateBar(k, leftArr[i]);
            i++; k++;
            await this.visualizer.delay();
        }

        while (j < rightArr.length) {
            arr[k] = rightArr[j];
            this.visualizer.updateBar(k, rightArr[j]);
            j++; k++;
            await this.visualizer.delay();
        }

        for (let x = left; x <= right; x++) {
            if (left === 0 && right === arr.length - 1) this.visualizer.markSorted(x);
        }
    }

    async quickSort(arr, low = 0, high = arr.length - 1) {
        if (low < high) {
            const pi = await this.partition(arr, low, high);
            this.visualizer.markSorted(pi);
            await this.quickSort(arr, low, pi - 1);
            await this.quickSort(arr, pi + 1, high);
        } else if (low === high) {
            this.visualizer.markSorted(low);
        }
    }

    async partition(arr, low, high) {
        const pivot = arr[high];
        this.visualizer.markPivot(high);
        let i = low - 1;

        for (let j = low; j < high; j++) {
            this.visualizer.compare(j, high);
            await this.visualizer.delay();
            if (arr[j] < pivot) {
                i++;
                this.visualizer.swap(i, j);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                await this.visualizer.delay();
            }
            this.visualizer.resetColors(j);
        }
        this.visualizer.swap(i + 1, high);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        this.visualizer.resetColors(high);
        return i + 1;
    }

    async heapSort(arr) {
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await this.heapify(arr, n, i);
        }
        for (let i = n - 1; i > 0; i--) {
            this.visualizer.swap(0, i);
            [arr[0], arr[i]] = [arr[i], arr[0]];
            await this.visualizer.delay();
            this.visualizer.markSorted(i);
            await this.heapify(arr, i, 0);
        }
        this.visualizer.markSorted(0);
    }

    async heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            this.visualizer.compare(largest, left);
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < n) {
            this.visualizer.compare(largest, right);
            if (arr[right] > arr[largest]) largest = right;
        }
        await this.visualizer.delay();

        if (largest !== i) {
            this.visualizer.swap(i, largest);
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            await this.visualizer.delay();
            this.visualizer.resetColors(i, largest);
            await this.heapify(arr, n, largest);
        } else {
            this.visualizer.resetColors(i);
        }
    }
}


// Pathfinding Algorithms


class PathfindingAlgorithms {
    constructor(visualizer) {
        this.visualizer = visualizer;
    }

    async dijkstra(grid, start, end) {
        const rows = grid.length;
        const cols = grid[0].length;
        const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

        dist[start.row][start.col] = 0;
        const pq = [{ row: start.row, col: start.col, dist: 0 }];

        while (pq.length > 0) {
            pq.sort((a, b) => a.dist - b.dist);
            const { row, col } = pq.shift();

            if (visited[row][col]) continue;
            visited[row][col] = true;

            if (row === end.row && col === end.col) {
                await this.reconstructPath(prev, end);
                return true;
            }

            if (!(row === start.row && col === start.col)) {
                await this.visualizer.visitCell(row, col);
            }

            const neighbors = this.getNeighbors(row, col, rows, cols);
            for (const [nr, nc] of neighbors) {
                if (!visited[nr][nc] && !grid[nr][nc].isWall) {
                    const newDist = dist[row][col] + 1;
                    if (newDist < dist[nr][nc]) {
                        dist[nr][nc] = newDist;
                        prev[nr][nc] = { row, col };
                        pq.push({ row: nr, col: nc, dist: newDist });
                    }
                }
            }
        }
        return false;
    }

    async astar(grid, start, end) {
        const rows = grid.length;
        const cols = grid[0].length;
        const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

        gScore[start.row][start.col] = 0;
        fScore[start.row][start.col] = this.heuristic(start, end);
        const openSet = [{ row: start.row, col: start.col }];

        while (openSet.length > 0) {
            openSet.sort((a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
            const { row, col } = openSet.shift();

            if (row === end.row && col === end.col) {
                await this.reconstructPath(prev, end);
                return true;
            }

            visited[row][col] = true;
            if (!(row === start.row && col === start.col)) {
                await this.visualizer.visitCell(row, col);
            }

            const neighbors = this.getNeighbors(row, col, rows, cols);
            for (const [nr, nc] of neighbors) {
                if (visited[nr][nc] || grid[nr][nc].isWall) continue;

                const tentativeG = gScore[row][col] + 1;
                if (tentativeG < gScore[nr][nc]) {
                    prev[nr][nc] = { row, col };
                    gScore[nr][nc] = tentativeG;
                    fScore[nr][nc] = tentativeG + this.heuristic({ row: nr, col: nc }, end);
                    if (!openSet.some(n => n.row === nr && n.col === nc)) {
                        openSet.push({ row: nr, col: nc });
                    }
                }
            }
        }
        return false;
    }

    async bfs(grid, start, end) {
        const rows = grid.length;
        const cols = grid[0].length;
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        const queue = [{ row: start.row, col: start.col }];
        visited[start.row][start.col] = true;

        while (queue.length > 0) {
            const { row, col } = queue.shift();

            if (row === end.row && col === end.col) {
                await this.reconstructPath(prev, end);
                return true;
            }

            if (!(row === start.row && col === start.col)) {
                await this.visualizer.visitCell(row, col);
            }

            const neighbors = this.getNeighbors(row, col, rows, cols);
            for (const [nr, nc] of neighbors) {
                if (!visited[nr][nc] && !grid[nr][nc].isWall) {
                    visited[nr][nc] = true;
                    prev[nr][nc] = { row, col };
                    queue.push({ row: nr, col: nc });
                }
            }
        }
        return false;
    }

    async dfs(grid, start, end) {
        const rows = grid.length;
        const cols = grid[0].length;
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
        const stack = [{ row: start.row, col: start.col }];

        while (stack.length > 0) {
            const { row, col } = stack.pop();

            if (visited[row][col]) continue;
            visited[row][col] = true;

            if (row === end.row && col === end.col) {
                await this.reconstructPath(prev, end);
                return true;
            }

            if (!(row === start.row && col === start.col)) {
                await this.visualizer.visitCell(row, col);
            }

            const neighbors = this.getNeighbors(row, col, rows, cols);
            for (const [nr, nc] of neighbors) {
                if (!visited[nr][nc] && !grid[nr][nc].isWall) {
                    prev[nr][nc] = { row, col };
                    stack.push({ row: nr, col: nc });
                }
            }
        }
        return false;
    }

    getNeighbors(row, col, rows, cols) {
        const neighbors = [];
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dr, dc] of dirs) {
            const nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                neighbors.push([nr, nc]);
            }
        }
        return neighbors;
    }

    heuristic(a, b) {
        return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
    }

    async reconstructPath(prev, end) {
        const path = [];
        let current = end;
        while (current) {
            path.unshift(current);
            current = prev[current.row][current.col];
        }
        for (let i = 1; i < path.length - 1; i++) {
            await this.visualizer.markPath(path[i].row, path[i].col);
        }
    }
}


// Data Structures


class BinarySearchTree {
    constructor() { this.root = null; }

    insert(value) {
        const node = { value, left: null, right: null };
        if (!this.root) { this.root = node; return; }
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) { current.left = node; return; }
                current = current.left;
            } else {
                if (!current.right) { current.right = node; return; }
                current = current.right;
            }
        }
    }

    remove(value) {
        this.root = this._remove(this.root, value);
    }

    _remove(node, value) {
        if (!node) return null;
        if (value < node.value) { node.left = this._remove(node.left, value); }
        else if (value > node.value) { node.right = this._remove(node.right, value); }
        else {
            if (!node.left) return node.right;
            if (!node.right) return node.left;
            let min = node.right;
            while (min.left) min = min.left;
            node.value = min.value;
            node.right = this._remove(node.right, min.value);
        }
        return node;
    }

    toArray() {
        const levels = [];
        const queue = [{ node: this.root, level: 0 }];
        while (queue.length) {
            const { node, level } = queue.shift();
            if (!levels[level]) levels[level] = [];
            levels[level].push(node ? node.value : null);
            if (node) {
                queue.push({ node: node.left, level: level + 1 });
                queue.push({ node: node.right, level: level + 1 });
            }
        }
        while (levels.length && levels[levels.length - 1].every(v => v === null)) levels.pop();
        return levels;
    }

    clear() { this.root = null; }
}

class Stack {
    constructor() { this.items = []; }
    push(item) { this.items.push(item); }
    pop() { return this.items.pop(); }
    peek() { return this.items[this.items.length - 1]; }
    isEmpty() { return this.items.length === 0; }
    toArray() { return [...this.items].reverse(); }
    clear() { this.items = []; }
}

class Queue {
    constructor() { this.items = []; }
    enqueue(item) { this.items.push(item); }
    dequeue() { return this.items.shift(); }
    front() { return this.items[0]; }
    isEmpty() { return this.items.length === 0; }
    toArray() { return [...this.items]; }
    clear() { this.items = []; }
}

class LinkedList {
    constructor() { this.head = null; }
    append(value) {
        const node = { value, next: null };
        if (!this.head) { this.head = node; return; }
        let current = this.head;
        while (current.next) current = current.next;
        current.next = node;
    }
    remove(value) {
        if (!this.head) return;
        if (this.head.value === value) { this.head = this.head.next; return; }
        let current = this.head;
        while (current.next && current.next.value !== value) current = current.next;
        if (current.next) current.next = current.next.next;
    }
    toArray() {
        const arr = [];
        let current = this.head;
        while (current) { arr.push(current.value); current = current.next; }
        return arr;
    }
    clear() { this.head = null; }
}

// Export for app.js
window.SortingAlgorithms = SortingAlgorithms;
window.PathfindingAlgorithms = PathfindingAlgorithms;
window.BinarySearchTree = BinarySearchTree;
window.Stack = Stack;
window.Queue = Queue;
window.LinkedList = LinkedList;
