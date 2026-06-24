export type StudyContent = {
  title: string;
  description: string[];
  best: string;
  avg: string;
  worst: string;
  space: string;
  characteristics: string[];
  code: {
    typescript: string;
    python: string;
    java: string;
    cpp: string;
  };
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
    code: {
      typescript: `function mergeSort(arr: number[]): number[] {
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
}`,
      python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
        
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
      java: `public class MergeSort {
    public static void sort(int[] arr) {
        if (arr.length <= 1) return;
        
        int mid = arr.length / 2;
        int[] left = new int[mid];
        int[] right = new int[arr.length - mid];
        
        System.arraycopy(arr, 0, left, 0, mid);
        System.arraycopy(arr, mid, right, 0, arr.length - mid);
        
        sort(left);
        sort(right);
        merge(arr, left, right);
    }
    
    private static void merge(int[] arr, int[] left, int[] right) {
        int i = 0, j = 0, k = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) arr[k++] = left[i++];
            else arr[k++] = right[j++];
        }
        
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`,
      cpp: `#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> temp(r - l + 1);
    int i = l, j = m + 1, k = 0;
    
    while (i <= m && j <= r) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    
    while (i <= m) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];
    
    for (i = l; i <= r; i++) {
        arr[i] = temp[i - l];
    }
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`
    }
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
    code: {
      typescript: `function quickSort(arr: number[], low = 0, high = arr.length - 1) {
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
}`,
      python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
        
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
            
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      java: `public class QuickSort {
    public static void sort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIdx = partition(arr, low, high);
            sort(arr, low, pivotIdx - 1);
            sort(arr, pivotIdx + 1, high);
        }
    }
    
    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        return i + 1;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}`
    }
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
    code: {
      typescript: `function heapSort(arr: number[]) {
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
}`,
      python: `def heap_sort(arr):
    n = len(arr)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
        
    # Extract elements
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)
    return arr

def heapify(arr, n, i):
    largest = i
    left = 2 * i + 1
    right = 2 * i + 2
    
    if left < n and arr[left] > arr[largest]:
        largest = left
    if right < n and arr[right] > arr[largest]:
        largest = right
        
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
      java: `public class HeapSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
            
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            
            heapify(arr, i, 0);
        }
    }
    
    private static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        
        if (largest != i) {
            int swap = arr[i];
            arr[i] = arr[largest];
            arr[largest] = swap;
            
            heapify(arr, n, largest);
        }
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    
    for (int i = n / 2 - 1; i >= 0; i--)
        heapify(arr, n, i);
        
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`
    }
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
    code: {
      typescript: `function bubbleSort(arr: number[]) {
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
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    swapped = True
    while swapped:
        swapped = False
        for i in range(n - 1):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        n -= 1
    return arr`,
      java: `public class BubbleSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        boolean swapped;
        do {
            swapped = false;
            for (int i = 0; i < n - 1; i++) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    bool swapped;
    do {
        swapped = false;
        for (int i = 0; i < n - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                swap(arr[i], arr[i + 1]);
                swapped = true;
            }
        }
        n--;
    } while (swapped);
}`
    }
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
    code: {
      typescript: `function selectionSort(arr: number[]) {
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
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        if min_idx != i:
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      java: `public class SelectionSort {
    public static void sort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx != i) {
                int temp = arr[i];
                arr[i] = arr[minIdx];
                arr[minIdx] = temp;
            }
        }
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx != i) {
            swap(arr[i], arr[minIdx]);
        }
    }
}`
    }
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
    code: {
      typescript: `function insertionSort(arr: number[]) {
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
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
            
        arr[j + 1] = key
    return arr`,
      java: `public class InsertionSort {
    public static void sort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }
}`,
      cpp: `#include <vector>
using namespace std;

void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    }
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
    code: {
      typescript: `// Conceptual pseudo-code
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
}`,
      python: `import heapq

def dijkstra(graph, start):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        current_distance, current_node = heapq.heappop(pq)
        
        if current_distance > distances[current_node]:
            continue
            
        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return distances`,
      java: `import java.util.*;

