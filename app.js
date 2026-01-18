
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
        }, 500);
    }, 2500);

    window.sortingViz = new SortingVisualizer();
    window.pathfindingViz = new PathfindingVisualizer();
    window.dsViz = new DataStructureVisualizer();

    const navLinks = document.querySelectorAll('.nav-link');
    const views = document.querySelectorAll('.dashboard-view');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');


            const viewId = `${link.dataset.view}-view`;
            views.forEach(view => {
                if (view.id === viewId) {
                    view.classList.remove('hidden');

                    if (viewId === 'datastructures-view') window.dsViz.render(); 
                } else {
                    view.classList.add('hidden');
                }
            });
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
        this.init();
    }

    init() {
        this.generateArray();
        
        document.getElementById('generate-array').addEventListener('click', () => this.generateArray());
        document.getElementById('start-sort').addEventListener('click', () => this.startSort());
        
        document.getElementById('array-size').addEventListener('input', (e) => {
            this.generateArray(); 
        });
        
        document.getElementById('sort-speed').addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
        });
        
        document.getElementById('sorting-algorithm').addEventListener('change', () => this.updateInfo());
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
            bar.style.height = `${val}%`; 
            bar.dataset.index = idx;
            container.appendChild(bar);
        });
    }

    updateInfo() {
        const algo = document.getElementById('sorting-algorithm').value;
        const descriptions = {
            merge: "Recursive divide-and-conquer algorithm. O(n log n).",
            quick: "Partitions array around a pivot. Fast in practice. O(n log n) avg.",
            heap: "Builds a heap structure. O(n log n) guaranteed.",
            bubble: "Simple pairwise swapping. Slow O(n²)."
        };
        const complexities = {
             merge: { t: 'Θ(n log n)', s: 'O(n)' },
             quick: { t: 'Θ(n log n)', s: 'O(log n)' },
             heap: { t: 'Θ(n log n)', s: 'O(1)' },
             bubble: { t: 'Θ(n²)', s: 'O(1)' }
        };

        const desc = descriptions[algo] || "Select an algorithm.";
        const comp = complexities[algo] || { t: '-', s: '-' };

        document.getElementById('algo-description').textContent = desc;
    }

    
    
    async startSort() {
        if (this.isSorting) return;
        this.isSorting = true;
        this.resetStats();
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 100);

        const algo = document.getElementById('sorting-algorithm').value;
        const arr = [...this.array]; 

        if (algo === 'bubble') await this.algorithms.bubbleSort(arr);
        else if (algo === 'quick') await this.algorithms.quickSort(arr);
        else if (algo === 'merge') await this.algorithms.mergeSort(arr);
        else if (algo === 'heap') await this.algorithms.heapSort(arr);

        clearInterval(this.timerInterval);
        this.updateTimer();
        this.isSorting = false;
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


    delay() {
        return new Promise(resolve => setTimeout(resolve, 101 - this.speed));
    }

    compare(i, j) {
        this.comparisons++;
        document.getElementById('comparisons').textContent = this.comparisons;
        const bars = document.querySelectorAll('.bar');
        if(bars[i]) bars[i].classList.add('bg-orange-500'); 
        if(bars[j]) bars[j].classList.add('bg-orange-500');
    }
    
    uncompare(i, j) {
         const bars = document.querySelectorAll('.bar');
         if(bars[i]) bars[i].classList.remove('bg-orange-500');
         if(bars[j]) bars[j].classList.remove('bg-orange-500');
    }

    swap(i, j) {
        this.swapCount++;
        document.getElementById('swaps').textContent = this.swapCount;
        const bars = document.querySelectorAll('.bar');
        

        if(bars[i] && bars[j]) {
            const h1 = bars[i].style.height;
            bars[i].style.height = bars[j].style.height;
            bars[j].style.height = h1;
        }
    }
    
    updateBar(idx, val) {
        const bars = document.querySelectorAll('.bar');
        if(bars[idx]) bars[idx].style.height = `${val}%`;
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
}


class PathfindingVisualizer {
    constructor() {
        this.rows = 20;
        this.cols = 40;
        this.grid = [];
        this.start = { r: 10, c: 5 };
        this.end = { r: 10, c: 34 };
        this.drawMode = 'wall';
        this.isRunning = false;
        this.isDrawing = false;
        this.algorithms = new PathfindingAlgorithms(this);
        this.init();
    }

