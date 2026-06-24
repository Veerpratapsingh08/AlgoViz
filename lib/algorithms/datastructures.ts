export class BSTNode {
    value: number;
    left: BSTNode | null;
    right: BSTNode | null;
    x: number = 0;
    y: number = 0;

    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export const TreeUtils = {
    insert(root: BSTNode | null, value: number): { root: BSTNode; isDuplicate: boolean } {
        if (!root) return { root: new BSTNode(value), isDuplicate: false };

        // Return new reference for immutable state updates
        const node = new BSTNode(root.value);
        node.x = root.x;
        node.y = root.y;
        node.left = root.left;
        node.right = root.right;

        if (value < root.value) {
            const result = this.insert(root.left, value);
            node.left = result.root;
            return { root: node, isDuplicate: result.isDuplicate };
        } else if (value > root.value) {
            const result = this.insert(root.right, value);
            node.right = result.root;
            return { root: node, isDuplicate: result.isDuplicate };
        } else {
            // Duplicate: return unchanged tree
            return { root: node, isDuplicate: true };
        }
    },

    // Delete a node — handles all 3 cases (leaf, one child, two children)
    delete(root: BSTNode | null, value: number): { root: BSTNode | null; deleted: boolean } {
        if (!root) return { root: null, deleted: false };

        let deleted = false;

        if (value < root.value) {
            const result = this.delete(root.left, value);
            const node = new BSTNode(root.value);
            node.x = root.x; node.y = root.y;
            node.left = result.root;
            node.right = root.right;
            return { root: node, deleted: result.deleted };
        } else if (value > root.value) {
            const result = this.delete(root.right, value);
            const node = new BSTNode(root.value);
            node.x = root.x; node.y = root.y;
            node.left = root.left;
            node.right = result.root;
            return { root: node, deleted: result.deleted };
        } else {
            // Found the node to delete
            deleted = true;

            // Case 1: Leaf node
            if (!root.left && !root.right) return { root: null, deleted };

            // Case 2: One child
            if (!root.left) return { root: root.right, deleted };
            if (!root.right) return { root: root.left, deleted };

            // Case 3: Two children — find inorder successor (smallest in right subtree)
            let successor = root.right;
            while (successor.left) successor = successor.left;

            const result = this.delete(root.right, successor.value);
            const node = new BSTNode(successor.value);
            node.x = root.x; node.y = root.y;
            node.left = root.left;
            node.right = result.root;
            return { root: node, deleted };
        }
    },

    search(root: BSTNode | null, value: number): BSTNode | null {
        if (!root) return null;
        if (root.value === value) return root;
        return value < root.value ? this.search(root.left, value) : this.search(root.right, value);
    },

    // Count nodes for display
    size(root: BSTNode | null): number {
        if (!root) return 0;
        return 1 + this.size(root.left) + this.size(root.right);
    },

    // Height of tree
    height(root: BSTNode | null): number {
        if (!root) return 0;
        return 1 + Math.max(this.height(root.left), this.height(root.right));
    },

    // Calculates visual layout coordinates using in-order traversal for proper spacing
    layout(root: BSTNode | null, canvasWidth: number = 800, startY: number = 50) {
        // Assign in-order rank to each node to space evenly
        const nodes: BSTNode[] = [];
        this._inOrder(root, nodes);
        const count = nodes.length;
        const hSpace = Math.min(60, Math.max(28, canvasWidth / (count + 1)));
        nodes.forEach((n, i) => {
            n.x = (i + 1) * hSpace;
        });
        // Now assign y based on depth
        this._assignY(root, startY, 60);
    },

    _inOrder(root: BSTNode | null, result: BSTNode[]) {
        if (!root) return;
        this._inOrder(root.left, result);
        result.push(root);
        this._inOrder(root.right, result);
    },

    _assignY(root: BSTNode | null, y: number, gap: number) {
        if (!root) return;
        root.y = y;
        this._assignY(root.left, y + gap, gap);
        this._assignY(root.right, y + gap, gap);
    }
};
