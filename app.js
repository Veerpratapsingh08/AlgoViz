// Algorithm Visualizer - Main Application
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash').classList.add('hidden');
    }, 2500);
    const sortingViz = new SortingVisualizer();
    const pathfindingViz = new PathfindingVisualizer();
    const dsViz = new DataStructureVisualizer();
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${btn.dataset.tab}-tab`).classList.add('active');
        });
    });
});
class SortingVisualizer {
    constructor() {
        this.array = [];
        this.speed = 50;
        this.isSorting = false;
        this.comparisons = 0;
        this.swapCount = 0;
        this.startTime = 0;
        this.timerInterval = null;
        this.algorithms = new SortingAlgorithms(this);
        this.algorithmInfo = {
            bubble: { name: 'Bubble Sort', desc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if in wrong order.', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            selection: { name: 'Selection Sort', desc: 'Divides input into sorted and unsorted regions, repeatedly selects the smallest element.', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            insertion: { name: 'Insertion Sort', desc: 'Builds final sorted array one item at a time by inserting elements in correct position.', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
            merge: { name: 'Merge Sort', desc: 'Divides array into halves, recursively sorts them, then merges the sorted halves.', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
            quick: { name: 'Quick Sort', desc: 'Picks a pivot element and partitions array around it, recursively sorting subarrays.', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
            heap: { name: 'Heap Sort', desc: 'Builds a max heap from the array, then repeatedly extracts the maximum element.', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' }
        };
        this.init();
    }

    init() {
        this.generateArray();
        document.getElementById('generate-array').addEventListener('click', () => this.generateArray());
        document.getElementById('start-sort').addEventListener('click', () => this.startSort());
        document.getElementById('array-size').addEventListener('input', (e) => {
            document.getElementById('size-value').textContent = e.target.value;
            this.generateArray();
        });
        document.getElementById('sort-speed').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            document.getElementById('speed-value').textContent = this.speed;
        });
        document.getElementById('sorting-algorithm').addEventListener('change', () => this.updateInfo());
        this.updateInfo();
    }

    generateArray() {
        if (this.isSorting) return;
        const size = parseInt(document.getElementById('array-size').value);
        this.array = Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
        this.renderBars();
        this.resetStats();
    }

    renderBars() {
        const container = document.getElementById('bars-container');
        container.innerHTML = '';
        const maxVal = Math.max(...this.array);
        this.array.forEach((val, idx) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(val / maxVal) * 100}%`;
            bar.dataset.index = idx;
            container.appendChild(bar);
        });
    }

    updateInfo() {
        const algo = document.getElementById('sorting-algorithm').value;
        const info = this.algorithmInfo[algo];
        document.getElementById('algo-name').textContent = info.name;
        document.getElementById('algo-description').textContent = info.desc;
        document.getElementById('best-case').textContent = info.best;
        document.getElementById('avg-case').textContent = info.avg;
        document.getElementById('worst-case').textContent = info.worst;
        document.getElementById('space-complexity').textContent = info.space;
    }

    async startSort() {
        if (this.isSorting) return;
        this.isSorting = true;
        this.resetStats();
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 100);

        const algo = document.getElementById('sorting-algorithm').value;
        const arr = [...this.array];

        switch (algo) {
            case 'bubble': await this.algorithms.bubbleSort(arr); break;
            case 'selection': await this.algorithms.selectionSort(arr); break;
            case 'insertion': await this.algorithms.insertionSort(arr); break;
            case 'merge': await this.algorithms.mergeSort(arr); break;
            case 'quick': await this.algorithms.quickSort(arr); break;
            case 'heap': await this.algorithms.heapSort(arr); break;
        }

        clearInterval(this.timerInterval);
        this.updateTimer();
        this.isSorting = false;
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, 201 - this.speed));
    }

    compare(i, j) {
        this.comparisons++;
        document.getElementById('comparisons').textContent = this.comparisons;
        const bars = document.querySelectorAll('.bar');
        if (bars[i]) bars[i].classList.add('comparing');
        if (bars[j]) bars[j].classList.add('comparing');
    }

    swap(i, j) {
        this.swapCount++;
        document.getElementById('swaps').textContent = this.swapCount;
        const bars = document.querySelectorAll('.bar');
        if (bars[i]) bars[i].classList.add('swapping');
        if (bars[j]) bars[j].classList.add('swapping');
        const tempHeight = bars[i].style.height;
        bars[i].style.height = bars[j].style.height;
        bars[j].style.height = tempHeight;
    }

    incrementSwaps() {
        this.swapCount++;
        document.getElementById('swaps').textContent = this.swapCount;
    }

    updateBar(i, value) {
        const bars = document.querySelectorAll('.bar');
        const maxVal = Math.max(...this.array);
        if (bars[i]) bars[i].style.height = `${(value / maxVal) * 100}%`;
    }

    resetColors(...indices) {
        const bars = document.querySelectorAll('.bar');
        indices.forEach(i => {
            if (bars[i]) {
                bars[i].classList.remove('comparing', 'swapping', 'pivot');
            }
        });
    }

    markSorted(i) {
        const bars = document.querySelectorAll('.bar');
        if (bars[i]) {
            bars[i].classList.remove('comparing', 'swapping', 'pivot');
            bars[i].classList.add('sorted');
        }
    }

    markPivot(i) {
        const bars = document.querySelectorAll('.bar');
        if (bars[i]) bars[i].classList.add('pivot');
    }

    resetStats() {
        this.comparisons = 0;
        this.swapCount = 0;
        document.getElementById('comparisons').textContent = '0';
        document.getElementById('swaps').textContent = '0';
        document.getElementById('time-elapsed').textContent = '0.00s';
    }

    updateTimer() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2);
        document.getElementById('time-elapsed').textContent = `${elapsed}s`;
    }
}