public class Dijkstra {
    public void computePaths(Node source) {
        source.minDistance = 0.;
        PriorityQueue<Node> pq = new PriorityQueue<>();
        pq.add(source);

        while (!pq.isEmpty()) {
            Node u = pq.poll();

            for (Edge e : u.adjacencies) {
                Node v = e.target;
                double weight = e.weight;
                double distanceThroughU = u.minDistance + weight;
                if (distanceThroughU < v.minDistance) {
                    pq.remove(v);
                    v.minDistance = distanceThroughU ;
                    v.previous = u;
                    pq.add(v);
                }
            }
        }
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;
const int INF = 1e9;

void dijkstra(int s, vector<vector<pair<int, int>>>& adj, vector<int>& d) {
    d.assign(adj.size(), INF);
    d[s] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> q;
    q.push({0, s});
    
    while (!q.empty()) {
        int v = q.top().second;
        int d_v = q.top().first;
        q.pop();
        
        if (d_v != d[v]) continue;
        
        for (auto edge : adj[v]) {
            int to = edge.first;
            int len = edge.second;
            
            if (d[v] + len < d[to]) {
                d[to] = d[v] + len;
                q.push({d[to], to});
            }
        }
    }
}`
    }
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
    code: {
      typescript: `// Conceptual pseudo-code
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
}`,
      python: `import heapq

def a_star(graph, start, goal, h):
    open_set = []
    heapq.heappush(open_set, (0, start))
    g_score = {node: float('inf') for node in graph}
    g_score[start] = 0
    f_score = {node: float('inf') for node in graph}
    f_score[start] = h(start, goal)
    
    while open_set:
        current_f, current = heapq.heappop(open_set)
        
        if current == goal:
            return True
            
        for neighbor, weight in graph[current].items():
            tentative_g = g_score[current] + weight
            
            if tentative_g < g_score[neighbor]:
                g_score[neighbor] = tentative_g
                f_score[neighbor] = tentative_g + h(neighbor, goal)
                heapq.heappush(open_set, (f_score[neighbor], neighbor))
                
