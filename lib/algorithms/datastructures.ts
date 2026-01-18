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
    insert(root: BSTNode | null, value: number): BSTNode {
        if (!root) return new BSTNode(value);
        
        // Return new reference for immutable state updates
        const node = new BSTNode(root.value);
        node.x = root.x;
        node.y = root.y;
        node.left = root.left;
        node.right = root.right;
        
        if (value < root.value) node.left = this.insert(root.left, value);
        else if (value > root.value) node.right = this.insert(root.right, value);
        
        return node;
    },

    search(root: BSTNode | null, value: number): boolean {
        if (!root) return false;
        if (root.value === value) return true;
        return value < root.value ? this.search(root.left, value) : this.search(root.right, value);
    },
    
    // Calculates visual layout coordinates
    layout(root: BSTNode | null, x: number, y: number, level: number, width: number) {
        if (!root) return;
        root.x = x;
        root.y = y;
        const offset = width / (Math.pow(2, level + 1));
        this.layout(root.left, x - offset, y + 60, level + 1, width);
        this.layout(root.right, x + offset, y + 60, level + 1, width);
    }
};