// Pathfinding Visualizer

class PathfindingVisualizer {
    constructor() {
        this.rows = 20;
        this.cols = 40;
        this.grid = [];
        this.start = { row: 10, col: 5 };
        this.end = { row: 10, col: 34 };
        this.drawMode = 'wall';
        this.isDrawing = false;
        this.isRunning = false;
        this.algorithms = new PathfindingAlgorithms(this);
        this.init();
    }

    init() {
        this.createGrid();
        document.getElementById('clear-grid').addEventListener('click', () => this.clearGrid());
        document.getElementById('generate-maze').addEventListener('click', () => this.generateMaze());
        document.getElementById('start-pathfinding').addEventListener('click', () => this.startPathfinding());
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.drawMode = btn.dataset.mode;
            });
        });
    }

    createGrid() {
        const container = document.getElementById('grid-container');
        container.style.gridTemplateColumns = `repeat(${this.cols}, 25px)`;
        container.innerHTML = '';
        this.grid = [];

        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                this.grid[r][c] = { isWall: false };

                if (r === this.start.row && c === this.start.col) cell.classList.add('start');
                if (r === this.end.row && c === this.end.col) cell.classList.add('end');

                cell.addEventListener('mousedown', (e) => this.handleMouseDown(e, r, c));
                cell.addEventListener('mouseenter', (e) => this.handleMouseEnter(e, r, c));
                cell.addEventListener('mouseup', () => this.isDrawing = false);
                container.appendChild(cell);
            }
        }
        document.addEventListener('mouseup', () => this.isDrawing = false);
    }

    handleMouseDown(e, row, col) {
        if (this.isRunning) return;
        e.preventDefault();
        this.isDrawing = true;
        this.handleCellClick(row, col);
    }

    handleMouseEnter(e, row, col) {
        if (!this.isDrawing || this.isRunning) return;
        if (this.drawMode === 'wall') this.handleCellClick(row, col);
    }

    handleCellClick(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (!cell) return;

        if (this.drawMode === 'start') {
            document.querySelector('.grid-cell.start')?.classList.remove('start');
            cell.classList.add('start');
            cell.classList.remove('wall', 'visited', 'path');
            this.grid[row][col].isWall = false;
            this.start = { row, col };
        } else if (this.drawMode === 'end') {
            document.querySelector('.grid-cell.end')?.classList.remove('end');
            cell.classList.add('end');
            cell.classList.remove('wall', 'visited', 'path');
            this.grid[row][col].isWall = false;
            this.end = { row, col };
        } else if (this.drawMode === 'wall') {
            if ((row === this.start.row && col === this.start.col) || (row === this.end.row && col === this.end.col)) return;
            cell.classList.toggle('wall');
            this.grid[row][col].isWall = cell.classList.contains('wall');
        }
    }

    clearGrid() {
        if (this.isRunning) return;
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('wall', 'visited', 'path');
        });
        this.grid.forEach(row => row.forEach(cell => cell.isWall = false));
    }

    generateMaze() {
        if (this.isRunning) return;
        this.clearGrid();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if ((r === this.start.row && c === this.start.col) || (r === this.end.row && c === this.end.col)) continue;
                if (Math.random() < 0.3) {
                    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    cell.classList.add('wall');
                    this.grid[r][c].isWall = true;
                }
            }
        }
    }

    async startPathfinding() {
        if (this.isRunning) return;
        this.isRunning = true;
        document.querySelectorAll('.grid-cell.visited, .grid-cell.path').forEach(cell => {
            cell.classList.remove('visited', 'path');
        });

        const algo = document.getElementById('pathfinding-algorithm').value;
        switch (algo) {
            case 'dijkstra': await this.algorithms.dijkstra(this.grid, this.start, this.end); break;
            case 'astar': await this.algorithms.astar(this.grid, this.start, this.end); break;
            case 'bfs': await this.algorithms.bfs(this.grid, this.start, this.end); break;
            case 'dfs': await this.algorithms.dfs(this.grid, this.start, this.end); break;
        }
        this.isRunning = false;
    }

    async visitCell(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell && !cell.classList.contains('start') && !cell.classList.contains('end')) {
            cell.classList.add('visited');
        }
        await new Promise(resolve => setTimeout(resolve, 15));
    }

    async markPath(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) cell.classList.add('path');
        await new Promise(resolve => setTimeout(resolve, 30));
    }
}


