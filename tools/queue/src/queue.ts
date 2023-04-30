export const createQueue = <Entry>() => {
  const queue: Record<number, Entry> = {};
  let tail = 0;
  let head = 0;
  let count = 0;

  const enqueue = (entry: Entry) => {
    queue[tail++] = entry;
    count++;
  };

  const dequeue = () => {
    if (tail === head) {
      return;
    }

    const entry = queue[head];
    delete queue[head++];
    count--;
    return entry;
  };

  return {
    enqueue,
    dequeue,
    count: () => count,
  };
};
