export type Node<T> = {
    value: T;
    next: Node<T> | null;
} | null;

export type ForEachCallback<T> = (elem: T, index: number) => void;
export type MaxCallback<T> = (elem: T) => number;

export class LinkedList<T> {
    private list: Node<T>;
    private size: number;

    constructor(list: Node<T> = null, size: number = 0) {
        this.list = list;
        this.size = size;
    }

    static from = <T>(arr: Array<T>): LinkedList<T> => {
        const nodes: Node<T>[] = arr.map((elem: T) => ({
            value: elem,
            next: null,
        }));

        for (let i = 0; i < arr.length - 1; i++) {
            nodes[i].next = nodes[i + 1];
        }

        return new LinkedList(nodes[0], arr.length);
    };

    public forEach = (callback: ForEachCallback<T>): void => {
        let currentNode: Node<T> = this.list;
        if (currentNode === null) {
            return;
        }

        for (let i = 0; i < this.size; i++) {
            callback(currentNode.value, i);

            currentNode = currentNode.next;
        }
    };

    public removeIndex = (idx: number): LinkedList<T> => {
        if (this.size === 0) {
            return;
        }

        if (idx < 0 || idx >= this.size) {
            throw new Error('Index outside range');
        }

        if (idx === 0) {
            this.list = this.list.next;
            this.size--;
        }

        let prevNode: Node<T> = this.list;
        let currentNode: Node<T> = prevNode.next;

        for (let i = 1; i < idx; i++) {
            prevNode = prevNode.next;
            currentNode = prevNode.next;
        }

        prevNode.next = currentNode === null ? null : currentNode.next;
        this.size--;
    };

    public findMinAndDelete = (callback: MaxCallback<T>): [T, number] => {
        if (this.size === 0) {
            return [null, Infinity];
        }

        let best: T = this.list.value;
        let bestScore: number = callback(this.list.value);
        let bestIndex: number = 0;

        this.forEach((elem: T, idx: number) => {
            const potentialBest = elem;
            const potentialBestScore = callback(elem);
            if (potentialBestScore < bestScore) {
                best = potentialBest;
                bestScore = potentialBestScore;
                bestIndex = idx;
            }
        });

        this.removeIndex(bestIndex);
        return [best, bestScore];
    };
}
