export type Step =
  | { type: 'compare', idx: [number, number] }
  | { type: 'swap', idx: [number, number], val: [number, number] }
  | { type: 'overwrite', idx: number, val: number }
  | { type: 'sorted', idx: number };

export const Sort = {
    bubble(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        const n = a.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                steps.push({ type: 'compare', idx: [j, j + 1] });

                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    steps.push({ type: 'swap', idx: [j, j + 1], val: [a[j], a[j + 1]] });
                }
            }
            steps.push({ type: 'sorted', idx: n - i - 1 });
        }
        steps.push({ type: 'sorted', idx: 0 });
        return steps;
    },

    selection(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        const n = a.length;

        for (let i = 0; i < n - 1; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                steps.push({ type: 'compare', idx: [min, j] });
                if (a[j] < a[min]) {
                    min = j;
                }
            }
            if (min !== i) {
                [a[i], a[min]] = [a[min], a[i]];
                steps.push({ type: 'swap', idx: [i, min], val: [a[i], a[min]] });
            }
            steps.push({ type: 'sorted', idx: i });
        }
        steps.push({ type: 'sorted', idx: n - 1 });
        return steps;
    },

    insertion(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        const n = a.length;

        for (let i = 1; i < n; i++) {
            const key = a[i];
            let j = i - 1;

            steps.push({ type: 'compare', idx: [i, Math.max(0, j)] });

            while (j >= 0 && a[j] > key) {
                steps.push({ type: 'compare', idx: [j, i] });
                steps.push({ type: 'overwrite', idx: j + 1, val: a[j] });
                a[j + 1] = a[j];
                j--;
            }
            steps.push({ type: 'overwrite', idx: j + 1, val: key });
            a[j + 1] = key;
        }
        for(let i=0; i<n; i++) steps.push({ type: 'sorted', idx: i });
        return steps;
    },

    merge(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        this._mergeSort(a, 0, a.length - 1, steps);
        for(let i=0; i<a.length; i++) steps.push({ type: 'sorted', idx: i });
        return steps;
    },

    _mergeSort(a: number[], left: number, right: number, steps: Step[]) {
        if (left >= right) return;
        const mid = Math.floor((left + right) / 2);
        this._mergeSort(a, left, mid, steps);
        this._mergeSort(a, mid + 1, right, steps);
        this._merge(a, left, mid, right, steps);
    },

    _merge(a: number[], left: number, mid: number, right: number, steps: Step[]) {
        const temp = [];
        let i = left, j = mid + 1;

        while (i <= mid && j <= right) {
            steps.push({ type: 'compare', idx: [i, j] });
            if (a[i] <= a[j]) {
                temp.push(a[i++]);
            } else {
                temp.push(a[j++]);
            }
        }
        while (i <= mid) temp.push(a[i++]);
        while (j <= right) temp.push(a[j++]);

        for (let k = 0; k < temp.length; k++) {
            steps.push({ type: 'overwrite', idx: left + k, val: temp[k] });
            a[left + k] = temp[k];
        }
    },

    quick(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        this._quickSort(a, 0, a.length - 1, steps);
        for(let i=0; i<a.length; i++) steps.push({ type: 'sorted', idx: i });
        return steps;
    },

    _quickSort(a: number[], low: number, high: number, steps: Step[]) {
        if (low < high) {
            const pi = this._partition(a, low, high, steps);
            this._quickSort(a, low, pi - 1, steps);
            this._quickSort(a, pi + 1, high, steps);
        }
    },

    _partition(a: number[], low: number, high: number, steps: Step[]): number {
        const pivot = a[high];
        let i = (low - 1);

        for (let j = low; j < high; j++) {
            steps.push({ type: 'compare', idx: [j, high] });
            if (a[j] < pivot) {
                i++;
                [a[i], a[j]] = [a[j], a[i]];
                steps.push({ type: 'swap', idx: [i, j], val: [a[i], a[j]] });
            }
        }
        [a[i + 1], a[high]] = [a[high], a[i + 1]];
        steps.push({ type: 'swap', idx: [i + 1, high], val: [a[i + 1], a[high]] });
        return i + 1;
    },

    heap(arr: number[]): Step[] {
        const steps: Step[] = [];
        const a = [...arr];
        const n = a.length;

        for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
            this._heapify(a, n, i, steps);

        for (let i = n - 1; i > 0; i--) {
            [a[0], a[i]] = [a[i], a[0]];
            steps.push({ type: 'swap', idx: [0, i], val: [a[0], a[i]] });

            steps.push({ type: 'sorted', idx: i });

            this._heapify(a, i, 0, steps);
        }
        steps.push({ type: 'sorted', idx: 0 });
        return steps;
    },

    _heapify(a: number[], n: number, i: number, steps: Step[]) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n) {
            steps.push({ type: 'compare', idx: [left, largest] });
            if (a[left] > a[largest]) largest = left;
        }

        if (right < n) {
            steps.push({ type: 'compare', idx: [right, largest] });
            if (a[right] > a[largest]) largest = right;
        }

        if (largest !== i) {
            [a[i], a[largest]] = [a[largest], a[i]];
            steps.push({ type: 'swap', idx: [i, largest], val: [a[i], a[largest]] });

            this._heapify(a, n, largest, steps);
        }
    }
};
