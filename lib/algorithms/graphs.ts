export type GraphNode = {
    id: string;
    x: number;
    y: number;
};

export type GraphEdge = {
    id: string;
    from: string;
    to: string;
    weight: number;
};

export type GraphStep = {
    type: 'checking_edge' | 'selected_edge' | 'checking_node' | 'visited_node' | 'path_found' | 'rejected_edge';
    edgeId?: string;
    nodeId?: string;
    pathEdges?: string[]; // Array of edge IDs for the final path
};

class UnionFind {
    parent: {[key: string]: string} = {};
    constructor(nodes: GraphNode[]) {
        nodes.forEach(n => this.parent[n.id] = n.id);
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

export const GraphAlgorithms = {
    kruskal: (nodes: GraphNode[], edges: GraphEdge[]): GraphStep[] => {
        const steps: GraphStep[] = [];
        const uf = new UnionFind(nodes);
        
        // Sort edges by weight
        const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
        
        let edgesAdded = 0;
        
        for (const edge of sortedEdges) {
            steps.push({ type: 'checking_edge', edgeId: edge.id });
            
            const root1 = uf.find(edge.from);
            const root2 = uf.find(edge.to);
            
            if (root1 !== root2) {
                uf.union(edge.from, edge.to);
                steps.push({ type: 'selected_edge', edgeId: edge.id });
                edgesAdded++;
                if (edgesAdded === nodes.length - 1) break;
            } else {
                steps.push({ type: 'rejected_edge', edgeId: edge.id });
            }
        }
        
        return steps;
    },

    dijkstra: (nodes: GraphNode[], edges: GraphEdge[], startId: string, endId: string): GraphStep[] => {
        const steps: GraphStep[] = [];
        
        const dist: {[key: string]: number} = {};
        const visited: {[key: string]: boolean} = {};
        const previousEdge: {[key: string]: string} = {}; // Maps nodeId -> edgeId used to reach it
        const previousNode: {[key: string]: string} = {}; // Maps nodeId -> previous nodeId
        
        nodes.forEach(n => {
            dist[n.id] = Infinity;
            visited[n.id] = false;
        });
        
        dist[startId] = 0;
        
        // Build adjacency list
        const adj: {[key: string]: {to: string, edgeId: string, weight: number}[]} = {};
        nodes.forEach(n => adj[n.id] = []);
        
        edges.forEach(e => {
            adj[e.from].push({ to: e.to, edgeId: e.id, weight: e.weight });
            // Assuming undirected graph
            adj[e.to].push({ to: e.from, edgeId: e.id, weight: e.weight });
        });

        for (let i = 0; i < nodes.length; i++) {
            // Find min distance unvisited node
            let minDist = Infinity;
            let u = null;
            for (const node of nodes) {
                if (!visited[node.id] && dist[node.id] < minDist) {
                    minDist = dist[node.id];
                    u = node.id;
                }
            }
            
            if (u === null || minDist === Infinity) break;
            
            visited[u] = true;
            steps.push({ type: 'visited_node', nodeId: u });
            
            if (u === endId) {
                // Backtrack to find path
                const pathEdges: string[] = [];
                let curr = endId;
                while (curr !== startId) {
                    if (!previousEdge[curr]) break;
                    pathEdges.push(previousEdge[curr]);
                    curr = previousNode[curr];
                }
                steps.push({ type: 'path_found', pathEdges });
                return steps;
            }
            
            for (const neighbor of adj[u]) {
                if (!visited[neighbor.to]) {
                    steps.push({ type: 'checking_edge', edgeId: neighbor.edgeId });
                    
                    const newDist = dist[u] + neighbor.weight;
                    if (newDist < dist[neighbor.to]) {
                        dist[neighbor.to] = newDist;
                        previousEdge[neighbor.to] = neighbor.edgeId;
                        previousNode[neighbor.to] = u;
                        // Visualize discovering a better path
                        steps.push({ type: 'selected_edge', edgeId: neighbor.edgeId });
                    }
                }
            }
        }
        
        return steps;
    }
};