// Data Structure Visualizer


class DataStructureVisualizer {
    constructor() {
        this.bst = new BinarySearchTree();
        this.stack = new Stack();
        this.queue = new Queue();
        this.linkedList = new LinkedList();
        this.currentType = 'bst';
        this.init();
    }

    init() {
        document.getElementById('ds-type').addEventListener('change', (e) => {
            this.currentType = e.target.value;
            this.render();
        });
        document.getElementById('ds-insert').addEventListener('click', () => this.insert());
        document.getElementById('ds-remove').addEventListener('click', () => this.remove());
        document.getElementById('ds-clear').addEventListener('click', () => this.clear());
        document.getElementById('ds-value').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.insert();
        });
    }

    insert() {
        const value = parseInt(document.getElementById('ds-value').value);
        if (isNaN(value)) return;
        document.getElementById('ds-value').value = '';

        switch (this.currentType) {
            case 'bst': this.bst.insert(value); break;
            case 'stack': this.stack.push(value); break;
            case 'queue': this.queue.enqueue(value); break;
            case 'linkedlist': this.linkedList.append(value); break;
        }
        this.render();
    }

    remove() {
        const value = parseInt(document.getElementById('ds-value').value);
        document.getElementById('ds-value').value = '';

        switch (this.currentType) {
            case 'bst': if (!isNaN(value)) this.bst.remove(value); break;
            case 'stack': this.stack.pop(); break;
            case 'queue': this.queue.dequeue(); break;
            case 'linkedlist': if (!isNaN(value)) this.linkedList.remove(value); break;
        }
        this.render();
    }

    clear() {
        switch (this.currentType) {
            case 'bst': this.bst.clear(); break;
            case 'stack': this.stack.clear(); break;
            case 'queue': this.queue.clear(); break;
            case 'linkedlist': this.linkedList.clear(); break;
        }
        this.render();
    }

    render() {
        const container = document.getElementById('ds-container');
        container.innerHTML = '';

        switch (this.currentType) {
            case 'bst': this.renderBST(container); break;
            case 'stack': this.renderStack(container); break;
            case 'queue': this.renderQueue(container); break;
            case 'linkedlist': this.renderLinkedList(container); break;
        }
    }

    renderBST(container) {
        const levels = this.bst.toArray();
        if (!levels.length || !this.bst.root) {
            container.innerHTML = '<div class="ds-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><p>Enter a value and click Insert to begin</p></div>';
            return;
        }
        const bstContainer = document.createElement('div');
        bstContainer.className = 'bst-container';
        levels.forEach(level => {
            const levelDiv = document.createElement('div');
            levelDiv.className = 'bst-level';
            level.forEach(val => {
                const nodeDiv = document.createElement('div');
                nodeDiv.className = 'bst-node';
                if (val !== null) {
                    const valueDiv = document.createElement('div');
                    valueDiv.className = 'bst-value';
                    valueDiv.textContent = val;
                    nodeDiv.appendChild(valueDiv);
                }
                levelDiv.appendChild(nodeDiv);
            });
            bstContainer.appendChild(levelDiv);
        });
        container.appendChild(bstContainer);
    }

    renderStack(container) {
        const items = this.stack.toArray();
        if (!items.length) {
            container.innerHTML = '<div class="ds-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><p>Stack is empty</p></div>';
            return;
        }
        const structure = document.createElement('div');
        structure.className = 'linear-structure';
        items.forEach((item, i) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'linear-item';
            itemDiv.textContent = item;
            if (i === 0) itemDiv.style.background = 'linear-gradient(135deg, #10B981 0%, #06D6A0 100%)';
            structure.appendChild(itemDiv);
        });
        container.appendChild(structure);
    }

    renderQueue(container) {
        const items = this.queue.toArray();
        if (!items.length) {
            container.innerHTML = '<div class="ds-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><p>Queue is empty</p></div>';
            return;
        }
        const structure = document.createElement('div');
        structure.className = 'linear-structure horizontal';
        items.forEach((item, i) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'linear-item';
            itemDiv.textContent = item;
            if (i === 0) itemDiv.style.background = 'linear-gradient(135deg, #10B981 0%, #06D6A0 100%)';
            structure.appendChild(itemDiv);
        });
        container.appendChild(structure);
    }

    renderLinkedList(container) {
        const items = this.linkedList.toArray();
        if (!items.length) {
            container.innerHTML = '<div class="ds-empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg><p>Linked List is empty</p></div>';
            return;
        }
        const list = document.createElement('div');
        list.className = 'linked-list';
        items.forEach((item, i) => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'll-node';
            const valueDiv = document.createElement('div');
            valueDiv.className = 'll-value';
            valueDiv.textContent = item;
            nodeDiv.appendChild(valueDiv);
            if (i < items.length - 1) {
                const arrow = document.createElement('span');
                arrow.className = 'll-arrow';
                arrow.textContent = '→';
                nodeDiv.appendChild(arrow);
            }
            list.appendChild(nodeDiv);
        });
        container.appendChild(list);
    }
}
