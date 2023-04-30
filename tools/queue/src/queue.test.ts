import { expect, test, describe } from "vitest";
import { createQueue } from "./queue";

describe("queue", () => {
  type TestEntry = {
    name: string;
    value: number;
  };

  test(".enqueue()", () => {
    const queue = createQueue<TestEntry>();

    expect(queue.count()).toEqual(0);

    queue.enqueue({ name: "test", value: 1 });

    expect(queue.count()).toEqual(1);
  });

  test(".dequeue()", () => {
    const queue = createQueue<TestEntry>();

    queue.enqueue({ name: "test", value: 1 });

    expect(queue.count()).toEqual(1);

    const entry = queue.dequeue();
    expect(queue.count()).toEqual(0);
    expect(entry?.name).toEqual("test");
    expect(entry?.value).toEqual(1);
  });
});