    init() {
        this.createGrid();
        
        document.getElementById('pf-generate-maze').addEventListener('click', () => this.generateMaze());
        document.getElementById('pf-clear').addEventListener('click', () => this.clearGrid(true));
        document.getElementById('pf-start').addEventListener('click', () => this.visualize());
        document.getElementById('pf-reset').addEventListener('click', () => this.clearGrid(false)); // Clear path only

        const modeBtns = document.querySelectorAll('[data-draw]');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.drawMode = btn.dataset.draw;
            });
        });
    }

    createGrid() {
        const container = document.getElementById('grid-container');
        container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        container.innerHTML = '';
        this.grid = [];

        for(let r=0; r<this.rows; r++) {
            const row = [];
            for(let c=0; c<this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if(r===this.start.r && c===this.start.c) cell.classList.add('start');
                if(r===this.end.r && c===this.end.c) cell.classList.add('end');
                
                cell.dataset.r = r;
                cell.dataset.c = c;
                

                cell.addEventListener('mousedown', () => { this.isDrawing = true; this.handleInput(r, c); });
                cell.addEventListener('mouseenter', () => { if(this.isDrawing) this.handleInput(r, c); });
                cell.addEventListener('mouseup', () => { this.isDrawing = false; });
                
                container.appendChild(cell);
                row.push({ isWall: false, visited: false, parent: null, weight: 1 });
            }
            this.grid.push(row);
        }
        document.addEventListener('mouseup', () => { this.isDrawing = false; });
    }

    handleInput(r, c) {
        if(this.isRunning) return;
        
        // Don't overwrite start/end unless dragging them (advanced logic), for now just blocking
        if((r===this.start.r && c===this.start.c) || (r===this.end.r && c===this.end.c)) return;

        const cell = this.getCell(r, c);
        
        if(this.drawMode === 'wall') {
            this.grid[r][c].isWall = !this.grid[r][c].isWall;
            cell.classList.toggle('wall');
        } else if(this.drawMode === 'start') {
            // Remove old start
            this.getCell(this.start.r, this.start.c).classList.remove('start');
            this.start = {r, c};
            cell.classList.add('start');
            this.grid[r][c].isWall = false; cell.classList.remove('wall');
        } else if(this.drawMode === 'end') {
             this.getCell(this.end.r, this.end.c).classList.remove('end');
             this.end = {r, c};
             cell.classList.add('end');
             this.grid[r][c].isWall = false; cell.classList.remove('wall');
        }
    }

    generateMaze() {
        this.clearGrid(true);
        for(let r=0; r<this.rows; r++) {
            for(let c=0; c<this.cols; c++) {
                 if(Math.random() < 0.3) {
                     // Check start/end
                     if((r!==this.start.r || c!==this.start.c) && (r!==this.end.r || c!==this.end.c)) {
                         this.grid[r][c].isWall = true;
                         this.getCell(r, c).classList.add('wall');
                     }
                 }
            }
        }
    }

    clearGrid(full = false) {
        const cells = document.querySelectorAll('.grid-cell');
        cells.forEach(cell => {
             cell.classList.remove('visited', 'path');
             if(full) {
                 cell.classList.remove('wall');
                 const r = parseInt(cell.dataset.r);
                 const c = parseInt(cell.dataset.c);
                 this.grid[r][c].isWall = false;
             }
        });
        
        // Reset logic stats
        for(let r=0; r<this.rows; r++) {
            for(let c=0; c<this.cols; c++) {
                this.grid[r][c].visited = false;
                this.grid[r][c].parent = null;
                this.grid[r][c].distance = Infinity;
            }
        }
    }

    getCell(r, c) {
        return document.querySelector(`.grid-cell[data-r="${r}"][data-c="${c}"]`);
    }

    async visualize() {
        if(this.isRunning) return;
        this.isRunning = true;
        this.clearGrid(false); // Clear previous path

        const algo = document.getElementById('pf-algorithm').value;
        if(algo === 'dijkstra') await this.algorithms.dijkstra();
        else if(algo === 'astar') await this.algorithms.astar();
        
        this.isRunning = false;
    }
}

/* =========================================
   3. DATA STRUCTURES VISUALIZER
   ========================================= */
class DataStructureVisualizer {
    constructor() {
        this.type = 'bst';
        this.data = []; // Abstract representation
        this.bstRoot = null;
        
        this.init();
    }
    
