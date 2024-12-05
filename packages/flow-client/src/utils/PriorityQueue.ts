interface QueueNode {
  val: number;
  priority: number;
}

export class PriorityQueue {
  values: QueueNode[];

  constructor() {
    this.values = [];
  }

  enqueue(val: number, priority: number): void {
    this.values.push({ val, priority });
    this.sort();
  }

  dequeue(): QueueNode | undefined {
    return this.values.shift();
  }

  sort(): void {
    this.values.sort((a, b) => a.priority - b.priority);
  }
}