    return False`,
      java: `public class AStar {
    public void search(Node start, Node goal) {
        PriorityQueue<Node> openSet = new PriorityQueue<>(Comparator.comparingDouble(n -> n.fScore));
        start.gScore = 0;
        start.fScore = heuristic(start, goal);
        openSet.add(start);

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();
            if (current.equals(goal)) return;

            for (Edge edge : current.neighbors) {
                Node neighbor = edge.target;
                double tentativeGScore = current.gScore + edge.weight;

                if (tentativeGScore < neighbor.gScore) {
                    neighbor.gScore = tentativeGScore;
                    neighbor.fScore = tentativeGScore + heuristic(neighbor, goal);
                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }
    }
    private double heuristic(Node a, Node b) { /* Return estimated distance */ return 0; }
}`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

struct Node {
    int id; double f, g;
    bool operator>(const Node& other) const { return f > other.f; }
};

void aStar(int start, int goal, vector<vector<pair<int, double>>>& adj) {
    priority_queue<Node, vector<Node>, greater<Node>> openSet;
    vector<double> gScore(adj.size(), 1e9);
    
    gScore[start] = 0;
    openSet.push({start, heuristic(start, goal), 0});
    
    while (!openSet.empty()) {
        int current = openSet.top().id;
        openSet.pop();
        
        if (current == goal) return;
        
        for (auto& edge : adj[current]) {
            int neighbor = edge.first;
            double tentativeG = gScore[current] + edge.second;
            
            if (tentativeG < gScore[neighbor]) {
                gScore[neighbor] = tentativeG;
                double fScore = tentativeG + heuristic(neighbor, goal);
                openSet.push({neighbor, fScore, tentativeG});
            }
        }
    }
}`
    }
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
    code: {
      typescript: `function bfs(graph, start, goal) {
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
}`,
      python: `from collections import deque

def bfs(graph, start, goal):
    queue = deque([start])
    visited = {start}
    
    while queue:
        current = queue.popleft()
        
        if current == goal:
            return True
            
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return False`,
      java: `import java.util.*;

public class BFS {
    public boolean search(Map<Integer, List<Integer>> graph, int start, int goal) {
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        
        queue.add(start);
        visited.add(start);
        
        while (!queue.isEmpty()) {
            int current = queue.poll();
            
            if (current == goal) return true;
            
            for (int neighbor : graph.getOrDefault(current, new ArrayList<>())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        return false;
    }
}`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

bool bfs(vector<vector<int>>& adj, int start, int goal) {
    queue<int> q;
    vector<bool> visited(adj.size(), false);
    
    q.push(start);
    visited[start] = true;
    
    while (!q.empty()) {
        int current = q.front();
        q.pop();
        
        if (current == goal) return true;
        
        for (int neighbor : adj[current]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
    return false;
}`
    }
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
    code: {
      typescript: `function dfs(graph, current, goal, visited = new Set()) {
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
}`,
      python: `def dfs(graph, current, goal, visited=None):
    if visited is None:
        visited = set()
        
    if current == goal:
        return True
        
    visited.add(current)
    
    for neighbor in graph[current]:
        if neighbor not in visited:
            if dfs(graph, neighbor, goal, visited):
                return True
                
    return False`,
      java: `import java.util.*;

public class DFS {
    public boolean search(Map<Integer, List<Integer>> graph, int current, int goal, Set<Integer> visited) {
        if (current == goal) return true;
        
        visited.add(current);
        
        for (int neighbor : graph.getOrDefault(current, new ArrayList<>())) {
            if (!visited.contains(neighbor)) {
                if (search(graph, neighbor, goal, visited)) {
                    return true;
                }
            }
        }
        return false;
    }
}`,
      cpp: `#include <vector>
using namespace std;

bool dfs(vector<vector<int>>& adj, int current, int goal, vector<bool>& visited) {
    if (current == goal) return true;
    
    visited[current] = true;
    
    for (int neighbor : adj[current]) {
        if (!visited[neighbor]) {
            if (dfs(adj, neighbor, goal, visited)) {
                return true;
            }
        }
    }
    return false;
}`
    }
  },

  kruskal: {
    title: "Kruskal's Algorithm (MST)",
    description: [
      "Kruskal's Algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a connected weighted undirected graph.",
      "It works by sorting all the edges from the lowest weight to the highest, and then adding them one by one to the MST.",
      "To prevent cycles from forming when adding edges, it uses a Union-Find (Disjoint Set) data structure."
    ],
    best: 'O(E log E)',
    avg: 'O(E log E)',
    worst: 'O(E log E)',
    space: 'O(V + E)',
    characteristics: ['Greedy Algorithm', 'Finds Minimum Spanning Tree', 'Uses Union-Find', 'Works well on sparse graphs'],
    code: {
      typescript: `class UnionFind {
  parent: {[key: string]: string} = {};
  constructor(nodes: string[]) {
      nodes.forEach(n => this.parent[n] = n);
  }
  find(i: string): string {
      if (this.parent[i] === i) return i;
      return this.parent[i] = this.find(this.parent[i]);
  }
  union(i: string, j: string) {
      let root_i = this.find(i);
      let root_j = this.find(j);
      if (root_i !== root_j) {
          this.parent[root_i] = root_j;
      }
  }
}

function kruskal(nodes: string[], edges: {from: string, to: string, weight: number}[]) {
  const uf = new UnionFind(nodes);
  const mst = [];
  edges.sort((a, b) => a.weight - b.weight);

  for (const edge of edges) {
      if (uf.find(edge.from) !== uf.find(edge.to)) {
          uf.union(edge.from, edge.to);
          mst.push(edge);
      }
  }
  return mst;
}`,
      python: `class UnionFind:
    def __init__(self, nodes):
        self.parent = {n: n for n in nodes}
        
    def find(self, i):
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]
        
    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j

def kruskal(nodes, edges):
    uf = UnionFind(nodes)
    mst = []
    edges.sort(key=lambda e: e['weight'])
    
    for edge in edges:
        if uf.find(edge['from']) != uf.find(edge['to']):
            uf.union(edge['from'], edge['to'])
            mst.append(edge)
            
    return mst`,
      java: `import java.util.*;

class Edge implements Comparable<Edge> {
    int src, dest, weight;
    public int compareTo(Edge compareEdge) {
        return this.weight - compareEdge.weight;
    }
}

class subset { int parent, rank; }

public class Kruskal {
    int find(subset subsets[], int i) {
        if (subsets[i].parent != i)
            subsets[i].parent = find(subsets, subsets[i].parent);
        return subsets[i].parent;
    }
    
    void Union(subset subsets[], int x, int y) {
        int xroot = find(subsets, x);
        int yroot = find(subsets, y);
        
        if (subsets[xroot].rank < subsets[yroot].rank)
            subsets[xroot].parent = yroot;
        else if (subsets[xroot].rank > subsets[yroot].rank)
            subsets[yroot].parent = xroot;
        else {
            subsets[yroot].parent = xroot;
            subsets[xroot].rank++;
        }
    }
}`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

struct Edge { int src, dest, weight; };

struct subset { int parent; int rank; };

int find(subset subsets[], int i) {
    if (subsets[i].parent != i)
        subsets[i].parent = find(subsets, subsets[i].parent);
    return subsets[i].parent;
}

void Union(subset subsets[], int x, int y) {
    int xroot = find(subsets, x);
    int yroot = find(subsets, y);
    
    if (subsets[xroot].rank < subsets[yroot].rank)
        subsets[xroot].parent = yroot;
    else if (subsets[xroot].rank > subsets[yroot].rank)
        subsets[yroot].parent = xroot;
    else {
        subsets[yroot].parent = xroot;
        subsets[xroot].rank++;
    }
}`
    }
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
    code: {
      typescript: `class Node {
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
}`,
      python: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
    if root.val == key:
        return root
    elif root.val < key:
        root.right = insert(root.right, key)
    else:
        root.left = insert(root.left, key)
    return root

def search(root, key):
    if root is None or root.val == key:
        return root
    if root.val < key:
        return search(root.right, key)
    return search(root.left, key)`,
      java: `class Node {
    int key;
    Node left, right;
    public Node(int item) {
        key = item;
        left = right = null;
    }
}

public class BST {
    Node root;
    
    Node insertRec(Node root, int key) {
        if (root == null) {
            root = new Node(key);
            return root;
        }
        if (key < root.key)
            root.left = insertRec(root.left, key);
        else if (key > root.key)
            root.right = insertRec(root.right, key);
        return root;
    }
    
    public Node search(Node root, int key) {
        if (root == null || root.key == key)
            return root;
        if (root.key > key)
            return search(root.left, key);
        return search(root.right, key);
    }
}`,
      cpp: `#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    Node(int item) {
        key = item;
        left = right = NULL;
    }
};

Node* insert(Node* node, int key) {
    if (node == NULL) return new Node(key);
    if (key < node->key)
        node->left = insert(node->left, key);
    else if (key > node->key)
        node->right = insert(node->right, key);
    return node;
}

Node* search(Node* root, int key) {
    if (root == NULL || root->key == key)
       return root;
    if (root->key < key)
       return search(root->right, key);
    return search(root->left, key);
}`
    }
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
    code: {
      typescript: `class Stack<T> {
  private items: T[] = [];
  
  push(element: T): void {
    this.items.push(element);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
  
  isEmpty(): boolean {
    return this.items.length === 0;
  }
}`,
      python: `class Stack:
    def __init__(self):
        self.items = []
        
    def push(self, item):
        self.items.append(item)
        
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
            
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
            
    def is_empty(self):
        return len(self.items) == 0`,
      java: `import java.util.ArrayList;

public class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();
    
    public void push(T item) {
        items.add(item);
    }
    
    public T pop() {
        if (!isEmpty()) {
            return items.remove(items.size() - 1);
        }
        return null;
    }
    
    public T peek() {
        if (!isEmpty()) {
            return items.get(items.size() - 1);
        }
        return null;
    }
    
    public boolean isEmpty() {
        return items.isEmpty();
    }
}`,
      cpp: `#include <vector>
using namespace std;

template <typename T>
class Stack {
private:
    vector<T> items;
public:
    void push(T item) {
        items.push_back(item);
    }
    