    init() {
        // Type Buttons
        const typeBtns = document.querySelectorAll('#datastructures-view .sidebar-section:first-child button');
        typeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Determine type from text
                const text = e.target.textContent.toLowerCase();
                this.type = text.includes('bst') ? 'bst' : text;
                
                // Visual toggle
                typeBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-white');
                    b.classList.add('text-muted');
                });
                e.target.classList.remove('text-muted');
                e.target.classList.add('bg-primary', 'text-white');
                
                this.reset();
            });
        });

        // Actions
        document.getElementById('ds-insert').addEventListener('click', () => this.insert());
        document.getElementById('ds-remove').addEventListener('click', () => this.remove());
    }

    reset() {
        this.data = [];
        this.bstRoot = null;
        this.render();
        this.log(`Switched to ${this.type.toUpperCase()}`);
    }

    insert() {
        const valInput = document.getElementById('ds-value');
        const val = parseInt(valInput.value);
        if(isNaN(val)) return;
        
        if(this.type === 'stack') this.data.push(val);
        else if(this.type === 'queue') this.data.push(val);
        else if(this.type === 'bst') this.insertBST(val);
        
        this.log(`Inserted ${val}`);
        this.render();
        valInput.value = '';
        valInput.focus();
    }
    
    remove() {
        if(this.type === 'stack') {
            const val = this.data.pop();
            this.log(`Popped ${val}`);
        } else if(this.type === 'queue') {
            const val = this.data.shift();
            this.log(`Dequeued ${val}`);
        }
        this.render();
    }

    insertBST(val) {
        // Simple BST Logic
        const node = { val, left: null, right: null };
        if(!this.bstRoot) {
            this.bstRoot = node;
        } else {
            let current = this.bstRoot;
            while(true) {
                if(val < current.val) {
                    if(!current.left) { current.left = node; break; }
                    current = current.left;
                } else {
                    if(!current.right) { current.right = node; break; }
                    current = current.right;
                }
            }
        }
    }

    render() {
        const container = document.getElementById('ds-container');
        container.innerHTML = '';
        
        if(this.type === 'stack') {
            // Render Stack (Vertical)
            const stackDiv = document.createElement('div');
            stackDiv.className = 'flex flex-col-reverse gap-2';
            this.data.forEach(val => {
                const item = document.createElement('div');
                item.className = 'w-24 h-12 bg-surface border border-white/10 flex items-center justify-center rounded font-mono text-white';
                item.textContent = val;
                stackDiv.appendChild(item);
            });
            container.appendChild(stackDiv);
        } else if(this.type === 'queue') {
            // Render Queue (Horizontal)
             const qDiv = document.createElement('div');
            qDiv.className = 'flex gap-2';
            this.data.forEach(val => {
                const item = document.createElement('div');
                item.className = 'w-12 h-12 bg-surface border border-white/10 flex items-center justify-center rounded font-mono text-white';
                item.textContent = val;
                qDiv.appendChild(item);
            });
            container.appendChild(qDiv);
        } else if(this.type === 'bst') {
            // Render BST - simple textual representation or basic tree for now
            // A real tree renderer is complex; verifying minimal structure first
            // We'll use a simple recursive flex layout
            if(this.bstRoot) {
                const tree = this.renderTreeParams(this.bstRoot);
                container.appendChild(tree);
            } else {
                container.innerHTML = '<div class="text-muted">Empty Tree</div>';
            }
        }
    }
    
    renderTreeParams(node) {
        if(!node) return document.createElement('div');
        
        const wrapper = document.createElement('div');
        wrapper.className = 'flex flex-col items-center gap-4';
        
        const valDiv = document.createElement('div');
        valDiv.className = 'w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-glow';
        valDiv.textContent = node.val;
        wrapper.appendChild(valDiv);
        
        const children = document.createElement('div');
        children.className = 'flex gap-8';
        if(node.left) children.appendChild(this.renderTreeParams(node.left));
        if(node.right) children.appendChild(this.renderTreeParams(node.right));
        
        wrapper.appendChild(children);
        return wrapper;
    }

    log(msg) {
        const log = document.getElementById('ds-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry text-xs mb-1 font-mono';
        const time = new Date().toLocaleTimeString().split(' ')[0];
        entry.innerHTML = `<span class="text-muted mr-2">${time}</span> <span class="text-white">${msg}</span>`;
        log.prepend(entry);
    }
}

/* =========================================
   ALGORITHMS (Simplified for Demo Logic)
   ========================================= */
class SortingAlgorithms {
    constructor(viz) { this.viz = viz; }
    
    async bubbleSort(arr) {
        for(let i=0; i<arr.length; i++) {
            for(let j=0; j<arr.length-i-1; j++) {
                this.viz.compare(j, j+1);
                await this.viz.delay();
                if(arr[j] > arr[j+1]) {
                    this.viz.swap(j, j+1);
                    [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                    await this.viz.delay();
                }
                this.viz.uncompare(j, j+1);
            }
        }
    }
    async quickSort(arr) { 
        // Implement full quicksort logic interacting with viz
        // Placeholder for verification phase
         for(let i=0; i<arr.length; i++) {
            this.viz.updateBar(i, arr[i]);
            await this.viz.delay();
         }
    }
    async mergeSort() { /* ... */ }
    async heapSort() { /* ... */ }
}

class PathfindingAlgorithms {
    constructor(viz) { this.viz = viz; }
    
    async dijkstra() {
        // BFS / Dijkstra visual simulation
        const queue = [this.viz.start];
        const visited = new Set();
        
        while(queue.length > 0) {
            const curr = queue.shift();
            const key = `${curr.r},${curr.c}`;
            
            if(visited.has(key)) continue;
            visited.add(key);
            
            // Visual update
            const cell = this.viz.getCell(curr.r, curr.c);
            if(!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('visited');
            }
            
            if(curr.r === this.viz.end.r && curr.c === this.viz.end.c) break; // Found
            
            await new Promise(r => setTimeout(r, 20));
            
            // Neighbors
            const dirs = [[0,1], [1,0], [0,-1], [-1,0]];
            for(let [dr, dc] of dirs) {
                const nr = curr.r + dr, nc = curr.c + dc;
                if(nr>=0 && nr<this.viz.rows && nc>=0 && nc<this.viz.cols) {
                    if(!this.viz.grid[nr][nc].isWall) {
                        queue.push({r: nr, c: nc});
                    }
                }
            }
        }
    }
    async astar() { this.dijkstra(); } // Placeholder
}