    void pop() {
        if (!isEmpty()) {
            items.pop_back();
        }
    }
    
    T top() {
        if (!isEmpty()) {
            return items.back();
        }
        throw runtime_error("Stack is empty");
    }
    
    bool isEmpty() {
        return items.empty();
    }
};`
    }
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
    code: {
      typescript: `class Queue<T> {
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
}`,
      python: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
        
    def enqueue(self, item):
        self.items.append(item)
        
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
            
    def is_empty(self):
        return len(self.items) == 0`,
      java: `import java.util.LinkedList;
import java.util.Queue;

public class QueueExample<T> {
    private Queue<T> q = new LinkedList<>();
    
    public void enqueue(T item) {
        q.add(item);
    }
    
    public T dequeue() {
        return q.poll();
    }
    
    public boolean isEmpty() {
        return q.isEmpty();
    }
}`,
      cpp: `#include <queue>
using namespace std;

template <typename T>
class Queue {
private:
    queue<T> q;
public:
    void enqueue(T item) {
        q.push(item);
    }
    
    void dequeue() {
        if (!q.empty()) {
            q.pop();
        }
    }
    
    T front() {
        if (!q.empty()) {
            return q.front();
        }
        throw runtime_error("Queue is empty");
    }
    
    bool isEmpty() {
        return q.empty();
    }
};`
    }
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
    code: {
      typescript: `class Node<T> {
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
}`,
      python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            self.tail = new_node
            return
        self.tail.next = new_node
        self.tail = new_node
        
    def delete(self, key):
        curr = self.head
        if curr and curr.data == key:
            self.head = curr.next
            return
            
        prev = None
        while curr and curr.data != key:
            prev = curr
            curr = curr.next
            
        if curr is None:
            return
            
        if curr == self.tail:
            self.tail = prev
            
        prev.next = curr.next`,
      java: `class Node<T> {
    T data;
    Node<T> next;
    Node(T d) { data = d; next = null; }
}

public class LinkedList<T> {
    Node<T> head;
    Node<T> tail;
    
    public void append(T new_data) {
        Node<T> new_node = new Node<>(new_data);
        if (head == null) {
            head = new Node<>(new_data);
            tail = head;
            return;
        }
        tail.next = new_node;
        tail = new_node;
    }
    
    public void delete(T key) {
        Node<T> temp = head, prev = null;
        if (temp != null && temp.data.equals(key)) {
            head = temp.next;
            return;
        }
        while (temp != null && !temp.data.equals(key)) {
            prev = temp;
            temp = temp.next;
        }
        if (temp == null) return;
        if (temp == tail) tail = prev;
        prev.next = temp.next;
    }
}`,
      cpp: `#include <iostream>
using namespace std;

template <typename T>
struct Node {
    T data;
    Node* next;
    Node(T val) : data(val), next(nullptr) {}
};

template <typename T>
class LinkedList {
    Node<T>* head;
    Node<T>* tail;
public:
    LinkedList() : head(nullptr), tail(nullptr) {}
    
    void append(T val) {
        Node<T>* newNode = new Node<T>(val);
        if (!head) {
            head = tail = newNode;
            return;
        }
        tail->next = newNode;
        tail = newNode;
    }
    
    void remove(T key) {
        Node<T> *temp = head, *prev = nullptr;
        if (temp != nullptr && temp->data == key) {
            head = temp->next;
            delete temp;
            return;
        }
        while (temp != nullptr && temp->data != key) {
            prev = temp;
            temp = temp->next;
        }
        if (temp == nullptr) return;
        if (temp == tail) tail = prev;
        prev->next = temp->next;
        delete temp;
    }
};`
    }
  }
};
